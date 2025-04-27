const express = require('express');
const app = express();
const path = require('path');

// Configuraciones
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
