const express = require('express');
const router = express.Router();
const {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist
} = require('../controllers/wishlistController');

// Obtener todos los favoritos
router.get('/', getUserWishlist);

// Verificar si un libro está en favoritos
router.get('/check/:bookId', checkWishlist);

// Agregar un libro a favoritos
router.post('/', addToWishlist);

// Eliminar un libro de favoritos
router.delete('/:bookId', removeFromWishlist);

module.exports = router; 