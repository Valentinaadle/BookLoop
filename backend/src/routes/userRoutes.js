const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  uploadProfilePhoto
} = require('../controllers/userController');
const { uploadProfilePhoto: multerUpload } = require('../config/multer');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.post('/registro', createUser);
router.post('/login', loginUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Ruta específica para upload de foto de perfil
router.post('/:id/photo', multerUpload, uploadProfilePhoto);

module.exports = router; 