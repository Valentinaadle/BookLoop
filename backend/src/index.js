const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/../.env' });

// Verificar variables de entorno
console.log('Verificando variables de entorno:', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME
});

const { sequelize, connectDB } = require('./config/db');
const Category = require('./models/Category');

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/../uploads'));

// Variables de entorno
const PORT = process.env.PORT || 5000;

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);

// Ruta básica
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de BookLoop' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!' });
});

// Sincronizar base de datos y iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    await Category.seedCategories();
    await sequelize.sync({ force: false });
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();