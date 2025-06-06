const { User } = require('../models');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta';

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  try {
    console.log('Datos recibidos en login:', req.body);
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('Usuario no encontrado con email:', email);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const validPassword = await user.validPassword(password);
    if (!validPassword) {
      console.log('Contraseña inválida para usuario:', email);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login exitoso para usuario:', user.username);
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    console.log('Datos recibidos en createUser:', req.body);
    const { username, email, password, nombre, apellido } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('Usuario ya existe con email:', email);
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Crear usuario (la contraseña se encripta automáticamente en el modelo)
    const user = await User.create({
      username,
      email,
      password,
      nombre,
      apellido,
      role: 'user',
      activo: true
    });

    console.log('Usuario creado exitosamente:', user.username);
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error detallado al crear usuario:', error);
    console.error('Stack trace:', error.stack);
    if (error.name === 'SequelizeValidationError') {
      console.log('Errores de validación:', error.errors);
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.log('Error de unicidad:', error.errors);
      return res.status(400).json({
        message: 'El usuario ya existe',
        errors: error.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }
    res.status(500).json({ 
      message: 'Error al crear usuario',
      error: error.message
    });
  }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.update(req.body);
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.json({ message: 'Usuario eliminado' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser
}; 