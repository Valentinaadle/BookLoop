// Función para obtener la URL de la imagen del libro
export function getBookImage(book, API_URL = 'http://localhost:5000') {
  const DEFAULT_BOOK_IMAGE = '/icono2.png';
  if (book.Images && Array.isArray(book.Images) && book.Images.length > 0 && book.Images[0].image_url) {
    const url = book.Images[0].image_url;
    if (url.startsWith('/Assets') || url.startsWith('http')) {
      return url;
    } else {
      return `${API_URL}${url}`;
    }
  } else if (book.imageUrl) {
    const url = book.imageUrl;
    if (url.startsWith('/Assets') || url.startsWith('http')) {
      return url;
    } else {
      return `${API_URL}${url}`;
    }
  } else if (book.imagen) {
    const url = book.imagen;
    if (url.startsWith('/Assets') || url.startsWith('http')) {
      return url;
    } else {
      return `${API_URL}${url}`;
    }
  } else if (book.volumeInfo && book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
    return book.volumeInfo.imageLinks.thumbnail;
  } else {
    return DEFAULT_BOOK_IMAGE;
  }
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