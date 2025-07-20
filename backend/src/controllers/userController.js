const { User } = require('../models');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta';

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
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
    const { email, password } = req.body;
    
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    const validPassword = await User.validatePassword(user, password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
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
    const { username, email, password, nombre, apellido } = req.body;
    
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    
    await User.createUser({
      username,
      email,
      password,
      nombre,
      apellido,
      role: 'user',
      activo: true
    });
    
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

// Actualizar un usuario (datos de texto, sin foto)
const updateUser = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { photo_url, ...updateData } = req.body; // Excluir photo_url
    const updated = await User.updateUser(req.params.id, updateData);
    res.json(updated);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

// Subir foto de perfil (ahora en Supabase Storage)
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se recibió ningún archivo' });
    }

    const user = await User.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Subir a Supabase Storage
    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `profile_${user.id}_${Date.now()}.${fileExt}`;
    const fileBuffer = req.file.buffer;
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: true
      });
    if (error) {
      console.error('Error al subir a Supabase Storage:', error);
      return res.status(500).json({ message: 'Error al subir imagen a storage' });
    }

    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);
    const photoUrl = publicUrlData.publicUrl;

    // Actualizar usuario
    const updated = await User.updateUser(req.params.id, { photo_url: photoUrl });

    res.json({
      message: 'Foto de perfil actualizada correctamente',
      photo_url: photoUrl,
      user: updated
    });
  } catch (error) {
    console.error('Error al subir foto de perfil:', error);
    res.status(500).json({ message: 'Error al subir foto de perfil' });
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    if (user) {
      await User.deleteUser(req.params.id);
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
  loginUser,
  uploadProfilePhoto
}; 