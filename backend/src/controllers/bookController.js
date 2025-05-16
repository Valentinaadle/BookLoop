const axios = require('axios');
const { Book } = require('../models');
const { Op } = require('sequelize');

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

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

const searchBooks = async (req, res) => {
    try {
        const { query } = req.query;
        const response = await axios.get(GOOGLE_BOOKS_API_URL, {
            params: {
                q: query,
                maxResults: 20
            }
        });

        const books = response.data.items.map(item => ({
            googleBooksId: item.id,
            title: item.volumeInfo.title,
            author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Autor desconocido',
            description: item.volumeInfo.description,
            publishedDate: item.volumeInfo.publishedDate,
            isbn: item.volumeInfo.industryIdentifiers ? 
                  item.volumeInfo.industryIdentifiers[0].identifier : null,
            pageCount: item.volumeInfo.pageCount,
            imageUrl: item.volumeInfo.imageLinks ? 
                     item.volumeInfo.imageLinks.thumbnail : null,
            categories: item.volumeInfo.categories ? 
                       item.volumeInfo.categories.join(', ') : null,
            language: item.volumeInfo.language,
            averageRating: item.volumeInfo.averageRating
        }));

        res.json(books);
    } catch (error) {
        console.error('Error al buscar libros:', error);
        res.status(500).json({ error: 'Error al buscar libros en Google Books' });
    }
};

const addBookToLibrary = async (req, res) => {
    try {
        const { googleBooksId } = req.body;
        
        // Verificar si el libro ya existe
        const existingBook = await Book.findOne({
            where: { googleBooksId }
        });

        if (existingBook) {
            // Si el libro existe, incrementar la cantidad
            await existingBook.increment('quantity');
            await existingBook.reload();
            return res.json(existingBook);
        }

        // Si el libro no existe, obtener detalles de Google Books
        const response = await axios.get(`${GOOGLE_BOOKS_API_URL}/${googleBooksId}`);
        const bookData = response.data.volumeInfo;

        // Crear nuevo libro en la base de datos
        const newBook = await Book.create({
            googleBooksId,
            title: bookData.title,
            author: bookData.authors ? bookData.authors.join(', ') : 'Autor desconocido',
            description: bookData.description,
            publishedDate: bookData.publishedDate,
            isbn: bookData.industryIdentifiers ? 
                  bookData.industryIdentifiers[0].identifier : null,
            pageCount: bookData.pageCount,
            imageUrl: bookData.imageLinks ? bookData.imageLinks.thumbnail : null,
            categories: bookData.categories ? bookData.categories.join(', ') : null,
            language: bookData.language,
            averageRating: bookData.averageRating,
            quantity: 1,
            available: true
        });

        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error al agregar libro:', error);
        res.status(500).json({ error: 'Error al agregar libro a la biblioteca' });
    }
};

const getLibraryBooks = async (req, res) => {
    try {
        const books = await Book.findAll({
            where: {
                quantity: {
                    [Op.gt]: 0
                }
            }
        });
        res.json(books);
    } catch (error) {
        console.error('Error al obtener libros:', error);
        res.status(500).json({ error: 'Error al obtener libros de la biblioteca' });
    }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
  addBookToLibrary,
  getLibraryBooks
}; 