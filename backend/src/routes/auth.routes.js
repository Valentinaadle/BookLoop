const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const emailExistence = require('email-existence');
const util = require('util');
const checkEmail = util.promisify(emailExistence.check);

// Ruta para obtener todos los usuarios (temporal para debug)
router.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await User.findAll({
            include: [{
                model: Profile,
                attributes: ['foto_perfil', 'biografia', 'fecha_nacimiento', 'telefono', 'direccion']
            }],
            attributes: { exclude: ['password'] }
        });

        if (!usuarios || usuarios.length === 0) {
            return res.status(404).json({ message: 'No hay usuarios registrados' });
        }

        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Ruta para registro
router.post('/registro', async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);
        const { nombre, apellido, email, username, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username }]
            }
        });

        if (existingUser) {
            console.log('Usuario ya existe');
            return res.status(400).json({ 
                error: 'El email o nombre de usuario ya está registrado' 
            });
        }

        // Crear usuario
        console.log('Intentando crear usuario...');
        const user = await User.create({
            nombre,
            apellido,
            email,
            username,
            password // El hash se hace automáticamente en el hook beforeCreate
        });
        console.log('Usuario creado:', user.toJSON());

        // Crear perfil básico
        console.log('Creando perfil...');
        await Profile.create({
            UserId: user.id
        });
        console.log('Perfil creado');

        // No enviar la contraseña en la respuesta
        const userWithoutPassword = { ...user.toJSON() };
        delete userWithoutPassword.password;

        res.status(201).json({ 
            mensaje: 'Usuario registrado exitosamente',
            usuario: userWithoutPassword
        });

    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Ruta para login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar usuario
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username },
                    { email: username } // Permitir login con email también
                ]
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: user.id,
                username: user.username,
                email: user.email,
                nombre: user.nombre,
                apellido: user.apellido
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // No enviar la contraseña en la respuesta
        const userWithoutPassword = { ...user.toJSON() };
        delete userWithoutPassword.password;

        res.json({ 
            mensaje: 'Login exitoso',
            usuario: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router; 