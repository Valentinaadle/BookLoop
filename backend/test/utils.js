// Funciones utilitarias para tests

// Validaciones básicas
function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  
  const trimmed = email.trim();
  if (trimmed === '') return false;
  
  // Regex más estricto para emails
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Validaciones adicionales
  if (trimmed.includes('..')) return false; // No permitir puntos consecutivos
  if (trimmed.startsWith('.') || trimmed.endsWith('.')) return false;
  if (trimmed.includes('@.') || trimmed.includes('.@')) return false;
  
  return emailRegex.test(trimmed);
}

function validatePrice(price) {
  if (price === null || price === undefined) return false;
  if (typeof price === 'string') {
    price = parseFloat(price);
  }
  return typeof price === 'number' && price > 0 && !isNaN(price);
}

function formatPrice(price) {
  if (!validatePrice(price)) return 'Precio no disponible';
  return `$${parseFloat(price).toFixed(2)}`;
}

function calculateDiscount(originalPrice, discountPercent) {
  if (!validatePrice(originalPrice) || discountPercent === null || discountPercent === undefined) return null;
  if (typeof discountPercent === 'string') {
    discountPercent = parseFloat(discountPercent);
  }
  if (typeof discountPercent !== 'number' || isNaN(discountPercent)) return null;
  if (discountPercent > 100 || discountPercent < 0) return null;
  
  const discount = (originalPrice * discountPercent) / 100;
  return originalPrice - discount;
}

// Validaciones de stock
function validateStock(stock) {
  if (stock === null || stock === undefined || stock === '') return false;
  if (typeof stock === 'string') {
    if (stock.trim() === '') return false;
    stock = parseInt(stock);
  }
  return typeof stock === 'number' && stock >= 0 && !isNaN(stock);
}

// Validaciones de ISBN
function validateISBN(isbn) {
  if (!isbn || typeof isbn !== 'string') return false;
  
  // Limpiar el ISBN de guiones y espacios
  const cleanISBN = isbn.replace(/[-\s]/g, '');
  
  // Verificar longitud (10 o 13 dígitos)
  if (cleanISBN.length !== 10 && cleanISBN.length !== 13) return false;
  
  // Verificar que todos sean dígitos
  if (!/^\d+$/.test(cleanISBN)) return false;
  
  return true;
}

// Validaciones de campos requeridos
function validateRequiredFields(fields) {
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) return false;
  
  const requiredFields = ['title', 'authors', 'price'];
  
  for (const field of requiredFields) {
    if (!fields[field] || (typeof fields[field] === 'string' && fields[field].trim() === '')) {
      return false;
    }
  }
  
  return true;
}

// Validación completa de datos de libro
function validateBookData(bookData) {
  const result = { valid: true, errors: [] };
  
  if (!bookData || typeof bookData !== 'object') {
    result.valid = false;
    result.errors.push('Datos del libro inválidos');
    return result;
  }
  
  // Validar título
  if (!bookData.title || typeof bookData.title !== 'string' || bookData.title.trim() === '') {
    result.valid = false;
    result.errors.push('El título es requerido');
  }
  
  // Validar autores
  if (!bookData.authors || (Array.isArray(bookData.authors) && bookData.authors.length === 0) || 
      (typeof bookData.authors === 'string' && bookData.authors.trim() === '')) {
    result.valid = false;
    result.errors.push('Los autores son requeridos');
  }
  
  // Validar precio
  if (!validatePrice(bookData.price)) {
    result.valid = false;
    result.errors.push('El precio debe ser un número mayor a 0');
  }
  
  // Validar stock
  if (bookData.quantity !== undefined && !validateStock(bookData.quantity)) {
    result.valid = false;
    result.errors.push('La cantidad debe ser un número mayor o igual a 0');
  }
  
  return result;
}

// Formateo de autores
function formatAuthor(authors) {
  if (!authors) return 'Autor desconocido';
  
  // Si es un string, intentar parsearlo como JSON
  if (typeof authors === 'string') {
    const trimmed = authors.trim();
    if (trimmed === '') return 'Autor desconocido';
    
    // Intentar parsear como JSON
      try {
      const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
        authors = parsed;
      } else {
        return trimmed; // Retornar como string si no es un array JSON
      }
    } catch (e) {
      return trimmed; // Retornar como string si no es JSON válido
    }
  }
  
  // Si es un array
  if (Array.isArray(authors)) {
    const validAuthors = authors.filter(author => 
      author && typeof author === 'string' && author.trim() !== ''
    );
    
    if (validAuthors.length === 0) return 'Autor desconocido';
    return validAuthors.join(', ');
  }
  
  // Si no es string ni array
  if (typeof authors !== 'string') return 'Autor desconocido';
  
  return authors.trim() || 'Autor desconocido';
}

// Formateo de título de libro
function formatBookTitle(title) {
  if (!title || typeof title !== 'string') return 'Título no disponible';
  const cleaned = title.trim();
  return cleaned === '' ? 'Título no disponible' : cleaned;
}

// Manejo de imágenes de libro
const DEFAULT_IMAGE = '/Assets/images/default-book.png';

