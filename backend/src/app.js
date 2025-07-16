require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profile.routes');

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://bookloop-dusky.vercel.app'
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON y URL encoded para datos normales
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// Servir archivos estáticos (fotos de perfil)
app.use('/uploads/profiles', express.static(path.join(__dirname, '../uploads/profiles')));

// Rutas
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);

// Puerto
const PORT = process.env.PORT || 5000;

// Conectar a la base de datos y iniciar el servidor
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer(); 