// Función para obtener la URL de la imagen del libro
export function getBookImage(book, API_URL = 'http://localhost:5000') {
  const DEFAULT_BOOK_IMAGE = '/icono2.png';

  // 1. Usar coverImageUrl si existe
  if (book.coverImageUrl) {
    if (book.coverImageUrl.startsWith('http') || book.coverImageUrl.startsWith('/Assets')) {
      return book.coverImageUrl;
    }
    return `${API_URL}${book.coverImageUrl}`;
  }

  // 2. Si hay coverIndex y Images, usar esa imagen como portada
  if (
    typeof book.coverIndex === 'number' &&
    book.Images && Array.isArray(book.Images) &&
    book.Images.length > book.coverIndex &&
    book.Images[book.coverIndex]
  ) {
    const coverImg = book.Images[book.coverIndex].image_url;
    if (coverImg) {
      if (coverImg.startsWith('http') || coverImg.startsWith('/Assets')) {
        return coverImg;
      }
      return `${API_URL}${coverImg}`;
    }
  }

  // 3. Usar la última imagen del array Images
  if (book.Images && Array.isArray(book.Images) && book.Images.length > 0) {
    const lastImage = book.Images[book.Images.length - 1].image_url;
    if (lastImage) {
      if (lastImage.startsWith('http') || lastImage.startsWith('/Assets')) {
        return lastImage;
      }
      return `${API_URL}${lastImage}`;
    }
    // fallback a la primera si la última falla
    const firstImage = book.Images[0].image_url;
    if (firstImage) {
      if (firstImage.startsWith('http') || firstImage.startsWith('/Assets')) {
        return firstImage;
      }
      return `${API_URL}${firstImage}`;
    }
  }

  // Si no hay imágenes en la tabla Images, intentar con imageUrl
  if (book.imageUrl) {
    // Si la URL es absoluta, usarla directamente
    if (book.imageUrl.startsWith('http') || book.imageUrl.startsWith('/Assets')) {
      return book.imageUrl;
    }
    // Si es una ruta relativa, agregar el API_URL
    return `${API_URL}${book.imageUrl}`;
  }

  // Si no hay imageUrl, intentar con imagen
  if (book.imagen) {
    // Si la URL es absoluta, usarla directamente
    if (book.imagen.startsWith('http') || book.imagen.startsWith('/Assets')) {
      return book.imagen;
    }
    // Si es una ruta relativa, agregar el API_URL
    return `${API_URL}${book.imagen}`;
  }

  // Si no hay ninguna imagen, intentar con Google Books
  if (book.volumeInfo && book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
    return book.volumeInfo.imageLinks.thumbnail;
  }

  // Si no hay ninguna imagen, usar la imagen por defecto
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