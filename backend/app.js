const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sistema_perfiles',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// Ruta para registrar usuario
app.post('/registro', async (req, res) => {
    try {
        const { nombre, apellido, email, username, password } = req.body;

        // Verificar si el usuario ya existe
        const [usuarios] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ? OR username = ?',
            [email, username]
        );

        if (usuarios.length > 0) {
            return res.status(400).json({ 
                error: 'El email o nombre de usuario ya está registrado' 
            });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar usuario
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, apellido, email, username, password) VALUES (?, ?, ?, ?, ?)',
            [nombre, apellido, email, username, hashedPassword]
        );

        // Crear perfil básico
        await pool.query(
            'INSERT INTO perfiles (usuario_id) VALUES (?)',
            [result.insertId]
        );

        res.status(201).json({ 
            mensaje: 'Usuario registrado exitosamente',
            userId: result.insertId 
        });

    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Ruta para login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar usuario
        const [usuarios] = await pool.query(
            'SELECT * FROM usuarios WHERE username = ?',
            [username]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const usuario = usuarios[0];

        // Verificar contraseña
        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // No enviar la contraseña al cliente
        delete usuario.password;

        res.json({ 
            mensaje: 'Login exitoso',
            usuario 
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Ruta para obtener perfil
app.get('/perfil/:userId', async (req, res) => {
    try {
        const [perfiles] = await pool.query(
            `SELECT p.*, u.nombre, u.apellido, u.email, u.username 
             FROM perfiles p 
             JOIN usuarios u ON p.usuario_id = u.id 
             WHERE p.usuario_id = ?`,
            [req.params.userId]
        );

        if (perfiles.length === 0) {
            return res.status(404).json({ error: 'Perfil no encontrado' });
        }

        res.json(perfiles[0]);

    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
});

// Ruta para actualizar perfil
app.put('/perfil/:userId', async (req, res) => {
    try {
        const { biografia, fecha_nacimiento, telefono, direccion } = req.body;

        await pool.query(
            `UPDATE perfiles 
             SET biografia = ?, fecha_nacimiento = ?, telefono = ?, direccion = ? 
             WHERE usuario_id = ?`,
            [biografia, fecha_nacimiento, telefono, direccion, req.params.userId]
        );

        res.json({ mensaje: 'Perfil actualizado exitosamente' });

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ error: 'Error al actualizar perfil' });
    }
});

// Rutas de libros
app.get('/api/books', async (req, res) => {
    try {
        const [books] = await pool.query('SELECT * FROM books');
        res.json(books);
    } catch (error) {
        console.error('Error al obtener libros:', error);
        res.status(500).json({ error: 'Error al obtener libros' });
    }
});

app.get('/api/books/:id', async (req, res) => {
    try {
        const [books] = await pool.query(
            'SELECT * FROM books WHERE id = ?',
            [req.params.id]
        );

        if (books.length === 0) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }

        res.json(books[0]);
    } catch (error) {
        console.error('Error al obtener libro:', error);
        res.status(500).json({ error: 'Error al obtener libro' });
    }
});

app.post('/api/books', async (req, res) => {
    try {
        const { title, author, description, imageUrl, price, stock, details, authorBio, language, pages, publishYear } = req.body;
        
        const [result] = await pool.query(
            `INSERT INTO books (title, author, description, imageUrl, price, stock, details, authorBio, language, pages, publishYear) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, author, description, imageUrl, price, stock, details, authorBio, language, pages, publishYear]
        );

        res.status(201).json({ 
            id: result.insertId,
            ...req.body
        });
    } catch (error) {
        console.error('Error al crear libro:', error);
        res.status(500).json({ error: 'Error al crear libro' });
    }
});

app.put('/api/books/:id', async (req, res) => {
    try {
        const { title, author, description, imageUrl, price, stock, details, authorBio, language, pages, publishYear } = req.body;
        
        await pool.query(
            `UPDATE books 
             SET title = ?, author = ?, description = ?, imageUrl = ?, price = ?, 
                 stock = ?, details = ?, authorBio = ?, language = ?, pages = ?, publishYear = ?
             WHERE id = ?`,
            [title, author, description, imageUrl, price, stock, details, authorBio, language, pages, publishYear, req.params.id]
        );

        res.json({ mensaje: 'Libro actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar libro:', error);
        res.status(500).json({ error: 'Error al actualizar libro' });
    }
});

app.delete('/api/books/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM books WHERE id = ?', [req.params.id]);
        res.json({ mensaje: 'Libro eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar libro:', error);
        res.status(500).json({ error: 'Error al eliminar libro' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 