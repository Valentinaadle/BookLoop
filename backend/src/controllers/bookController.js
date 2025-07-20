const axios = require('axios');
const supabase = require('../supabaseClient');
const { Book } = require('../models');
const { Op } = require('sequelize');
const Image = require('../models/Image');
const Category = require('../models/Category');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

// Configuración de multer para guardar archivos en /uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint para subir una imagen y devolver la URL (ahora en Supabase Storage)
const uploadImage = [
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No se subió ninguna imagen' });
      }
      // Subir a Supabase Storage
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `book_${Date.now()}_${Math.floor(Math.random()*1e6)}.${fileExt}`;
      const fileBuffer = req.file.buffer;
      const { data, error } = await supabase.storage
        .from('book-images')
        .upload(fileName, fileBuffer, {
          contentType: req.file.mimetype,
          upsert: true
        });
      if (error) {
        console.error('Error al subir a Supabase Storage:', error);
        return res.status(500).json({ message: 'Error al subir imagen a storage' });
      }
      // Obtener URL pública
      const { data: publicUrlData } = await supabase.storage
        .from('book-images')
        .getPublicUrl(fileName);
      const imageurl = publicUrlData.publicUrl;
      console.log('URL pública generada:', imageurl); // <-- debug log
      res.json({ imageurl });
    } catch (err) {
      console.error('Error al subir imagen:', err);
      res.status(500).json({ message: 'Error al subir imagen' });
    }
  }
];

// Obtener todos los libros
const getBooks = async (req, res) => {
  try {
    // JOIN: obtener libros con nombre del vendedor y categoría
    const { data: books, error } = await require('../config/db')
      .from('books')
      .select('*, seller:seller_id(id, nombre, apellido, username, email), category:category_id(category_id, category_name)')
      .neq('status', 'vendido');
    if (error) throw error;
    // Para cada libro, buscar imágenes y armar coverimageurl e images
    const booksWithImages = await Promise.all(books.map(async (book) => {
      let images = await Image.getImagesByBook(book.book_id);
      // Si no hay imágenes y existe imageurl, agregarla automáticamente a la tabla images
      if ((images.length === 0 || !images.some(img => img.image_url === book.imageurl)) && book.imageurl) {
        try {
          await Image.createImage({ book_id: book.book_id, image_url: book.imageurl });
          images = await Image.getImagesByBook(book.book_id);
        } catch (err) {
          console.error('Error sincronizando imageurl con tabla images:', err);
        }
      }
      // SIEMPRE usar como portada la que está en book.coverimageurl si existe y está en las imágenes
      let coverimageurl = null;
      if (book.coverimageurl && images.some(img => img.image_url === book.coverimageurl)) {
        coverimageurl = book.coverimageurl;
      } else if (images.length > 0) {
        coverimageurl = images[images.length - 1].image_url;
      } else {
        coverimageurl = book.imageurl || null;
      }
      return {
        ...book,
        coverimageurl,
        images: images.map(img => img.image_url),
        vendedor: book.seller ? `${book.seller.nombre || ''} ${book.seller.apellido || ''}`.trim() || book.seller.username || book.seller.email : 'No especificado',
        categoria: book.category ? book.category.category_name : 'No especificada',
        category_id: book.category ? book.category.category_id : book.category_id
      };
    }));
    res.json(booksWithImages);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ message: 'Error al obtener libros' });
  }
};

