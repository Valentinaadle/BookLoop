// Script para migrar los campos imageurl y coverimageurl de la tabla books a URLs públicas de Supabase
// Si el valor comienza con /uploads/, lo reemplaza por la URL pública correspondiente
// Usa la misma lógica que el script previo de images

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const BUCKET = 'book-images';

function getSupabasePublicUrl(filename) {
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${filename}`;
}

async function migrateBooksImages() {
  // Traer todos los libros donde imageurl o coverimageurl contienen /uploads/
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .or('imageurl.ilike.%/uploads/%', 'coverimageurl.ilike.%/uploads/%');

  if (error) {
    console.error('Error obteniendo libros:', error);
    return;
  }

  let updatedCount = 0;

  for (const book of books) {
    let newImageUrl = book.imageurl;
    let newCoverImageUrl = book.coverimageurl;
    let needsUpdate = false;

    // Procesar imageurl
    if (newImageUrl && newImageUrl.startsWith('/uploads/')) {
      const filename = newImageUrl.replace('/uploads/', '');
      newImageUrl = getSupabasePublicUrl(filename);
      needsUpdate = true;
    }
    // Procesar coverimageurl
    if (newCoverImageUrl && newCoverImageUrl.startsWith('/uploads/')) {
      const filename = newCoverImageUrl.replace('/uploads/', '');
      newCoverImageUrl = getSupabasePublicUrl(filename);
      needsUpdate = true;
    }
    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('books')
        .update({ imageurl: newImageUrl, coverimageurl: newCoverImageUrl })
        .eq('book_id', book.book_id);
      if (updateError) {
        console.error(`Error actualizando libro id ${book.id}:`, updateError);
      } else {
        updatedCount++;
        console.log(`Libro id ${book.id} actualizado.`);
      }
    }
  }

  console.log(`Listo. Libros actualizados: ${updatedCount}`);
}

migrateBooksImages();
