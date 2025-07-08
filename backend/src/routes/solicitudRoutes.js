const express = require('express');
const router = express.Router();
const { getSolicitudesBySeller } = require('../controllers/solicitudController');

// Obtener solicitudes por vendedor
router.get('/:sellerId', getSolicitudesBySeller);

module.exports = router;
