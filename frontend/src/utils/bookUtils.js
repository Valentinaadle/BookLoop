// Función para obtener la URL de la imagen del libro
// URL base pública del bucket de Supabase (ajustar si cambia el dominio o el bucket)
const SUPABASE_BOOKS_BASE_URL = "https://pghjljkqjzvfhqjzjvhn.supabase.co/storage/v1/object/public/book-images/";

export function getBookImage(book) {
  const DEFAULT_BOOK_IMAGE = '/Assets/images/default-book.png';

  // Helper para decidir si es URL absoluta válida (solo http/https)
  // Valida si es una URL absoluta
  const isValidUrl = (url) => typeof url === 'string' && url.startsWith('http');
  // Valida si es una ruta relativa de Supabase
  const isSupabaseRelative = (url) => typeof url === 'string' && (
    url.startsWith('book-images/') || url.startsWith('public/book-images/')
  );

  // Si alguna imagen es /uploads/ o blob, ignorar y no mostrar
  if (book.images && Array.isArray(book.images)) {
    const invalidImg = book.images.find(img =>
      typeof img === 'string' && (img.startsWith('/uploads/') || img.startsWith('blob:'))
    );
    if (invalidImg) return DEFAULT_BOOK_IMAGE;
  }
  // 1. Usar coverimageurl si es válida
  if (typeof book.coverimageurl === 'string' && (book.coverimageurl.startsWith('/uploads/') || book.coverimageurl.startsWith('blob:'))) {
    return DEFAULT_BOOK_IMAGE;
  }
  if (isValidUrl(book.coverimageurl)) {
    return book.coverimageurl;
  }
  if (isSupabaseRelative(book.coverimageurl)) {
    return SUPABASE_BOOKS_BASE_URL + book.coverimageurl.replace(/^book-images\//, '').replace(/^public\/book-images\//, '');
  }
  // 2. Usar la primera imagen válida del array images
  if (book.images && Array.isArray(book.images)) {
    const validImg = book.images.find(isValidUrl);
    if (validImg) return validImg;
    const supaImg = book.images.find(isSupabaseRelative);
    if (supaImg) return SUPABASE_BOOKS_BASE_URL + supaImg.replace(/^book-images\//, '').replace(/^public\/book-images\//, '');
  }
  // 3. Usar imageurl si es válida
  if (typeof book.imageurl === 'string' && (book.imageurl.startsWith('/uploads/') || book.imageurl.startsWith('blob:'))) {
    return DEFAULT_BOOK_IMAGE;
  }
  if (isValidUrl(book.imageurl)) {
    return book.imageurl;
  }
  if (isSupabaseRelative(book.imageurl)) {
    return SUPABASE_BOOKS_BASE_URL + book.imageurl.replace(/^book-images\//, '').replace(/^public\/book-images\//, '');
  }
  // 4. Usar campo "imagen" si es válida
  if (typeof book.imagen === 'string' && (book.imagen.startsWith('/uploads/') || book.imagen.startsWith('blob:'))) {
    return DEFAULT_BOOK_IMAGE;
  }
  if (isValidUrl(book.imagen)) {
    return book.imagen;
  }
  if (isSupabaseRelative(book.imagen)) {
    return SUPABASE_BOOKS_BASE_URL + book.imagen.replace(/^book-images\//, '').replace(/^public\/book-images\//, '');
  }
  // 5. Si alguna ruta apunta explícitamente a 'book-empty.png', forzar default
  if (
    book.coverimageurl === 'book-empty.png' ||
    book.imageurl === 'book-empty.png' ||
    book.imagen === 'book-empty.png'
  ) {
    return DEFAULT_BOOK_IMAGE;
  }
  // Siempre devolver la ruta relativa para la imagen por defecto
  return DEFAULT_BOOK_IMAGE;
}


// Función para obtener el autor formateado
export function getBookAuthor(book) {
  if (book.authors) {
    if (Array.isArray(book.authors)) {
      return book.authors.join(', ');
    } else if (typeof book.authors === 'string') {
      if (book.authors.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(book.authors);
          if (Array.isArray(parsed)) {
            return parsed.join(', ');
          }
        } catch {
          // Si falla el parseo, sigue abajo
        }
      }
      return book.authors;
    }
  } else if (book.autor) {
    return book.autor;
  } else {
    return '';
  }
} 