// Obtener un libro por ID
const getBookById = async (req, res) => {
  try {
    // JOIN: obtener libro con nombre del vendedor y categoría
    const { data: book, error } = await require('../config/db')
      .from('books')
      .select('*, seller:seller_id(id, nombre, apellido, username, email), category:category_id(category_id, category_name)')
      .eq('book_id', req.params.id)
      .single();
    if (error || !book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    // Buscar imágenes asociadas
    let images = await Image.getImagesByBook(book.book_id);
    // Si no hay imágenes y existe imageurl, agregarla automáticamente a la tabla images
    if ((images.length === 0 || !images.some(img => img.image_url === book.imageurl)) && book.imageurl) {
      try {
        await Image.createImage({ book_id: book.book_id, image_url: book.imageurl });
        images = await Image.getImagesByBook(book.book_id);
      } catch (err) {
        console.error('Error sincronizando imageurl con tabla images:', err);
      }
    }
    // SIEMPRE usar como portada la que está en book.coverimageurl si existe y está en las imágenes
    let coverimageurl = null;
    if (book.coverimageurl && images.some(img => img.image_url === book.coverimageurl)) {
      coverimageurl = book.coverimageurl;
    } else if (images.length > 0) {
      coverimageurl = images[images.length - 1].image_url;
    } else {
      coverimageurl = book.imageurl || null;
    }
    res.json({
      ...book,
      coverimageurl,
      images: images.map(img => img.image_url),
      vendedor: book.seller ? `${book.seller.nombre || ''} ${book.seller.apellido || ''}`.trim() || book.seller.username || book.seller.email : 'No especificado',
      categoria: book.category ? book.category.category_name : 'No especificada',
      category_id: book.category ? book.category.category_id : book.category_id
    });
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
      imageurl,
      price,
      quantity,
      available,
      language,
      pagecount,
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
    let finalImageUrl = imageurl;
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

    const now = new Date();
    const book = await Book.createBook({
      title,
      authors,
      description,
      imageurl: finalImageUrl,
      price,
      quantity,
      available,
      language,
      pagecount: pagecount ? parseInt(pagecount, 10) : null,
      seller_id,
      category_id,
      images_id,
      isbn_code,
      condition,
      publication_date: publication_date ? String(publication_date) : null,
      publisher: publisher || null,
      createdat: now,
      updatedat: now
    });

    // Guardar imágenes en la tabla Image
    const imagePromises = [];
    let allImages = [];
    let coverUrl = finalImageUrl;

    // Agregar las imágenes subidas por el usuario
    if (Array.isArray(images) && images.length > 0) {
      // Si el usuario especifica portada, úsala; si no, la última
      if (req.body.coverimageurl && images.includes(req.body.coverimageurl)) {
        coverUrl = req.body.coverimageurl;
      } else {
        coverUrl = images[images.length - 1];
      }
      images.forEach(imgUrl => {
        imagePromises.push(Image.createImage({ book_id: book.book_id, image_url: imgUrl }));
      });
    } else if (finalImageUrl) {
      // Si no hay imágenes subidas, usa la de Google Books
      imagePromises.push(Image.createImage({ book_id: book.book_id, image_url: finalImageUrl }));
    }
    // Guardar todas las imágenes
    allImages = await Promise.all(imagePromises);

    // Actualiza la portada en el libro
    await Book.updateBookCover(book.book_id, coverUrl);

    // Devuelve el libro con todas las imágenes y la portada correcta
    res.status(201).json({ ...book, coverimageurl: coverUrl, images: allImages.map(img => img.image_url) });
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
      pagecount,
      publication_date,
      publisher,
      category_id,
      images, // array of image URLs (remaining/new)
      deletedImageIds, // array of image IDs to delete
      coverimageurl, // optional: explicit cover
      status // <-- Permite actualizar el estado
    } = req.body;
    // Filter out invalid/null/undefined/empty image URLs
    if (Array.isArray(images)) {
      images = images.filter(url => typeof url === 'string' && url.trim().length > 0);
    }
    const book = await Book.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    // Normalize authors
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

    // Manejo robusto de imágenes nuevas y eliminadas
    // 1. Eliminar imágenes marcadas explícitamente (deletedImageIds)
    if (Array.isArray(deletedImageIds) && deletedImageIds.length > 0) {
      for (let imgId of deletedImageIds) {
        if (typeof imgId === 'object' && imgId.image_id) imgId = imgId.image_id;
        imgId = parseInt(imgId, 10);
        if (!isNaN(imgId)) {
          await Image.deleteImage(imgId);
        }
      }
    }
    // 2. Sincronizar imágenes nuevas: crear solo las que no existen para este libro
    if (Array.isArray(images)) {
      // Obtener imágenes actuales
      const currentImages = await Image.getImagesByBook(book.book_id);
      const currentUrls = currentImages.map(img => img.image_url);
      for (const imgUrl of images) {
        if (!currentUrls.includes(imgUrl)) {
          await Image.createImage({ book_id: book.book_id, image_url: imgUrl });
        }
      }
      // Eliminar imágenes que ya no están en el array images
      for (const img of currentImages) {
        if (!images.includes(img.image_url)) {
          await Image.deleteImage(img.image_id);
        }
      }
    }

    // Determinar la portada
    // Log de depuración para ver URLs
    console.log('[DEBUG] coverimageurl recibido:', coverimageurl);
    console.log('[DEBUG] currentUrls:', currentUrls);
    let finalCoverUrl = coverimageurl;
    // Normalizar comparación: ignorar mayúsculas/minúsculas y espacios
    const normalize = url => (url || '').trim().toLowerCase();
    const normalizedCover = normalize(coverimageurl);
    const normalizedUrls = currentUrls.map(normalize);
    if (normalizedCover && normalizedUrls.includes(normalizedCover)) {
      finalCoverUrl = currentUrls[normalizedUrls.indexOf(normalizedCover)];
    } else if (Array.isArray(images) && images.length > 0) {
      finalCoverUrl = images[images.length - 1];
    } else if (currentUrls && currentUrls.length > 0) {
      finalCoverUrl = currentUrls[currentUrls.length - 1];
    } else {
      finalCoverUrl = book.coverimageurl || book.imageurl || null;
    }

    // Actualizar el libro
    const updatedat = new Date();
    // Construir objeto de actualización solo con campos definidos
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (authors !== undefined) updates.authors = authors;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (condition !== undefined) updates.condition = condition;
    if (language !== undefined) updates.language = language;
    if (pagecount !== undefined) updates.pagecount = pagecount ? parseInt(pagecount, 10) : null;
    if (publication_date !== undefined) updates.publication_date = publication_date;
    if (publisher !== undefined) updates.publisher = publisher;
    if (category_id !== undefined) updates.category_id = category_id ? parseInt(category_id, 10) : book.category_id;
    if (req.body.quantity !== undefined) updates.quantity = req.body.quantity ? parseInt(req.body.quantity, 10) : book.quantity;
    if (req.body.seller_id !== undefined) updates.seller_id = req.body.seller_id ? parseInt(req.body.seller_id, 10) : book.seller_id;
    if (req.body.images_id !== undefined) updates.images_id = req.body.images_id ? parseInt(req.body.images_id, 10) : book.images_id;
    if (finalCoverUrl !== undefined) updates.imageurl = finalCoverUrl || book.imageurl;
    if (finalCoverUrl !== undefined) updates.coverimageurl = finalCoverUrl;
    if (updatedat !== undefined) updates.updatedat = updatedat;
    if (status !== undefined) updates.status = status;

    // Log para depuración
    console.log('Actualizando libro con:', updates);
    let updatedBook;
    try {
      updatedBook = await Book.updateBook(book.book_id, updates);
    } catch (updateErr) {
      console.error('Error en modelo/updateBook:', updateErr);
      return res.status(400).json({ message: 'Error en la actualización', error: updateErr.message });
    }

    // Devolver el libro actualizado y todas las imágenes
    const updatedImages = await Image.getImagesByBook(book.book_id);
    res.json({ ...book, coverimageurl: finalCoverUrl, images: updatedImages.map(img => img.image_url) });
  } catch (error) {
    console.error('Error al actualizar libro:', error);
    res.status(500).json({ message: 'Error al actualizar libro', error: error.message });
  }
};

