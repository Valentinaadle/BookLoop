const Book = require('../models/Book');

// Obtener todos los libros
const getBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ message: 'Error al obtener libros' });
  }
};

// Obtener un libro por ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Libro no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener libro:', error);
    res.status(500).json({ message: 'Error al obtener libro' });
  }
};

// Crear un nuevo libro
const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    console.error('Error al crear libro:', error);
    res.status(500).json({ message: 'Error al crear libro' });
  }
};

// Actualizar un libro
const updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.json(book);
    } else {
      res.status(404).json({ message: 'Libro no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar libro:', error);
    res.status(500).json({ message: 'Error al actualizar libro' });
  }
};

// Eliminar un libro
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.json({ message: 'Libro eliminado' });
    } else {
      res.status(404).json({ message: 'Libro no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar libro:', error);
    res.status(500).json({ message: 'Error al eliminar libro' });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
}; 