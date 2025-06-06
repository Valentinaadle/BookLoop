const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist
} = require('../controllers/wishlistController');

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// Obtener todos los favoritos del usuario
router.get('/', getUserWishlist);

// Verificar si un libro está en favoritos
router.get('/check/:bookId', checkWishlist);

// Agregar un libro a favoritos
router.post('/', addToWishlist);

// Eliminar un libro de favoritos
router.delete('/:bookId', removeFromWishlist);

module.exports = router; 