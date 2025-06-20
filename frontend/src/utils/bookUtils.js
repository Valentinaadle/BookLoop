// Función para obtener la URL de la imagen del libro
export function getBookImage(book, API_URL = 'http://localhost:5000') {
  const DEFAULT_BOOK_IMAGE = '/icono2.png';

  // 1. Usar coverimageurl si existe
  if (book.coverimageurl) {
    if (book.coverimageurl.startsWith('http') || book.coverimageurl.startsWith('/Assets')) {
      return book.coverimageurl;
    }
    return `${API_URL}${book.coverimageurl}`;
  }
  // 2. Usar la primera imagen del array images
  if (book.images && Array.isArray(book.images) && book.images.length > 0) {
    const imgUrl = book.images[0];
    if (imgUrl.startsWith('http') || imgUrl.startsWith('/Assets')) {
      return imgUrl;
    }
    return `${API_URL}${imgUrl}`;
  }
  // 3. Usar imageurl si existe
  if (book.imageurl) {
    if (book.imageurl.startsWith('http') || book.imageurl.startsWith('/Assets')) {
      return book.imageurl;
    }
    return `${API_URL}${book.imageurl}`;
  }
  // 4. Usar campo "imagen" si existe
  if (book.imagen) {
    if (book.imagen.startsWith('http') || book.imagen.startsWith('/Assets')) {
      return book.imagen;
    }
    return `${API_URL}${book.imagen}`;
  }
  // 5. Si no hay ninguna imagen, usar la imagen por defecto
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