const axios = require('axios');
const { Book } = require('../models');
const { Op } = require('sequelize');
const Image = require('../models/Image');
const Category = require('../models/Category');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

// Configuración de multer para guardar archivos en /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Endpoint para subir una imagen y devolver la URL
const uploadImage = [
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }
    // Devolver la URL relativa
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  }
];

// Obtener todos los libros
const getBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [
        { model: require('../models/Image'), attributes: ['image_id', 'image_url'] },
        { model: Category, attributes: ['category_id', 'category_name'] }
      ],
      order: [['createdAt', 'DESC']] // Ordenar por fecha de creación, más reciente primero
    });

    const booksWithGenre = books.map(book => ({
      ...book.toJSON(),
      genre: book.Category ? book.Category.category_name : null
    }));

    res.json(booksWithGenre);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ message: 'Error al obtener libros' });
  }
};

// Obtener un libro por ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [
        { model: require('../models/User'), as: 'seller', attributes: ['nombre', 'apellido', 'email', 'id'] },
        { model: Image, attributes: ['image_id', 'image_url'] },
        { model: Category, attributes: ['category_id', 'category_name'] }
      ]
    });
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error al obtener libro:', error);
    res.status(500).json({ message: 'Error al obtener libro' });
  }
};

// Crear un nuevo libro
const createBook = async (req, res) => {
  try {
    let {
      title,
      authors,
      description,
      imageUrl,
      price,
      quantity,
      available,
      language,
      pageCount,
      seller_id,
      category_id,
      images_id,
      isbn_code,
      condition,
      publication_date,
      images,
      publisher
    } = req.body;

    if (!title || !authors || !seller_id) {
      return res.status(400).json({
        message: 'El título, los autores y el vendedor son requeridos'
      });
    }

    // Normalizar authors a array plano
    if (typeof authors === 'string') {
      try {
        // Si viene como string serializado, parsear
        const parsed = JSON.parse(authors);
        if (Array.isArray(parsed)) {
          authors = parsed;
        } else {
          authors = [authors];
        }
      } catch {
        // Si no es JSON, separar por coma
        authors = authors.split(',').map(a => a.trim());
      }
    }

    // Si es array de arrays, aplanar
    if (Array.isArray(authors)) {
      authors = authors.flat(Infinity).map(a => typeof a === 'string' ? a.trim() : a).filter(Boolean);
    }

    // Si no hay imagen proporcionada, intentar obtener la de Google Books
    let finalImageUrl = imageUrl;
    if (!finalImageUrl && isbn_code) {
      try {
        const response = await axios.get(`${GOOGLE_BOOKS_API_URL}?q=isbn:${isbn_code}`);
        if (response.data.items && response.data.items[0].volumeInfo.imageLinks) {
          finalImageUrl = response.data.items[0].volumeInfo.imageLinks.thumbnail;
        }
      } catch (error) {
        console.error('Error al obtener imagen de Google Books:', error);
      }
    }

    const book = await Book.create({
      title,
      authors,
      description,
      imageUrl: finalImageUrl,
      price,
      quantity,
      available,
      language,
      pageCount: pageCount ? parseInt(pageCount, 10) : null,
      seller_id,
      category_id,
      images_id,
      isbn_code,
      condition,
      publication_date: publication_date ? String(publication_date) : null,
      publisher: publisher || null
    });

    // Guardar imágenes en la tabla Image
    const imagePromises = [];

    // Agregar la imagen de Google Books si existe
    if (finalImageUrl) {
      imagePromises.push(Image.create({ book_id: book.book_id, image_url: finalImageUrl }));
    }

    // Agregar las imágenes subidas por el usuario
    if (Array.isArray(images) && images.length > 0) {
      images.forEach(imgUrl => {
        if (imgUrl && !imagePromises.some(p => p.image_url === imgUrl)) {
          imagePromises.push(Image.create({ book_id: book.book_id, image_url: imgUrl }));
        }
      });
    }

    // Guardar todas las imágenes
    await Promise.all(imagePromises);

    res.status(201).json(book);
  } catch (error) {
    console.error('Error al crear libro:', error);
    res.status(500).json({ message: 'Error al crear libro' });
  }
};

