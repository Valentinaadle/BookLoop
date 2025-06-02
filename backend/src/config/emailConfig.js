const nodemailer = require('nodemailer');

// Configuración del transporter con Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // Contraseña de aplicación de Gmail
  }
});

// Verificar la conexión
transporter.verify(function(error, success) {
  if (error) {
    console.log('Error en la configuración del email:', error);
  } else {
    console.log('Servidor de email listo para enviar mensajes');
  }
});

module.exports = transporter; 