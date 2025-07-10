// Funciones utilitarias puras para BookLoop

// Validaciones de datos
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim();
  
  // Verificar que no haya puntos consecutivos
  if (trimmedEmail.includes('..')) {
    return false;
  }
  
  return emailRegex.test(trimmedEmail);
}

function validatePrice(price) {
  if (price === null || price === undefined || price === '') {
    return false;
  }
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice > 0;
}

function validateStock(stock) {
  if (stock === null || stock === undefined || stock === '') {
    return false;
  }
  const numStock = parseInt(stock);
  return !isNaN(numStock) && numStock >= 0;
}

function validateISBN(isbn) {
  if (!isbn || typeof isbn !== 'string') {
    return false;
  }
  const cleanISBN = isbn.replace(/[^\d]/g, '');
  return cleanISBN.length === 10 || cleanISBN.length === 13;
}

function validateRequiredFields(fields) {
  if (!fields || typeof fields !== 'object') {
    return false;
  }
  
  const requiredFields = ['title', 'authors', 'price'];
  return requiredFields.every(field => 
    fields[field] !== null && 
    fields[field] !== undefined && 
    fields[field] !== ''
  );
}

// Funciones de formateo
function formatPrice(price) {
  if (!validatePrice(price)) {
    return 'Precio no disponible';
  }
  const numPrice = parseFloat(price);
  return `$${numPrice.toFixed(2)}`;
}

function formatAuthor(authors) {
  if (!authors) {
    return 'Autor desconocido';
  }
  
  if (Array.isArray(authors)) {
    const filtered = authors.filter(author => author && author.trim());
    return filtered.length > 0 ? filtered.join(', ') : 'Autor desconocido';
  }
  
  if (typeof authors === 'string') {
    if (authors.trim() === '') {
      return 'Autor desconocido';
    }
    
    if (authors.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(authors);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(author => author && author.trim());
          return filtered.length > 0 ? filtered.join(', ') : 'Autor desconocido';
        }
      } catch (e) {
        return authors.trim();
      }
    }
    return authors.trim();
  }
  
  return 'Autor desconocido';
}

function formatBookTitle(title) {
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return 'Título no disponible';
  }
  return title.trim();
}

// Funciones de imagen
function getBookImage(book, API_URL = 'http://localhost:5000') {
  const DEFAULT_BOOK_IMAGE = '/Assets/images/default-book.png';

  if (!book || typeof book !== 'object') {
    return DEFAULT_BOOK_IMAGE;
  }

  // 1. Usar coverimageurl si existe
  if (book.coverimageurl && book.coverimageurl.trim() !== '') {
    if (book.coverimageurl.startsWith('http') || book.coverimageurl.startsWith('/Assets')) {
      return book.coverimageurl;
    }
    return `${API_URL}${book.coverimageurl}`;
  }

  // 2. Usar la primera imagen del array images
  if (book.images && Array.isArray(book.images) && book.images.length > 0) {
    const imgUrl = book.images[0];
    if (imgUrl && imgUrl.trim() !== '') {
      if (imgUrl.startsWith('http') || imgUrl.startsWith('/Assets')) {
        return imgUrl;
      }
      return `${API_URL}${imgUrl}`;
    }
  }

  // 3. Usar imageurl si existe
  if (book.imageurl && book.imageurl.trim() !== '') {
    if (book.imageurl.startsWith('http') || book.imageurl.startsWith('/Assets')) {
      return book.imageurl;
    }
    return `${API_URL}${book.imageurl}`;
  }

  // 4. Usar campo "imagen" si existe
  if (book.imagen && book.imagen.trim() !== '') {
    if (book.imagen.startsWith('http') || book.imagen.startsWith('/Assets')) {
      return book.imagen;
    }
    return `${API_URL}${book.imagen}`;
  }

  // 5. Si no hay ninguna imagen, usar la imagen por defecto
  return DEFAULT_BOOK_IMAGE;
}

// Lógica de negocio
function calculateDiscount(originalPrice, discountPercentage) {
  if (!validatePrice(originalPrice)) {
    return null;
  }
  
  const price = parseFloat(originalPrice);
  const discount = parseFloat(discountPercentage);
  
  if (isNaN(discount) || discount < 0 || discount > 100) {
    return null;
  }
  
  return price * (1 - discount / 100);
}

function isBookAvailable(book) {
  if (!book || typeof book !== 'object') {
    return false;
  }
  
  return book.available === true || book.available === 'true' || book.available === 1;
}

function getBookCondition(condition) {
  const validConditions = ['nuevo', 'muy bueno', 'bueno', 'regular', 'malo'];
  
  if (!condition || typeof condition !== 'string') {
    return 'No especificado';
  }
  
  const normalizedCondition = condition.toLowerCase().trim();
  
  if (validConditions.includes(normalizedCondition)) {
    return condition.trim();
  }
  
  return 'No especificado';
}

function validateBookData(bookData) {
  if (!bookData || typeof bookData !== 'object') {
    return { valid: false, errors: ['Datos del libro inválidos'] };
  }
  
  const errors = [];
  
  if (!bookData.title || typeof bookData.title !== 'string' || bookData.title.trim() === '') {
    errors.push('El título es requerido');
  }
  
  if (!bookData.authors || (Array.isArray(bookData.authors) && bookData.authors.length === 0)) {
    errors.push('Los autores son requeridos');
  }
  
  if (!validatePrice(bookData.price)) {
    errors.push('El precio debe ser un número mayor a 0');
  }
  
  if (bookData.quantity !== undefined && !validateStock(bookData.quantity)) {
    errors.push('La cantidad debe ser un número mayor o igual a 0');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateEmail,
  validatePrice,
  validateStock,
  validateISBN,
  validateRequiredFields,
  formatPrice,
  formatAuthor,
  formatBookTitle,
  getBookImage,
  calculateDiscount,
  isBookAvailable,
  getBookCondition,
  validateBookData
}; 