const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('googleBooksController.js - Tests de Cobertura', () => {
  let googleBooksController;
  let mockFetch, mockBook;
  let req, res;

  beforeEach(() => {
    // Mock para node-fetch
    mockFetch = sinon.stub();

    // Mock para Book model
    mockBook = {
      create: sinon.stub()
    };

    // Cargar el controlador con mocks
    googleBooksController = proxyquire('../src/controllers/googleBooksController', {
      'node-fetch': mockFetch,
      '../models/Book': mockBook
    });

    // Setup req y res
    req = {
      query: {},
      body: {}
    };
    res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis()
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('searchBooks - Líneas 16-32, 48-56, 74', () => {
    it('debería retornar error 400 si no hay término de búsqueda - Líneas 6-8', async () => {
      req.query = {}; // Sin parámetro 'q'

      await googleBooksController.searchBooks(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Se requiere un término de búsqueda' })).to.be.true;
    });

    it('debería buscar libros exitosamente y transformar datos - Líneas 16-32', async () => {
      req.query.q = 'javascript';

      const mockApiResponse = {
        ok: true,
        json: sinon.stub().resolves({
          totalItems: 1,
          items: [{
            id: 'google-book-id-1',
            volumeInfo: {
              title: 'JavaScript: The Good Parts',
              authors: ['Douglas Crockford'],
              description: 'A book about JavaScript',
              imageLinks: { thumbnail: 'http://example.com/image.jpg' },
              publishedDate: '2008',
              pageCount: 176,
              categories: ['Programming'],
              language: 'en'
            }
          }]
        })
      };

      mockFetch.resolves(mockApiResponse);

      await googleBooksController.searchBooks(req, res);

      expect(mockFetch.calledWith('https://www.googleapis.com/books/v1/volumes?q=javascript&langRestrict=es')).to.be.true;
      expect(res.json.called).to.be.true;
      
      const result = res.json.firstCall.args[0];
      expect(result).to.have.property('items');
      expect(result.items[0]).to.have.property('id', 'google-book-id-1');
      expect(result.items[0].volumeInfo).to.have.property('title', 'JavaScript: The Good Parts');
    });

    it('debería manejar respuesta sin items - Líneas 48-56', async () => {
      req.query.q = 'nonexistentbook12345';

      const mockApiResponse = {
        ok: true,
        json: sinon.stub().resolves({
          totalItems: 0
          // Sin property 'items'
        })
      };

      mockFetch.resolves(mockApiResponse);

      await googleBooksController.searchBooks(req, res);

      expect(res.json.calledWith({ items: [] })).to.be.true;
    });

    it('debería manejar error de respuesta HTTP no exitosa - Líneas 16-18', async () => {
      req.query.q = 'test';

      const mockApiResponse = {
        ok: false,
        status: 500
      };

      mockFetch.resolves(mockApiResponse);

      await googleBooksController.searchBooks(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;
      const result = res.json.firstCall.args[0];
      expect(result).to.have.property('message', 'Error al buscar libros');
    });

    it('debería manejar error general en catch - Línea 74', async () => {
      req.query.q = 'test';
      mockFetch.throws(new Error('Network error'));

      await googleBooksController.searchBooks(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;
      const result = res.json.firstCall.args[0];
      expect(result).to.have.property('message', 'Error al buscar libros');
      expect(result).to.have.property('error', 'Network error');
    });

    it('debería transformar correctamente los datos del libro', async () => {
      req.query.q = 'test';

      const mockApiResponse = {
        ok: true,
        json: sinon.stub().resolves({
          totalItems: 1,
          items: [{
            id: 'test-id',
            volumeInfo: {
              title: 'Test Book',
              authors: ['Test Author'],
              description: 'Test Description',
              imageLinks: { thumbnail: 'test-image.jpg' },
              publishedDate: '2023',
              pageCount: 200,
              categories: ['Test Category'],
              language: 'es'
            }
          }]
        })
      };

      mockFetch.resolves(mockApiResponse);

      await googleBooksController.searchBooks(req, res);

      const result = res.json.firstCall.args[0];
      const transformedBook = result.items[0];
      
      expect(transformedBook).to.have.property('id', 'test-id');
      expect(transformedBook.volumeInfo).to.have.property('title', 'Test Book');
      expect(transformedBook.volumeInfo).to.have.property('authors').that.deep.equals(['Test Author']);
      expect(transformedBook.volumeInfo).to.have.property('description', 'Test Description');
      expect(transformedBook.volumeInfo).to.have.property('imageLinks').that.deep.equals({ thumbnail: 'test-image.jpg' });
    });
  });

  describe('addBookFromGoogle - Líneas adicionales', () => {
    beforeEach(() => {
      req.body = {
        title: 'Test Book',
        authors: ['Test Author'],
        industryIdentifiers: [{ identifier: '9781234567890' }],
        description: 'Test Description',
        publishedDate: '2023',
        pageCount: 200,
        imageLinks: { thumbnail: 'test-image.jpg' }
      };
    });

    it('debería agregar libro desde Google Books exitosamente', async () => {
      const mockCreatedBook = {
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        isbn: '9781234567890'
      };

      mockBook.create.resolves(mockCreatedBook);

      await googleBooksController.addBookFromGoogle(req, res);

      expect(mockBook.create.called).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(mockCreatedBook)).to.be.true;
    });

    it('debería manejar datos faltantes con valores por defecto', async () => {
      req.body = {}; // Datos vacíos

      const expectedBookData = {
        title: 'Sin título',
        author: 'Autor desconocido',
        isbn: 'ISBN no disponible',
        description: 'Sin descripción',
        publishedDate: null,
        pageCount: 0,
        imageUrl: null,
        quantity: 1
      };

      mockBook.create.resolves({ id: 1, ...expectedBookData });

      await googleBooksController.addBookFromGoogle(req, res);

      expect(mockBook.create.calledWith(expectedBookData)).to.be.true;
    });

    it('debería procesar authors como string concatenado', async () => {
      req.body.authors = ['Author 1', 'Author 2', 'Author 3'];

      mockBook.create.resolves({ id: 1 });

      await googleBooksController.addBookFromGoogle(req, res);

      const createCall = mockBook.create.firstCall.args[0];
      expect(createCall.author).to.equal('Author 1, Author 2, Author 3');
    });

    it('debería manejar error al crear libro', async () => {
      mockBook.create.throws(new Error('Database error'));

      await googleBooksController.addBookFromGoogle(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;
      const result = res.json.firstCall.args[0];
      expect(result).to.have.property('message', 'Error al agregar libro');
      expect(result).to.have.property('error', 'Database error');
    });
  });
}); 
