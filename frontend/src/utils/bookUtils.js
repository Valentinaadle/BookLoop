// Función para obtener la URL de la imagen del libro
export function getBookImage(book) {
  const DEFAULT_BOOK_IMAGE = '/Assets/images/default-book.png';

  // Helper para decidir si es URL absoluta válida (solo http/https)
  const isValidUrl = (url) => typeof url === 'string' && url.startsWith('http');

  // 1. Usar la primera imagen válida del array images
  if (book.images && Array.isArray(book.images)) {
    const validImg = book.images.find(isValidUrl);
    if (validImg) return validImg;
  }
  // 2. Usar coverimageurl si es válida
  if (isValidUrl(book.coverimageurl)) {
    return book.coverimageurl;
  }
  // 3. Usar imageurl si es válida
  if (isValidUrl(book.imageurl)) {
    return book.imageurl;
  }
  // 4. Usar campo "imagen" si es válida
  if (isValidUrl(book.imagen)) {
    return book.imagen;
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