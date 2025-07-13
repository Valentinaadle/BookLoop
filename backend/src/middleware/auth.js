const jwt = require('jsonwebtoken');
const supabase = require('../config/db');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
    // Buscar usuario en Supabase
    const { data: user, error } = await supabase.from('users').select('*').eq('id', decoded.id).single();
    if (error || !user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    req.user = user; // user debe tener campo 'role'
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = { authenticateToken };