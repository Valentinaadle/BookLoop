const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/emailController');
const { verifyToken } = require('../middleware/authMiddleware');

// La ruta requiere autenticación para obtener los datos del usuario
router.post('/send', verifyToken, sendEmail);

module.exports = router; 