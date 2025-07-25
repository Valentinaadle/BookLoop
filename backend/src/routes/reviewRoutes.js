const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { authenticateToken } = require('../middleware/auth');

// Obtener todas las reviews recibidas por un usuario como vendedor
router.get('/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    // Devuelve todas las reviews donde el vendedor sea el userId
    const reviews = await Review.getReviewsBySellerId(userId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reseñas', error: error.message });
  }
});

// Crear una nueva review
router.post('/', async (req, res) => {
  try {
    // book_rate eliminado, solo experiencia y seller_rate
    const { transaction_id, buyer_id, book_id, experience_rate, seller_rate, comment } = req.body;
    if (!buyer_id || !book_id || !experience_rate || !seller_rate) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    let review = {
      buyer_id,
      book_id,
      experience_rate,
      seller_rate,
      comment: comment || null,
      review_date: new Date().toISOString()
    };
    if (typeof transaction_id === 'number' && Number.isInteger(transaction_id)) {
      review.transaction_id = transaction_id;
    }
    const created = await Review.createReview(review);
    res.status(201).json(created);
  } catch (error) {
    console.error('Error al crear reseña:', error);
    res.status(500).json({ message: 'Error al crear reseña', error: error.message, details: error });
  }
});

// Actualizar una review
router.put('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const reviewId = parseInt(req.params.reviewId, 10);
    if (isNaN(reviewId)) {
      return res.status(400).json({ message: 'ID de reseña inválido' });
    }
    const updates = req.body;
    // Obtener la review original
    const review = await Review.getReviewById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }
    // Solo el autor puede editar
    if (req.user.id !== review.buyer_id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para editar esta reseña' });
    }
    // Solo permitir editar ciertos campos
    const allowed = {
      experience_rate: updates.experience_rate,
      seller_rate: updates.seller_rate,
      comment: updates.comment
    };
    const updated = await Review.updateReview(reviewId, allowed);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error al editar reseña', error: error.message });
  }
});

// Eliminar una review (sin autenticación, INSEGURO)
router.delete('/:reviewId', async (req, res) => {
  try {
    const reviewId = parseInt(req.params.reviewId, 10);
    if (isNaN(reviewId)) {
      return res.status(400).json({ message: 'ID de reseña inválido' });
    }
    await Review.deleteReview(reviewId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar reseña', error: error.message, details: error });
  }
});

module.exports = router;
