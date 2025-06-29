const supabase = require('../config/db');

// Crear una solicitud
async function createSolicitud({ book_id, seller_id, buyer_id }) {
  const { data, error } = await supabase.from('solicitudes').insert([
    { book_id, seller_id, buyer_id }
  ]).select().single();
  if (error) throw error;
  return data;
}

// Obtener todas las solicitudes para un vendedor
async function getSolicitudesBySeller(seller_id) {
  const { data, error } = await supabase
    .from('solicitudes')
    .select('*, books(*), users!buyer_id(*)')
    .eq('seller_id', seller_id)
    .order('created_at', { ascending: false });
  // Filtrar solicitudes cuyo libro está vendido
  const filtered = (data || []).filter(solicitud => solicitud.books?.status !== 'vendido');
  return filtered;
  if (error) throw error;
  return data;
}

module.exports = {
  createSolicitud,
  getSolicitudesBySeller
};