// Eliminar un libro
const deleteBook = async (req, res) => {
  try {
    const book = await Book.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    // Eliminar wishlist asociada
    try {
      const Wishlist = require('../models/Wishlist');
      await Wishlist.deleteWishlistByBookId(book.book_id);
    } catch (wishErr) {
      console.error('Error al eliminar wishlist asociada:', wishErr);
    }
    // Eliminar imágenes asociadas
    try {
      const Image = require('../models/Image');
      const images = await Image.getImagesByBook(book.book_id);
      for (const img of images) {
        await Image.deleteImage(img.id);
      }
    } catch (imgErr) {
      console.error('Error al eliminar imágenes asociadas:', imgErr);
    }
    await Book.deleteBook(book.book_id);
    res.json({ message: 'Libro eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar libro:', error?.message || error);
    res.status(500).json({ message: error?.message || 'Error al eliminar libro', error });
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
            pagecount: item.volumeInfo.pagecount,
            imageurl: item.volumeInfo.imageLinks ? 
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
        const existingBook = await Book.getBookById({
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
        let imageurl = null;
        if (bookData.imageLinks && bookData.imageLinks.thumbnail) {
            // Remover parámetros innecesarios de la URL
            imageurl = bookData.imageLinks.thumbnail.split('&edge=')[0];
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
            pagecount: bookData.pagecount || null,
            imageurl: imageurl,
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
    const books = await Book.getAllBooks();
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
        paginas: info.pagecount || '',
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
    const books = await Book.getBooksByUser(userId);
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
    const books = await Book.getAllBooks(); // Trae todos los libros
    const lowerQuery = query.toLowerCase();
    const filtered = books.filter(book => {
      // Normalizar campos
      const title = (book.title || book.titulo || '').toLowerCase();
      const authors = Array.isArray(book.authors)
        ? book.authors.join(', ').toLowerCase()
        : (book.authors || '').toLowerCase();
      const isbn = (book.isbn || '').toLowerCase();
      const isbnCode = (book.isbn_code || '').toLowerCase();
      return (
        title.includes(lowerQuery) ||
        authors.includes(lowerQuery) ||
        isbn.includes(lowerQuery) ||
        isbnCode.includes(lowerQuery)
      );
    });
    res.json(filtered);
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
