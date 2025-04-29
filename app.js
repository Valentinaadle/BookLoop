const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

// Configuración de la carpeta de vistas y el motor EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configuración de carpeta pública
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/', (req, res) => {
  res.redirect('/home');
});

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/login', (req, res) => {
  res.render('login');
});

<<<<<<< HEAD
app.get('/bookDetails', (req, res) => {
  res.render('bookDetails');
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
=======
// Levantar el servidor
app.listen(PORT, () => {
  console.log('Servidor funcionando en http://localhost:${PORT}');
>>>>>>> 164bb5455161455401219b9013e67a8bea62eafc
});