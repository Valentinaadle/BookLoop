const { expect } = require('chai');
const { getBookImage } = require('./utils');

describe('Manejo de Imágenes', () => {
  describe('getBookImage', () => {
    const API_URL = 'http://localhost:5000';
    const DEFAULT_IMAGE = '/Assets/images/default-book.png';

    it('debe retornar coverimageurl cuando esté disponible', () => {
      const book = {
        coverimageurl: 'https://example.com/cover.jpg'
      };
      expect(getBookImage(book)).to.equal('https://example.com/cover.jpg');
    });

    it('debe retornar coverimageurl con Assets sin modificar', () => {
      const book = {
        coverimageurl: '/Assets/book-cover.jpg'
      };
      expect(getBookImage(book)).to.equal('/Assets/book-cover.jpg');
    });

    it('debe agregar API_URL a coverimageurl relativa', () => {
      const book = {
        coverimageurl: '/uploads/cover.jpg'
      };
      expect(getBookImage(book, API_URL)).to.equal(`${API_URL}/uploads/cover.jpg`);
    });

    it('debe usar la primera imagen del array images', () => {
      const book = {
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
      };
      expect(getBookImage(book)).to.equal('https://example.com/image1.jpg');
    });

    it('debe agregar API_URL a imagen relativa del array', () => {
      const book = {
        images: ['/uploads/image1.jpg', '/uploads/image2.jpg']
      };
      expect(getBookImage(book, API_URL)).to.equal(`${API_URL}/uploads/image1.jpg`);
    });

    it('debe usar imageurl cuando no hay coverimageurl ni images', () => {
      const book = {
        imageurl: 'https://example.com/image.jpg'
      };
      expect(getBookImage(book)).to.equal('https://example.com/image.jpg');
    });

    it('debe agregar API_URL a imageurl relativa', () => {
      const book = {
        imageurl: '/uploads/image.jpg'
      };
      expect(getBookImage(book, API_URL)).to.equal(`${API_URL}/uploads/image.jpg`);
    });

    it('debe usar campo imagen cuando no hay otras opciones', () => {
      const book = {
        imagen: 'https://example.com/imagen.jpg'
      };
      expect(getBookImage(book)).to.equal('https://example.com/imagen.jpg');
    });

    it('debe agregar API_URL a imagen relativa', () => {
      const book = {
        imagen: '/uploads/imagen.jpg'
      };
      expect(getBookImage(book, API_URL)).to.equal(`${API_URL}/uploads/imagen.jpg`);
    });

    it('debe priorizar coverimageurl sobre otras opciones', () => {
      const book = {
        coverimageurl: 'https://example.com/cover.jpg',
        images: ['https://example.com/image1.jpg'],
        imageurl: 'https://example.com/image.jpg',
        imagen: 'https://example.com/imagen.jpg'
      };
      expect(getBookImage(book)).to.equal('https://example.com/cover.jpg');
    });

    it('debe retornar imagen por defecto cuando no hay imágenes', () => {
      const book = {};
      expect(getBookImage(book)).to.equal(DEFAULT_IMAGE);
    });

    it('debe retornar imagen por defecto para arrays vacíos', () => {
      const book = {
        images: []
      };
      expect(getBookImage(book)).to.equal(DEFAULT_IMAGE);
    });

    it('debe manejar book null o undefined', () => {
      expect(getBookImage(null)).to.equal(DEFAULT_IMAGE);
      expect(getBookImage(undefined)).to.equal(DEFAULT_IMAGE);
    });

    it('debe manejar types de datos incorrectos', () => {
      expect(getBookImage('string')).to.equal(DEFAULT_IMAGE);
      expect(getBookImage(123)).to.equal(DEFAULT_IMAGE);
      expect(getBookImage([])).to.equal(DEFAULT_IMAGE);
    });

    it('debe usar API_URL personalizada', () => {
      const customApiUrl = 'https://api.bookloop.com';
      const book = {
        imageurl: '/uploads/image.jpg'
      };
      expect(getBookImage(book, customApiUrl)).to.equal(`${customApiUrl}/uploads/image.jpg`);
    });

    it('debe manejar imágenes con Assets en el array', () => {
      const book = {
        images: ['/Assets/book-image.jpg', '/uploads/image2.jpg']
      };
      expect(getBookImage(book)).to.equal('/Assets/book-image.jpg');
    });

    it('debe manejar strings vacíos en campos de imagen', () => {
      const book = {
        coverimageurl: '',
        images: [''],
        imageurl: '',
        imagen: ''
      };
      expect(getBookImage(book)).to.equal(DEFAULT_IMAGE);
    });
  });
}); 
