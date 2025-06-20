const supabase = require('../config/db');

// Obtener todas las categorías
async function getAllCategories() {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) throw error;
  return data;
}

// Obtener una categoría por ID
async function getCategoryById(id) {
  const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

// Crear una categoría
async function createCategory(category) {
  const { data, error } = await supabase.from('categories').insert([category]).select().single();
  if (error) throw error;
  return data;
}

// Actualizar una categoría
async function updateCategory(id, updates) {
  const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// Eliminar una categoría
async function deleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

// Seed de categorías
async function seedCategories() {
  const categories = [
    'Novela', 'Cuento', 'Poesía', 'Drama', 'Ciencia ficción', 'Fantasía', 'Misterio',
    'Terror', 'Romance', 'Deportes', 'Realistas', 'Salud', 'Tecnología',
    'Ciencias', 'Escolar', 'Filosofía'
  ];
  for (const name of categories) {
    await supabase.from('categories').upsert([{ name }], { onConflict: ['name'] });
  }
  return { success: true };
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  seedCategories
};