const supabase = require('../config/db');

// Obtener todas las reviews
async function getAllReviews() {
  const { data, error } = await supabase.from('reviews').select('*');
  if (error) throw error;
  return data;
}

// Obtener una review por ID
async function getReviewById(id) {
  const { data, error } = await supabase.from('reviews').select('*').eq('review_id', id).single();
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
  const { data, error } = await supabase.from('reviews').update(updates).eq('review_id', id).select().single();
  if (error) throw error;
  return data;
}

// Eliminar una review
async function deleteReview(id) {
  const { error } = await supabase.from('reviews').delete().eq('review_id', id);
  if (error) throw error;
  return { success: true };
}

// Obtener reviews por vendedor (JOIN con books)
async function getReviewsBySellerId(sellerId) {
  // Trae reviews + info del libro y del comprador
  const { data, error } = await supabase
    .from('reviews')
    .select('*, books:book_id(seller_id, title), buyers:buyer_id(nombre, apellido, username, photo_url)')
    .order('review_date', { ascending: false });
  if (error) throw error;
  // Filtrar reviews donde el libro pertenece al vendedor
  const filtered = (data || []).filter(r => r.books && r.books.seller_id === sellerId);
  return filtered;
}

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewsBySellerId
};