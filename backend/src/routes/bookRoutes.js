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
  getLibraryBooks,
  searchBookByISBN,
  uploadImage,
  getBooksByUser,
  searchBooksInDB
} = require('../controllers/bookController');
const { addBookFromGoogle } = require('../controllers/googleBooksController');
const { notifySeller } = require('../controllers/notificationController');

// Rutas de Google Books
router.get('/search', searchBooks);
router.post('/google', addBookFromGoogle);

// Buscar libro por ISBN desde el backend
router.get('/search-isbn', searchBookByISBN);

// Buscar libros en la base de datos
router.get('/search-db', searchBooksInDB);

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

// Subir imagen del libro
router.post('/upload-image', uploadImage);

// Obtener libros publicados por usuario
router.get('/user/:userId', getBooksByUser);

// Notificar al vendedor
router.post('/notify-seller', notifySeller);

module.exports = router; 