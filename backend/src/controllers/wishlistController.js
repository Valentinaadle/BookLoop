const { Wishlist, Book, User } = require('../models');

// Obtener todos los favoritos
const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'Se requiere el ID del usuario' });
    }
    // Validar que el usuario exista
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    // JOIN: obtener favoritos con datos del libro
    const { data, error } = await require('../config/db')
      .from('wishlist')
      .select('wishlist_id, user_id, book_id, Book:book_id(*)')
      .eq('user_id', userId);
    if (error) throw error;
    res.json(data);
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
    // Verificar si el usuario existe
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    // Verificar si el libro existe
    const book = await Book.getBookById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'El libro no existe' });
    }
    // Optimizado: verificar si ya está en favoritos
    const { data: existing, error: errorExisting } = await require('../config/db').from('wishlist').select('*').eq('user_id', userId).eq('book_id', bookId).single();
    if (errorExisting && errorExisting.code !== 'PGRST116') throw errorExisting; // PGRST116 = no rows returned
    if (existing) {
      return res.status(400).json({ message: 'El libro ya está en favoritos' });
    }
    // Crear el nuevo favorito
    const newFavorite = await Wishlist.createWishlist({
      user_id: userId,
      book_id: bookId
    });
    res.status(201).json(newFavorite);
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
    let { bookId } = req.params;
    let { userId } = req.query;
    if (!bookId || !userId || isNaN(Number(bookId)) || isNaN(Number(userId))) {
      return res.status(400).json({ message: 'Se requiere el ID válido del libro y del usuario' });
    }
    bookId = Number(bookId);
    userId = Number(userId);
    // Optimizado: buscar el item a eliminar directamente
    const { data: item, error } = await require('../config/db').from('wishlist').select('*').eq('user_id', userId).eq('book_id', bookId).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!item || !item.wishlist_id) {
      return res.status(404).json({ message: 'Libro no encontrado en favoritos' });
    }
    await Wishlist.deleteWishlist(item.wishlist_id);
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
    // Optimizado: buscar directamente si existe
    const { data: item, error } = await require('../config/db').from('wishlist').select('*').eq('user_id', userId).eq('book_id', bookId).single();
    if (error && error.code !== 'PGRST116') throw error;
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