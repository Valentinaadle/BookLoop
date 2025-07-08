const { Book, User } = require('../models');
const { sendInterestEmail } = require('../services/emailService');
const Solicitud = require('../models/Solicitud');

const notifySeller = async (req, res) => {
  try {
    console.log('Recibida petición de notificación:', req.body);
    const { bookId, buyerName, buyerEmail, buyerId } = req.body;

    if (!bookId || !buyerName || !buyerEmail) {
      console.log('Faltan datos requeridos:', { bookId, buyerName, buyerEmail });
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos'
      });
    }

    // Buscar el libro y el vendedor
    console.log('Buscando libro con ID:', bookId);
    const book = await Book.getBookById(bookId);

    console.log('Libro encontrado:', book ? 'Sí' : 'No');
    if (!book || !book.seller) {
      console.log('No se encontró el libro o el vendedor');
      return res.status(404).json({ 
        success: false, 
        message: 'Libro o vendedor no encontrado' 
      });
    }

    console.log('Datos del vendedor:', {
      email: book.seller.email,
      bookTitle: book.title
    });

    // Guardar la solicitud en la base de datos
    await Solicitud.createSolicitud({
      book_id: bookId,
      seller_id: book.seller.id,
      buyer_id: buyerId // ahora sí, el id del comprador real
    });

    // Enviar email al vendedor
    await sendInterestEmail({
      sellerEmail: book.seller.email,
      bookTitle: book.title,
      buyerName,
      buyerEmail
    });

    console.log('Email enviado exitosamente');
    res.json({ 
      success: true, 
      message: 'Notificación enviada al vendedor' 
    });

  } catch (error) {
    console.error('Error detallado en notifySeller:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al enviar la notificación',
      error: error.message 
    });
  }
};

module.exports = {
  notifySeller
}; 