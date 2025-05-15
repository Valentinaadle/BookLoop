const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const { searchBooks, addBookFromGoogle } = require('../controllers/googleBooksController');

// Rutas de Google Books
router.get('/search', searchBooks);
router.post('/google', addBookFromGoogle);

// Rutas CRUD básicas
router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router; 