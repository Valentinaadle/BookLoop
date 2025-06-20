const supabase = require('../config/db');

// Obtener todos los roles
async function getAllRoles() {
  const { data, error } = await supabase.from('roles').select('*');
  if (error) throw error;
  return data;
}

// Obtener un rol por ID
async function getRoleById(id) {
  const { data, error } = await supabase.from('roles').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

// Crear un rol
async function createRole(role) {
  const { data, error } = await supabase.from('roles').insert([role]).select().single();
  if (error) throw error;
  return data;
}

// Actualizar un rol
async function updateRole(id, updates) {
  const { data, error } = await supabase.from('roles').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// Eliminar un rol
async function deleteRole(id) {
  const { error } = await supabase.from('roles').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};