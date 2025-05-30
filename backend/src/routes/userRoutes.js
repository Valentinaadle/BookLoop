const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser
} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.post('/registro', createUser);
router.post('/login', loginUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Ruta para obtener todos los usuarios
// (puedes dejarla si la usas en el admin o debug)

module.exports = router; 