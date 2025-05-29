const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  debug: true, // show debug output
  logger: true // log information in console
});

// Verificar la conexión al inicio
transporter.verify(function(error, success) {
  if (error) {
    console.error('Error al verificar el transportador:', error);
  } else {
    console.log('Servidor listo para enviar emails');
  }
});

const sendEmail = async (req, res) => {
  try {
    console.log('Iniciando proceso de envío de email');
    console.log('Datos recibidos:', {
      to: req.body.to,
      bookTitle: req.body.bookTitle,
      userData: req.body.userData
    });

    // Verificar variables de entorno
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Faltan credenciales de email en las variables de entorno');
      return res.status(500).json({
        error: 'Error de configuración del servidor',
        details: 'Faltan credenciales de email'
      });
    }

    console.log('Usando cuenta de email:', process.env.EMAIL_USER);

    const { to, bookTitle, userData } = req.body;

    // Validar datos requeridos
    if (!to || !bookTitle || !userData) {
      console.error('Datos faltantes:', { to, bookTitle, hasUserData: !!userData });
      return res.status(400).json({
        error: 'Datos incompletos',
        details: 'Se requieren: destinatario, título del libro y datos del usuario'
      });
    }

    // Validar que el usuario tenga los campos necesarios
    if (!userData.nombre || !userData.apellido || !userData.email) {
      console.error('Datos de usuario incompletos:', userData);
      return res.status(400).json({
        error: 'Datos de usuario incompletos',
        details: 'Se requieren: nombre, apellido y email del usuario'
      });
    }

    const emailBody = `
    Nuevo mensaje de interés por tu libro "${bookTitle}"
    
    Datos del interesado:
    Nombre: ${userData.nombre}
    Apellido: ${userData.apellido}
    Email: ${userData.email}
    
    El usuario está interesado en tu libro y desea contactarte.
    
    Este mensaje fue enviado a través de BookLoop.
    `;

    const mailOptions = {
      from: {
        name: 'BookLoop',
        address: process.env.EMAIL_USER
      },
      to: to,
      subject: `Interés en tu libro: ${bookTitle}`,
      text: emailBody,
      replyTo: userData.email,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    console.log('Intentando enviar email con configuración:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      replyTo: mailOptions.replyTo
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Respuesta del servidor de email:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
      pending: info.pending,
      envelope: info.envelope
    });
    
    res.json({ 
      message: 'Email enviado correctamente',
      messageId: info.messageId,
      details: info.response
    });
  } catch (error) {
    console.error('Error detallado al enviar email:', {
      name: error.name,
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      stack: error.stack
    });

    res.status(500).json({ 
      error: 'Error al enviar el email',
      details: error.message,
      code: error.code
    });
  }
};

module.exports = {
  sendEmail
}; 