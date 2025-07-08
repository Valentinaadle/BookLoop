const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/../.env' });

// Verificar variables de entorno relevantes para Supabase
console.log('Verificando variables de entorno:', {
  SUPABASE_URL: process.env.SUPABASE_URL,
  PORT: process.env.PORT
});


const Category = require('./models/Category');

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const solicitudRoutes = require('./routes/solicitudRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log global de todas las peticiones
app.use((req, res, next) => {

  next();
});

// Middleware para capturar errores de JSON inválido
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Error de JSON:', err.message);
    return res.status(400).json({ message: 'JSON inválido', error: err.message });
  }
  next();
});

app.use('/uploads', express.static(__dirname + '/../uploads'));

// Variables de entorno
const PORT = process.env.PORT || 5000;

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/solicitudes', solicitudRoutes);

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
    await Category.seedCategories();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();