const supabase = require('../config/db');

// Obtener todos los registros de wishlist
async function getAllWishlist() {
  const { data, error } = await supabase.from('wishlist').select('*');
  if (error) throw error;
  return data;
}

// Obtener un registro de wishlist por ID
async function getWishlistById(wishlist_id) {
  const { data, error } = await supabase.from('wishlist').select('*').eq('wishlist_id', wishlist_id).single();
  if (error) throw error;
  return data;
}

// Crear un registro de wishlist
async function createWishlist(wishlist) {
  const { data, error } = await supabase.from('wishlist').insert([wishlist]).select().single();
  if (error) throw error;
  return data;
}

// Actualizar un registro de wishlist
async function updateWishlist(wishlist_id, updates) {
  const { data, error } = await supabase.from('wishlist').update(updates).eq('wishlist_id', wishlist_id).select().single();
  if (error) throw error;
  return data;
}

// Eliminar un registro de wishlist
async function deleteWishlist(wishlist_id) {
  const { error } = await supabase.from('wishlist').delete().eq('wishlist_id', wishlist_id);
  if (error) throw error;
  return { success: true };
}

// Eliminar todos los registros de wishlist por book_id
async function deleteWishlistByBookId(book_id) {
  const { error } = await supabase.from('wishlist').delete().eq('book_id', book_id);
  if (error) throw error;
  return { success: true };
}

module.exports = {
  getAllWishlist,
  getWishlistById,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  deleteWishlistByBookId
};