const { Wishlist, Book } = require('../models');

// Obtener todos los favoritos
const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'Se requiere el ID del usuario' });
    }

    const wishlist = await Wishlist.findAll({
      where: { user_id: userId },
      include: [{
        model: Book,
        attributes: ['book_id', 'title', 'authors', 'imageUrl', 'price']
      }]
    });

    res.json(wishlist);
  } catch (error) {
    console.error('Error al obtener wishlist:', error);
    res.status(500).json({ 
      message: 'Error al obtener favoritos',
      error: error.message 
    });
  }
};

// Agregar un libro a favoritos
const addToWishlist = async (req, res) => {
  try {
    const { bookId, userId } = req.body;

    if (!bookId || !userId) {
      return res.status(400).json({ message: 'Se requiere el ID del libro y del usuario' });
    }

    // Verificar si el libro existe
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'El libro no existe' });
    }

    // Verificar si ya está en favoritos
    const existingItem = await Wishlist.findOne({
      where: { user_id: userId, book_id: bookId }
    });

    if (existingItem) {
      return res.status(400).json({ message: 'El libro ya está en favoritos' });
    }

    // Crear el nuevo favorito
    const newFavorite = await Wishlist.create({
      user_id: userId,
      book_id: bookId
    });

    // Obtener los datos completos del libro para devolver
    const bookWithDetails = await Wishlist.findOne({
      where: { wishlist_id: newFavorite.wishlist_id },
      include: [{
        model: Book,
        attributes: ['book_id', 'title', 'authors', 'imageUrl', 'price']
      }]
    });

    res.status(201).json(bookWithDetails);
  } catch (error) {
    console.error('Error al agregar a wishlist:', error);
    res.status(500).json({ 
      message: 'Error al agregar a favoritos',
      error: error.message 
    });
  }
};

// Eliminar un libro de favoritos
const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { userId } = req.query;

    if (!bookId || !userId) {
      return res.status(400).json({ message: 'Se requiere el ID del libro y del usuario' });
    }

    const result = await Wishlist.destroy({
      where: { user_id: userId, book_id: bookId }
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Libro no encontrado en favoritos' });
    }

    res.json({ message: 'Libro eliminado de favoritos' });
  } catch (error) {
    console.error('Error al eliminar de wishlist:', error);
    res.status(500).json({ 
      message: 'Error al eliminar de favoritos',
      error: error.message 
    });
  }
};

// Verificar si un libro está en favoritos
const checkWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { userId } = req.query;

    if (!bookId || !userId) {
      return res.status(400).json({ message: 'Se requiere el ID del libro y del usuario' });
    }

    const item = await Wishlist.findOne({
      where: { user_id: userId, book_id: bookId }
    });

    res.json({ isFavorite: !!item });
  } catch (error) {
    console.error('Error al verificar wishlist:', error);
    res.status(500).json({ 
      message: 'Error al verificar favoritos',
      error: error.message 
    });
  }
};

module.exports = {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist
};