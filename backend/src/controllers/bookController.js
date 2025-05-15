const { Book } = require('../models');

// Obtener todos los libros
const getBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un libro por ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo libro
const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar un libro
const updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    await book.update(req.body);
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un libro
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    await book.destroy();
    res.json({ message: 'Libro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
}; 