const transporter = require('../config/emailConfig');

const sendInterestEmail = async ({ sellerEmail, bookTitle, buyerName, buyerEmail }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: sellerEmail,
      subject: `¡Tienes un cliente interesado en tu libro "${bookTitle}"!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2c3e50; margin: 0;">BookLoop</h1>
            <p style="color: #7f8c8d; margin: 5px 0;">Tu plataforma de libros usados</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-top: 0;">¡Nuevo cliente interesado!</h2>
            <p>Hola, tienes un cliente interesado en tu libro <strong>${bookTitle}</strong>.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #34495e; margin-top: 0;">Datos del interesado:</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin: 10px 0;"><strong>Nombre:</strong> ${buyerName}</li>
                <li style="margin: 10px 0;"><strong>Email:</strong> ${buyerEmail}</li>
              </ul>
            </div>
            
            <p>Por favor, ponte en contacto con el cliente para continuar con la venta.</p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #7f8c8d;">
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            <p>© 2024 BookLoop. Todos los derechos reservados.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error enviando email:', error);
    throw error;
  }
};

module.exports = {
  sendInterestEmail
}; 