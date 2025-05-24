const axios = require('axios');

axios.get('https://www.googleapis.com/books/v1/volumes?q=isbn:9780140449136')
  .then(res => {
    console.log('Respuesta de Google Books:', res.data);
  })
  .catch(err => {
    console.error('Error al consultar Google Books:', err);
  }); 