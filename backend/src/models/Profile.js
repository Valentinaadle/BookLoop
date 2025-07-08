const supabase = require('../config/db');

// Obtener todos los perfiles
async function getAllProfiles() {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) throw error;
  return data;
}

// Obtener un perfil por ID
async function getProfileById(id) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

// Obtener perfil por userId
async function getProfileByUserId(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('userid', userId)
    .single();
  if (error) throw error;
  return data;
}

// Crear un perfil
async function createProfile(profile) {
  const { data, error } = await supabase.from('profiles').insert([profile]).select().single();
  if (error) throw error;
  return data;
}

// Actualizar un perfil
async function updateProfile(id, updates) {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// Actualizar perfil por userId
async function updateProfileByUserId(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('userid', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Eliminar un perfil
async function deleteProfile(id) {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

module.exports = {
  getAllProfiles,
  getProfileById,
  getProfileByUserId,
  createProfile,
  updateProfile,
  updateProfileByUserId,
  deleteProfile
};