// Actualizar un libro
const updateBook = async (req, res) => {
  try {
    let {
      title,
      authors,
      description,
      price,
      condition,
      language,
      pageCount,
      publication_date,
      publisher,
      imageUrl
    } = req.body;
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    if (!title || !authors) {
      return res.status(400).json({ 
        message: 'El título y los autores son requeridos' 
      });
    }

    // Normalizar authors a array plano
    if (typeof authors === 'string') {
      try {
        const parsed = JSON.parse(authors);
        if (Array.isArray(parsed)) {
          authors = parsed;
        } else {
          authors = [authors];
        }
      } catch {
        authors = authors.split(',').map(a => a.trim());
      }
    }
    if (Array.isArray(authors)) {
      authors = authors.flat(Infinity).map(a => typeof a === 'string' ? a.trim() : a).filter(Boolean);
    }

    await book.update({
      title,
      authors,
      description,
      price,
      condition,
      language,
      pageCount,
      publication_date,
      publisher,
      imageUrl
    });

    res.json(book);
  } catch (error) {
    console.error('Error al actualizar libro:', error);
    res.status(500).json({ message: 'Error al actualizar libro' });
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
            authors: item.volumeInfo.authors || ['Autor desconocido'],
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

        // Procesar la URL de la imagen para hacerla más corta
        let imageUrl = null;
        if (bookData.imageLinks && bookData.imageLinks.thumbnail) {
            // Remover parámetros innecesarios de la URL
            imageUrl = bookData.imageLinks.thumbnail.split('&edge=')[0];
        }

        // Crear nuevo libro en la base de datos
        const newBook = await Book.create({
            googleBooksId,
            title: bookData.title || 'Sin título',
            authors: bookData.authors || ['Autor desconocido'],
            description: bookData.description || '',
            publishedDate: bookData.publishedDate || null,
            isbn: bookData.industryIdentifiers ? 
                  bookData.industryIdentifiers[0].identifier : null,
            pageCount: bookData.pageCount || null,
            imageUrl: imageUrl,
            categories: bookData.categories || [],
            language: bookData.language || null,
            averageRating: bookData.averageRating || null,
            quantity: 1,
            available: true,
            price: 99.99 // Precio por defecto
        });

        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error detallado al agregar libro:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            error: 'Error al agregar libro a la biblioteca',
            details: error.message,
            stack: error.stack
        });
    }
};

const getLibraryBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    console.error('Error al obtener libros de la biblioteca:', error);
    res.status(500).json({ error: 'Error al obtener libros de la biblioteca' });
  }
};

// Buscar libro por ISBN desde el backend
const searchBookByISBN = async (req, res) => {
  const { isbn } = req.query;
  if (!isbn) {
    return res.status(400).json({ error: 'ISBN requerido' });
  }
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
    const data = response.data;
    console.log('Respuesta de Google Books desde endpoint:', data);
    if (data.totalItems > 0) {
      const info = data.items[0].volumeInfo;
      return res.json({
        titulo: info.title || '',
        autor: info.authors ? info.authors.join(', ') : '',
        idioma: info.language || '',
        descripcion: info.description || '',
        imagen: info.imageLinks ? info.imageLinks.thumbnail : '',
        paginas: info.pageCount || '',
        publicacion: info.publishedDate || ''
      });
    } else {
      return res.status(404).json({ error: 'No se encontró información para ese ISBN.' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Error al buscar el libro por ISBN.' });
  }
};

// Obtener libros publicados por un usuario
const getBooksByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const books = await Book.findAll({
      where: { seller_id: userId },
      include: [
        { model: Image, attributes: ['image_id', 'image_url'] },
        { model: Category, attributes: ['category_id', 'category_name'] }
      ],
      order: [['createdAt', 'DESC']] // Ordenar por fecha de creación, más reciente primero
    });
    res.json(books);
  } catch (error) {
    console.error('Error al obtener libros del usuario:', error);
    res.status(500).json({ message: 'Error al obtener libros del usuario' });
  }
};

const searchBooksInDB = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.json([]);
  }
  try {
    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          // Buscar en autores (asumiendo que es un array o string)
          { authors: { [Op.like]: `%${query}%` } },
          { isbn: { [Op.like]: `%${query}%` } },
          { isbn_code: { [Op.like]: `%${query}%` } }
        ]
      }
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar libros en la base de datos' });
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
  getLibraryBooks,
  searchBookByISBN,
  uploadImage,
  getBooksByUser,
  searchBooksInDB
}; 