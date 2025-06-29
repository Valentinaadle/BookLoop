const Solicitud = require('../models/Solicitud');

// Crear una solicitud (opcional, por si se quiere exponer por API)
async function createSolicitud(req, res) {
  try {
    const { book_id, seller_id, buyer_id } = req.body;
    if (!book_id || !seller_id || !buyer_id) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
    const solicitud = await Solicitud.createSolicitud({ book_id, seller_id, buyer_id });
    res.status(201).json(solicitud);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear solicitud', error: error.message });
  }
}

// Obtener todas las solicitudes de un vendedor
async function getSolicitudesBySeller(req, res) {
  try {
    const { sellerId } = req.params;
    const solicitudes = await Solicitud.getSolicitudesBySeller(sellerId);
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener solicitudes', error: error.message });
  }
}

module.exports = {
  createSolicitud,
  getSolicitudesBySeller
};
