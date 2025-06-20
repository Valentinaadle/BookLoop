const supabase = require('../config/db');

// Obtener todas las transacciones
async function getAllTransactions() {
  const { data, error } = await supabase.from('transactions').select('*');
  if (error) throw error;
  return data;
}

// Obtener una transacción por ID
async function getTransactionById(id) {
  const { data, error } = await supabase.from('transactions').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

// Crear una transacción
async function createTransaction(transaction) {
  const { data, error } = await supabase.from('transactions').insert([transaction]).select().single();
  if (error) throw error;
  return data;
}

// Actualizar una transacción
async function updateTransaction(id, updates) {
  const { data, error } = await supabase.from('transactions').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// Eliminar una transacción
async function deleteTransaction(id) {
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
};