function getBookImage(book, apiUrl = '') {
  if (!book || typeof book !== 'object' || Array.isArray(book)) {
    return DEFAULT_IMAGE;
  }
  
  // Prioridad 1: coverimageurl
  if (book.coverimageurl && typeof book.coverimageurl === 'string' && book.coverimageurl.trim() !== '') {
    const coverUrl = book.coverimageurl.trim();
    if (coverUrl.startsWith('/Assets/') || coverUrl.startsWith('http')) {
      return coverUrl;
    }
    return apiUrl ? `${apiUrl}${coverUrl}` : coverUrl;
  }
  
  // Prioridad 2: primer elemento del array images
  if (Array.isArray(book.images) && book.images.length > 0) {
    const firstImage = book.images[0];
    if (firstImage && typeof firstImage === 'string' && firstImage.trim() !== '') {
      const imageUrl = firstImage.trim();
      if (imageUrl.startsWith('/Assets/') || imageUrl.startsWith('http')) {
        return imageUrl;
      }
      return apiUrl ? `${apiUrl}${imageUrl}` : imageUrl;
    }
  }
  
  // Prioridad 3: imageurl
  if (book.imageurl && typeof book.imageurl === 'string' && book.imageurl.trim() !== '') {
    const imageUrl = book.imageurl.trim();
    if (imageUrl.startsWith('/Assets/') || imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return apiUrl ? `${apiUrl}${imageUrl}` : imageUrl;
  }
  
  // Prioridad 4: imagen
  if (book.imagen && typeof book.imagen === 'string' && book.imagen.trim() !== '') {
    const imageUrl = book.imagen.trim();
    if (imageUrl.startsWith('/Assets/') || imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return apiUrl ? `${apiUrl}${imageUrl}` : imageUrl;
  }
  
  return DEFAULT_IMAGE;
}

// Lógica de negocio
function isBookAvailable(book) {
  if (!book || typeof book !== 'object' || Array.isArray(book)) {
    return false;
  }
  
  if (!book.hasOwnProperty('available')) {
    return false;
  }
  
  const available = book.available;
  
  // Convertir a boolean
  if (typeof available === 'boolean') return available;
  if (typeof available === 'string') return available.toLowerCase() === 'true';
  if (typeof available === 'number') return available === 1;
  
  return false;
}

function getBookCondition(condition) {
  if (!condition || typeof condition !== 'string') {
    return 'No especificado';
  }
  
  const trimmed = condition.trim();
  if (trimmed === '') return 'No especificado';
  
  const validConditions = ['nuevo', 'muy bueno', 'bueno', 'regular', 'malo'];
  const lowerCondition = trimmed.toLowerCase();
  
  if (validConditions.includes(lowerCondition)) {
    return trimmed; // Retornar en el formato original (mayúsculas/minúsculas)
  }
  
  return 'No especificado';
}

// Validaciones de strings
function validateString(str, minLength = 1, maxLength = 255) {
  if (!str || typeof str !== 'string') return false;
  return str.trim().length >= minLength && str.length <= maxLength;
}

function sanitizeString(str) {
  if (!str || typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
}

// Validaciones de fechas
function validateDate(date) {
  if (!date) return false;
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

function formatDate(date) {
  if (!validateDate(date)) return null;
  const dateObj = new Date(date);
  return dateObj.toISOString().split('T')[0];
}

// Validaciones de arrays
function validateArray(arr, minLength = 0) {
  return Array.isArray(arr) && arr.length >= minLength;
}

function removeDuplicates(arr) {
  if (!validateArray(arr)) return [];
  return [...new Set(arr)];
}

// Validaciones de números
function validateNumber(num, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
  if (num === null || num === undefined) return false;
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  return typeof numValue === 'number' && !isNaN(numValue) && numValue >= min && numValue <= max;
}

function randomNumber(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Utilidades de objetos
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

function isEmpty(obj) {
  if (!obj) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
}

// Utilidades de strings avanzadas
function capitalizeFirst(str) {
  if (!validateString(str)) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function generateSlug(str) {
  if (!validateString(str)) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Mock de funciones para tests
function createMockFunction() {
  const calls = [];
  const fn = function(...args) {
    calls.push(args);
    return fn.returnValue;
  };
  
  fn.calls = calls;
  fn.returnValue = null;
  fn.returns = function(value) {
    fn.returnValue = value;
    return fn;
  };
  fn.calledWith = function(...expectedArgs) {
    return calls.some(callArgs => 
      callArgs.length === expectedArgs.length &&
      callArgs.every((arg, index) => arg === expectedArgs[index])
    );
  };
  
  return fn;
}

// Utilidades de tiempo para tests
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getCurrentTimestamp() {
  return new Date().toISOString();
}

// Exportar todas las funciones
module.exports = {
  validateEmail,
  validatePrice,
  formatPrice,
  calculateDiscount,
  validateStock,
  validateISBN,
  validateRequiredFields,
  validateBookData,
  formatAuthor,
  formatBookTitle,
  getBookImage,
  isBookAvailable,
  getBookCondition,
  validateString,
  sanitizeString,
  validateDate,
  formatDate,
  validateArray,
  removeDuplicates,
  validateNumber,
  randomNumber,
  deepClone,
  isEmpty,
  capitalizeFirst,
  generateSlug,
  createMockFunction,
  delay,
  getCurrentTimestamp,
  DEFAULT_IMAGE
}; 