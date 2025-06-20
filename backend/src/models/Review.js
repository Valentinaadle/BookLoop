const supabase = require('../config/db');

// Obtener todas las reviews
async function getAllReviews() {
  const { data, error } = await supabase.from('reviews').select('*');
  if (error) throw error;
  return data;
}

// Obtener una review por ID
async function getReviewById(id) {
  const { data, error } = await supabase.from('reviews').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

// Crear una review
async function createReview(review) {
  const { data, error } = await supabase.from('reviews').insert([review]).select().single();
  if (error) throw error;
  return data;
}

// Actualizar una review
async function updateReview(id, updates) {
  const { data, error } = await supabase.from('reviews').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// Eliminar una review
async function deleteReview(id) {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
};