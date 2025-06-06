const { Wishlist, Book, User } = require('../models');

// Obtener todos los favoritos de un usuario
const getUserWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // Asumiendo que tenemos el usuario en req.user
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
    res.status(500).json({ message: 'Error al obtener la lista de favoritos' });
  }
};

// Agregar un libro a favoritos
const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const existingItem = await Wishlist.findOne({
      where: { user_id: userId, book_id: bookId }
    });

    if (existingItem) {
      return res.status(400).json({ message: 'El libro ya está en favoritos' });
    }

    await Wishlist.create({
      user_id: userId,
      book_id: bookId
    });

    res.json({ message: 'Libro agregado a favoritos' });
  } catch (error) {
    console.error('Error al agregar a wishlist:', error);
    res.status(500).json({ message: 'Error al agregar a favoritos' });
  }
};

// Eliminar un libro de favoritos
const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const result = await Wishlist.destroy({
      where: { user_id: userId, book_id: bookId }
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Libro no encontrado en favoritos' });
    }

    res.json({ message: 'Libro eliminado de favoritos' });
  } catch (error) {
    console.error('Error al eliminar de wishlist:', error);
    res.status(500).json({ message: 'Error al eliminar de favoritos' });
  }
};

// Verificar si un libro está en favoritos
const checkWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const item = await Wishlist.findOne({
      where: { user_id: userId, book_id: bookId }
    });

    res.json({ isFavorite: !!item });
  } catch (error) {
    console.error('Error al verificar wishlist:', error);
    res.status(500).json({ message: 'Error al verificar favoritos' });
  }
};

module.exports = {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist
}; 