const supabase = require('../config/db');

// Obtener todas las imágenes
async function getAllImages() {
  const { data, error } = await supabase.from('images').select('*');
  if (error) throw error;
  return data;
}

// Obtener una imagen por ID
async function getImageById(image_id) {
  const { data, error } = await supabase.from('images').select('*').eq('image_id', image_id).single();
  if (error) throw error;
  return data;
}

// Crear una imagen
async function createImage(image) {
  const { data, error } = await supabase.from('images').insert([image]).select().single();
  if (error) throw error;
  return data;
}

// Actualizar una imagen
async function updateImage(image_id, updates) {
  const { data, error } = await supabase.from('images').update(updates).eq('image_id', image_id).select().single();
  if (error) throw error;
  return data;
}

// Eliminar una imagen
async function deleteImage(image_id) {
  const { error } = await supabase.from('images').delete().eq('image_id', image_id);
  if (error) throw error;
  return { success: true };
}

// Obtener imágenes por book_id
async function getImagesByBook(book_id) {
  const { data, error } = await supabase.from('images').select('*').eq('book_id', book_id);
  if (error) throw error;
  return data;
}

module.exports = {
  getAllImages,
  getImageById,
  createImage,
  updateImage,
  deleteImage,
  getImagesByBook
};