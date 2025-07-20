// Script para actualizar las URLs de imágenes en la tabla 'images' de Supabase
// Solo para imágenes que aún tienen /uploads/ en image_url
// Requiere: npm install @supabase/supabase-js dotenv

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const BUCKET = 'book-images';
const PUBLIC_URL_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;

(async () => {
  try {
    // Traer todas las imágenes con image_url local
    const { data: images, error } = await supabase
      .from('images')
      .select('image_id, image_url, book_id')
      .like('image_url', '/uploads/%');

    if (error) throw error;
    if (!images.length) {
      console.log('No hay imágenes locales por actualizar.');
      return;
    }

    for (const img of images) {
      // Extraer extensión y timestamp del nombre local
      // Ejemplo: /uploads/1752986354708-xxxxxxx.png
      const localName = img.image_url.split('/').pop();
      const ext = localName.split('.').pop();
      // Buscar el ID de la imagen para armar el nuevo nombre
      // Convención: book_{book_id}_{timestamp}.{ext}
      // Buscar el timestamp (primer bloque numérico largo)
      const match = localName.match(/(\d{10,})/);
      const timestamp = match ? match[1] : Date.now();
      const newFileName = `book_${img.book_id}_${timestamp}.${ext}`;
      const newUrl = PUBLIC_URL_PREFIX + newFileName;

      // Actualizar en Supabase
      const { error: updateError } = await supabase
        .from('images')
        .update({ image_url: newUrl })
        .eq('image_id', img.image_id);

      if (updateError) {
        console.error(`Error actualizando image_id ${img.image_id}:`, updateError.message);
      } else {
        console.log(`image_id ${img.image_id} actualizado a ${newUrl}`);
      }
    }
    console.log('Actualización de URLs completada.');
  } catch (err) {
    console.error('Error general:', err);
  }
})();
