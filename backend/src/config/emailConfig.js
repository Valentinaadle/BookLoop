const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verificar conexión
transporter.verify((error, success) => {
  if (error) {
    console.log('Error en la configuración del email:', error);
  } else {
    console.log('Servidor de email listo para enviar mensajes');
  }
});

module.exports = transporter;
