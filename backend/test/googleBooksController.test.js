const { expect } = require('chai');
const proxyquire = require('proxyquire');

describe('googleBooksController.js - Tests de Cobertura', () => {
  let googleBooksController;
  let mockFetch, mockBook;
  let req, res;

  beforeEach(() => {
    // Mock para node-fetch
    mockFetch = jest.fn();

    // Mock para Book model
    mockBook = {
      create: jest.fn()
    };

    // Cargar el controlador con mocks
    googleBooksController = proxyquire('../src/controllers/googleBooksController', {
      'node-fetch': mockFetch,
      '../models/Book.js': mockBook
    });

    // Setup req y res
    req = {
      query: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchBooks - Líneas 16-32, 48-56, 74', () => {
    it('debería retornar error 400 si no hay término de búsqueda - Líneas 6-8', async () => {
      req.query = {};

      await googleBooksController.searchBooks(req, res);

      expect(res.status.mock.calls.length).to.be.greaterThan(0);
      expect(res.status.mock.calls[0][0]).to.equal(400);
      expect(res.json.mock.calls.length).to.be.greaterThan(0);
      expect(res.json.mock.calls[0][0]).to.deep.equal({ 
        message: 'Término de búsqueda requerido' 
      });
    });

    it('debería buscar libros exitosamente y transformar datos - Líneas 16-32', async () => {
      req.query = { q: 'javascript' };
      
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          items: [{
            id: 'test-id',
            volumeInfo: {
              title: 'Test Book',
              authors: ['Test Author'],
              description: 'Test Description',
              imageLinks: {
                thumbnail: 'http://test.com/image.jpg'
              },
              publishedDate: '2024',
              pageCount: 200,
              categories: ['Fiction'],
              industryIdentifiers: [{
                type: 'ISBN_13',
                identifier: '9781234567890'
              }]
            }
          }]
        })
      };

      mockFetch.mockResolvedValue(mockResponse);

      await googleBooksController.searchBooks(req, res);

      expect(mockFetch.mock.calls.length).to.be.greaterThan(0);
      expect(mockFetch.mock.calls[0][0]).to.equal('https://www.googleapis.com/books/v1/volumes?q=javascript&langRestrict=es');
      expect(res.json.mock.calls.length).to.be.greaterThan(0);
      
      const result = res.json.mock.calls[0][0];
      expect(result).to.have.property('items');
      expect(result.items).to.have.length(1);
    });

    it('debería manejar respuesta sin items - Líneas 48-56', async () => {
      req.query = { q: 'nonexistentbook12345' };
      
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          totalItems: 0
        })
      };

      mockFetch.mockResolvedValue(mockResponse);

      await googleBooksController.searchBooks(req, res);

      expect(res.json.mock.calls.length).to.be.greaterThan(0);
      expect(res.json.mock.calls[0][0]).to.deep.equal({ 
        items: [], 
        totalItems: 0 
      });
    });

    it('debería manejar error de respuesta HTTP no exitosa - Líneas 16-18', async () => {
      req.query = { q: 'test' };
      
      const mockResponse = {
        ok: false,
        status: 500
      };

      mockFetch.mockResolvedValue(mockResponse);

      await googleBooksController.searchBooks(req, res);

      expect(res.status.mock.calls.length).to.be.greaterThan(0);
      expect(res.status.mock.calls[0][0]).to.equal(500);
      expect(res.json.mock.calls.length).to.be.greaterThan(0);
      const result = res.json.mock.calls[0][0];
      expect(result).to.have.property('message', 'Error al buscar libros');
    });

    it('debería manejar error general en catch - Línea 74', async () => {
      req.query = { q: 'test' };
      
      mockFetch.mockRejectedValue(new Error('Network error'));

      await googleBooksController.searchBooks(req, res);

      expect(res.status.mock.calls.length).to.be.greaterThan(0);
      expect(res.status.mock.calls[0][0]).to.equal(500);
      expect(res.json.mock.calls.length).to.be.greaterThan(0);
      const result = res.json.mock.calls[0][0];
      expect(result).to.have.property('message', 'Error al buscar libros');
    });

    it('debería transformar correctamente los datos del libro', async () => {
      req.query = { q: 'test' };
      
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          items: [{
            id: 'test-id',
            volumeInfo: {
              title: 'Test Book',
              authors: ['Test Author'],
              description: 'Test Description'
            }
          }]
        })
      };

      mockFetch.mockResolvedValue(mockResponse);

      await googleBooksController.searchBooks(req, res);
      
      const result = res.json.mock.calls[0][0];
      expect(result).to.have.property('items');
      
      if (result.items && result.items.length > 0) {
        const transformedBook = result.items[0];
        expect(transformedBook).to.have.property('id', 'test-id');
        expect(transformedBook.volumeInfo).to.have.property('title', 'Test Book');
        expect(transformedBook.volumeInfo).to.have.property('authors').that.deep.equals(['Test Author']);
        expect(transformedBook.volumeInfo).to.have.property('description', 'Test Description');
      }
    });
  });

  describe('addBookFromGoogle - Líneas adicionales', () => {
    it('debería manejar error al crear libro', async () => {
      mockBook.create.mockRejectedValue(new Error('Database error'));

      req.body = {
        google_books_id: 'test-id',
        title: 'Test Book'
      };

      await googleBooksController.addBookFromGoogle(req, res);

      expect(res.status.mock.calls.length).to.be.greaterThan(0);
      expect(res.status.mock.calls[0][0]).to.equal(500);
      expect(res.json.mock.calls.length).to.be.greaterThan(0);
      const result = res.json.mock.calls[0][0];
      expect(result).to.have.property('message', 'Error al agregar libro');
      expect(result).to.have.property('error', 'Database error');
    });
  });
}); 
