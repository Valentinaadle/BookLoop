const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
  addBookToLibrary,
  getLibraryBooks
} = require('../controllers/bookController');
const { addBookFromGoogle } = require('../controllers/googleBooksController');

// Rutas de Google Books
router.get('/search', searchBooks);
router.post('/google', addBookFromGoogle);

// Rutas CRUD básicas
router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

// Agregar libro de Google Books a la biblioteca
router.post('/add', addBookToLibrary);

// Obtener todos los libros de la biblioteca
router.get('/library', getLibraryBooks);

module.exports = router; 