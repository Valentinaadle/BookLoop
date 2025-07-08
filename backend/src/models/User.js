const supabase = require('../config/db');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
async function getAllUsers() {
  const { data, error } = await supabase.from('users').select('id, nombre, apellido, username, email, role');
  if (error) throw error;
  return data;
}

// Obtener un usuario por ID
async function getUserById(id) {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

// Obtener un usuario por email
async function getUserByEmail(email) {
  const { data, error } = await supabase.from('users').select('*').eq('email', email);
  if (error) throw error;
  if (!data || data.length === 0) return null;
  // Si hay más de un usuario con ese email, devuelve null (no debería pasar, pero previene errores)
  if (Array.isArray(data) && data.length > 1) return null;
  return Array.isArray(data) ? data[0] : data;
}

// Crear un usuario (hashea la contraseña)
async function createUser(user) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const { data, error } = await supabase.from('users').insert([{ ...user, password: hashedPassword }]).select();
  if (error) {
    // Si el error es de clave duplicada, lanza un error controlado
    if (error.code === '23505' || (error.message && error.message.includes('duplicate key'))) {
      throw new Error('El email ya está registrado');
    }
    throw error;
  }
  return Array.isArray(data) ? data[0] : data;
}

// Actualizar un usuario (hashea si cambia la contraseña)
async function updateUser(id, updates) {
  let updatesToSend = { ...updates };
  delete updatesToSend.intereses; // Campo que no existe en la base de datos
  
  if (Object.keys(updatesToSend).length === 0) {
    return await getUserById(id);
  }
  
  if (updates.password) {
    updatesToSend.password = await bcrypt.hash(updates.password, 10);
  }
  
  const { data, error } = await supabase.from('users').update(updatesToSend).eq('id', id).select().single();
  if (error) throw error;
  
  return data;
}

// Eliminar un usuario
async function deleteUser(id) {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

// Validar contraseña
async function validPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  validatePassword: async (user, plainPassword) => {
    if (!user || !user.password) return false;
    return await validPassword(plainPassword, user.password);
  },
  validPassword
};