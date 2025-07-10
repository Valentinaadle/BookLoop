const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('bookController.js - Tests de Cobertura', () => {
  let bookController;
  let mockAxios, mockBook, mockImage, mockCategory, mockDb, mockMulter, mockFs, mockPath;
  let req, res;

  beforeEach(() => {
    // Mocks para axios
    mockAxios = {
      get: sinon.stub()
    };

    // Mocks para modelos
    mockBook = {
      createBook: sinon.stub(),
      getBookById: sinon.stub(),
      getAllBooks: sinon.stub(),
      updateBook: sinon.stub(),
      deleteBook: sinon.stub(),
      updateBookCover: sinon.stub(),
      getBooksByUser: sinon.stub()
    };

    mockImage = {
      getImagesByBook: sinon.stub(),
      createImage: sinon.stub(),
      deleteImage: sinon.stub()
    };

    mockCategory = {};

    // Mock para la base de datos Supabase
    mockDb = {
      from: sinon.stub().returnsThis(),
      select: sinon.stub().returnsThis(),
      eq: sinon.stub().returnsThis(),
      neq: sinon.stub().returnsThis(),
      single: sinon.stub()
    };

    // Mock para multer
    const mockStorage = {
      destination: sinon.stub(),
      filename: sinon.stub()
    };
    mockMulter = sinon.stub().returns({
      single: sinon.stub().returns((req, res, next) => {
        req.file = { filename: 'test-image.jpg' };
        next();
      })
    });
    mockMulter.diskStorage = sinon.stub().returns(mockStorage);

    // Mock para fs
    mockFs = {
      existsSync: sinon.stub(),
      mkdirSync: sinon.stub()
    };

    // Mock para path
    mockPath = {
      join: sinon.stub().returns('/test/path'),
      extname: sinon.stub().returns('.jpg')
    };

    // Cargar el controlador con mocks
    bookController = proxyquire('../src/controllers/bookController', {
      'axios': mockAxios,
      '../models': { Book: mockBook },
      '../models/Image': mockImage,
      '../models/Category': mockCategory,
      '../config/db': mockDb,
      'multer': mockMulter,
      'fs': mockFs,
      'path': mockPath
    });

    // Setup req y res
    req = {
      params: {},
      body: {},
      query: {},
      file: null
    };
    res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
      send: sinon.stub()
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('uploadImage - Líneas 15-37', () => {
    it('debería configurar multer correctamente y subir imagen', async () => {
      mockFs.existsSync.returns(false);
      
      req.file = { filename: 'test-image.jpg' };
      
      const uploadMiddleware = bookController.uploadImage[1];
      await uploadMiddleware(req, res);
      
      expect(res.json.calledWith({ imageurl: '/uploads/test-image.jpg' })).to.be.true;
    });

    it('debería retornar error 400 si no hay archivo - Línea 32', async () => {
      req.file = null;
      
      const uploadMiddleware = bookController.uploadImage[1];
      await uploadMiddleware(req, res);
      
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'No se subió ninguna imagen' })).to.be.true;
    });
  });

  describe('getBooks - Líneas 43-75', () => {
    it('debería obtener libros con imágenes y vendedores - Líneas 43-60', async () => {
      const mockBooks = [{
        book_id: 1,
        title: 'Test Book',
        imageurl: 'test.jpg',
        seller: { id: 1, nombre: 'Juan', apellido: 'Pérez', username: 'juan', email: 'juan@test.com' },
        category: { category_id: 1, category_name: 'Ficción' }
      }];

      mockDb.from.returns(mockDb);
      mockDb.select.returns(mockDb);
      mockDb.neq.returns({ data: mockBooks, error: null });
      mockImage.getImagesByBook.resolves([{ image_url: 'test.jpg' }]);

      await bookController.getBooks(req, res);

      expect(res.json.called).to.be.true;
      const result = res.json.firstCall.args[0];
      expect(result[0]).to.have.property('vendedor', 'Juan Pérez');
      expect(result[0]).to.have.property('categoria', 'Ficción');
    });

    it('debería manejar error en la consulta - Líneas 72-75', async () => {
      mockDb.from.returns(mockDb);
      mockDb.select.returns(mockDb);
      mockDb.neq.returns({ data: null, error: new Error('DB Error') });

      await bookController.getBooks(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'Error al obtener libros' })).to.be.true;
    });

    it('debería sincronizar imageurl con tabla images - Líneas 50-58', async () => {
      const mockBooks = [{
        book_id: 1,
        imageurl: 'new-image.jpg',
        seller: { nombre: 'Test', apellido: 'User' },
        category: { category_name: 'Test' }
      }];

      mockDb.neq.returns({ data: mockBooks, error: null });
      mockImage.getImagesByBook.onFirstCall().resolves([]);
      mockImage.getImagesByBook.onSecondCall().resolves([{ image_url: 'new-image.jpg' }]);
      mockImage.createImage.resolves({ image_id: 1 });

      await bookController.getBooks(req, res);

      expect(mockImage.createImage.calledWith({ book_id: 1, image_url: 'new-image.jpg' })).to.be.true;
    });
  });

  describe('getBookById - Líneas 81-113', () => {
    it('debería obtener libro por ID exitosamente - Líneas 81-100', async () => {
      const mockBook = {
        book_id: 1,
        title: 'Test Book',
        seller: { nombre: 'Juan', apellido: 'Pérez' },
        category: { category_name: 'Ficción' }
      };

      mockDb.single.resolves({ data: mockBook, error: null });
      mockImage.getImagesByBook.resolves([{ image_url: 'test.jpg' }]);

      req.params.id = 1;
      await bookController.getBookById(req, res);

      expect(res.json.called).to.be.true;
      const result = res.json.firstCall.args[0];
      expect(result).to.have.property('vendedor', 'Juan Pérez');
    });

    it('debería retornar 404 si libro no existe - Líneas 87-89', async () => {
      mockDb.single.resolves({ data: null, error: new Error('Not found') });

      req.params.id = 999;
      await bookController.getBookById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Libro no encontrado' })).to.be.true;
    });

    it('debería manejar error general - Líneas 110-113', async () => {
      mockDb.single.throws(new Error('Database error'));

      req.params.id = 1;
      await bookController.getBookById(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'Error al obtener libro' })).to.be.true;
    });
  });

  describe('createBook - Líneas 119-232', () => {
    it('debería validar campos requeridos - Líneas 140-145', async () => {
      req.body = { description: 'Test' }; // Faltan title, authors, seller_id

      await bookController.createBook(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        message: 'El título, los autores y el vendedor son requeridos'
      })).to.be.true;
    });

    it('debería normalizar autores de string a array - Líneas 147-166', async () => {
      req.body = {
        title: 'Test Book',
        authors: 'Juan Pérez, María García',
        seller_id: 1
      };

      mockBook.createBook.resolves({ book_id: 1 });
      mockImage.createImage.resolves({ image_id: 1 });
      mockBook.updateBookCover.resolves();

      await bookController.createBook(req, res);

      expect(mockBook.createBook.called).to.be.true;
      const bookData = mockBook.createBook.firstCall.args[0];
      expect(bookData.authors).to.deep.equal(['Juan Pérez', 'María García']);
    });

    it('debería obtener imagen de Google Books si no hay imagen y existe ISBN - Líneas 170-178', async () => {
      req.body = {
        title: 'Test Book',
        authors: ['Test Author'],
        seller_id: 1,
        isbn_code: '9781234567890'
      };

      mockAxios.get.resolves({
        data: {
          items: [{
            volumeInfo: {
              imageLinks: { thumbnail: 'https://google-image.jpg' }
            }
          }]
        }
      });

      mockBook.createBook.resolves({ book_id: 1 });
      mockImage.createImage.resolves({ image_id: 1 });
      mockBook.updateBookCover.resolves();

      await bookController.createBook(req, res);

      expect(mockAxios.get.calledWith('https://www.googleapis.com/books/v1/volumes?q=isbn:9781234567890')).to.be.true;
    });

    it('debería manejar error al crear libro - Líneas 227-232', async () => {
      req.body = {
        title: 'Test Book',
        authors: ['Test Author'],
        seller_id: 1
      };

      mockBook.createBook.throws(new Error('Database error'));

      await bookController.createBook(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'Error al crear libro' })).to.be.true;
    });

    it('debería procesar múltiples imágenes - Líneas 205-220', async () => {
      req.body = {
        title: 'Test Book',
        authors: ['Test Author'],
        seller_id: 1,
        images: ['image1.jpg', 'image2.jpg'],
        coverimageurl: 'image2.jpg'
      };

      mockBook.createBook.resolves({ book_id: 1 });
      mockImage.createImage.resolves({ image_id: 1 });
      mockBook.updateBookCover.resolves();

      await bookController.createBook(req, res);

      expect(mockImage.createImage.callCount).to.equal(2);
      expect(mockBook.updateBookCover.calledWith(1, 'image2.jpg')).to.be.true;
    });
  });

  describe('updateBook - Líneas 238-381', () => {
    beforeEach(() => {
      req.params.id = 1;
    });

    it('debería retornar 404 si libro no existe - Líneas 250-252', async () => {
      mockBook.getBookById.resolves(null);

      await bookController.updateBook(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Libro no encontrado' })).to.be.true;
    });

    it('debería normalizar autores - Líneas 254-267', async () => {
      req.body = {
        authors: '["Juan Pérez", "María García"]'
      };

      const mockBookData = { book_id: 1, seller_id: 1 };
      mockBook.getBookById.resolves(mockBookData);
      mockImage.getImagesByBook.resolves([]);
      mockBook.updateBook.resolves(mockBookData);

      await bookController.updateBook(req, res);

      expect(mockBook.updateBook.called).to.be.true;
    });

    it('debería manejar eliminación de imágenes - Líneas 295-305', async () => {
      req.body = {
        deletedImageIds: [1, 2]
      };

      const mockBookData = { book_id: 1 };
      mockBook.getBookById.resolves(mockBookData);
      mockImage.getImagesByBook.resolves([{ image_id: 1 }, { image_id: 2 }]);
      mockImage.deleteImage.resolves();
      mockBook.updateBook.resolves(mockBookData);

      await bookController.updateBook(req, res);

      expect(mockImage.deleteImage.calledTwice).to.be.true;
    });

    it('debería agregar nuevas imágenes - Líneas 308-318', async () => {
      req.body = {
        images: ['new-image1.jpg', 'new-image2.jpg']
      };

      const mockBookData = { book_id: 1 };
      mockBook.getBookById.resolves(mockBookData);
      mockImage.getImagesByBook.resolves([]);
      mockImage.createImage.resolves({ image_id: 1 });
      mockBook.updateBook.resolves(mockBookData);

      await bookController.updateBook(req, res);

      expect(mockImage.createImage.calledTwice).to.be.true;
    });

    it('debería manejar error en updateBook del modelo - Líneas 365-368', async () => {
      const mockBookData = { book_id: 1 };
      mockBook.getBookById.resolves(mockBookData);
      mockImage.getImagesByBook.resolves([]);
      mockBook.updateBook.throws(new Error('Update error'));

      await bookController.updateBook(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });

    it('debería manejar error general - Líneas 377-381', async () => {
      mockBook.getBookById.throws(new Error('General error'));

      await bookController.updateBook(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe('deleteBook - Líneas 387-413', () => {
    it('debería retornar 404 si libro no existe - Líneas 390-392', async () => {
      mockBook.getBookById.resolves(null);

      req.params.id = 999;
      await bookController.deleteBook(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Libro no encontrado' })).to.be.true;
    });

    it('debería eliminar wishlist e imágenes asociadas - Líneas 394-410', async () => {
      const mockBookData = { book_id: 1 };
      const mockWishlist = { deleteWishlistByBookId: sinon.stub().resolves() };
      const mockImages = [{ id: 1 }, { id: 2 }];

      // Mock para Wishlist
      const bookControllerWithWishlist = proxyquire('../src/controllers/bookController', {
        'axios': mockAxios,
        '../models': { Book: mockBook },
        '../models/Image': mockImage,
        '../models/Wishlist': mockWishlist,
        '../config/db': mockDb,
        'multer': mockMulter,
        'fs': mockFs,
        'path': mockPath
      });

      mockBook.getBookById.resolves(mockBookData);
      mockImage.getImagesByBook.resolves(mockImages);
      mockImage.deleteImage.resolves();
      mockBook.deleteBook.resolves();

      req.params.id = 1;
      await bookControllerWithWishlist.deleteBook(req, res);

      expect(mockWishlist.deleteWishlistByBookId.calledWith(1)).to.be.true;
      expect(mockImage.deleteImage.calledTwice).to.be.true;
      expect(mockBook.deleteBook.calledWith(1)).to.be.true;
      expect(res.json.calledWith({ message: 'Libro eliminado correctamente' })).to.be.true;
    });

    it('debería manejar error general - Líneas 411-413', async () => {
      mockBook.getBookById.throws(new Error('Delete error'));

      req.params.id = 1;
      await bookController.deleteBook(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe('searchBooks - Líneas 418-447', () => {
    it('debería buscar libros en Google Books API - Líneas 419-445', async () => {
      req.query.query = 'test book';

      const mockResponse = {
        data: {
          items: [{
            id: 'google-id-1',
            volumeInfo: {
              title: 'Test Book',
              authors: ['Test Author'],
              description: 'Test description',
              publishedDate: '2023',
              industryIdentifiers: [{ identifier: '1234567890' }],
              pagecount: 200,
              imageLinks: { thumbnail: 'test-image.jpg' },
              categories: ['Fiction'],
              language: 'es',
              averageRating: 4.5
            }
          }]
        }
      };

      mockAxios.get.resolves(mockResponse);

      await bookController.searchBooks(req, res);

      expect(mockAxios.get.calledWith('https://www.googleapis.com/books/v1/volumes')).to.be.true;
      expect(res.json.called).to.be.true;
      const result = res.json.firstCall.args[0];
      expect(result[0]).to.have.property('googleBooksId', 'google-id-1');
      expect(result[0]).to.have.property('title', 'Test Book');
    });

    it('debería manejar error en búsqueda - Líneas 446-447', async () => {
      req.query.query = 'test';
      mockAxios.get.throws(new Error('API Error'));

      await bookController.searchBooks(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Error al buscar libros en Google Books' })).to.be.true;
    });
  });

  describe('searchBookByISBN - Líneas 521-544', () => {
    it('debería retornar error si no hay ISBN - Líneas 523-525', async () => {
      req.query = {};

      await bookController.searchBookByISBN(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'ISBN requerido' })).to.be.true;
    });

    it('debería buscar libro por ISBN exitosamente - Líneas 527-540', async () => {
      req.query.isbn = '9781234567890';

      mockAxios.get.resolves({
        data: {
          totalItems: 1,
          items: [{
            volumeInfo: {
              title: 'Test Book',
              authors: ['Test Author'],
              language: 'es',
              description: 'Test description',
              imageLinks: { thumbnail: 'test.jpg' },
              pagecount: 200,
              publishedDate: '2023'
            }
          }]
        }
      });

      await bookController.searchBookByISBN(req, res);

      expect(res.json.called).to.be.true;
      const result = res.json.firstCall.args[0];
      expect(result).to.have.property('titulo', 'Test Book');
      expect(result).to.have.property('autor', 'Test Author');
    });

    it('debería retornar 404 si no encuentra resultados - Líneas 541-542', async () => {
      req.query.isbn = '9781234567890';

      mockAxios.get.resolves({
        data: { totalItems: 0 }
      });

      await bookController.searchBookByISBN(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'No se encontró información para ese ISBN.' })).to.be.true;
    });

    it('debería manejar error en búsqueda - Línea 544', async () => {
      req.query.isbn = '9781234567890';
      mockAxios.get.throws(new Error('API Error'));

      await bookController.searchBookByISBN(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Error al buscar el libro por ISBN.' })).to.be.true;
    });
  });

  describe('getBooksByUser - Líneas 550-556', () => {
    it('debería obtener libros del usuario - Líneas 551-554', async () => {
      req.params.userId = 1;
      const mockBooks = [{ book_id: 1, title: 'User Book' }];
      mockBook.getBooksByUser.resolves(mockBooks);

      await bookController.getBooksByUser(req, res);

      expect(mockBook.getBooksByUser.calledWith(1)).to.be.true;
      expect(res.json.calledWith(mockBooks)).to.be.true;
    });

    it('debería manejar error - Líneas 555-556', async () => {
      req.params.userId = 1;
      mockBook.getBooksByUser.throws(new Error('User books error'));

      await bookController.getBooksByUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'Error al obtener libros del usuario' })).to.be.true;
    });
  });

  describe('searchBooksInDB - Líneas 561-585', () => {
    it('debería retornar array vacío si no hay query - Líneas 563-565', async () => {
      req.query = {};

      await bookController.searchBooksInDB(req, res);

      expect(res.json.calledWith([])).to.be.true;
    });

    it('debería filtrar libros por título, autor, ISBN - Líneas 567-583', async () => {
      req.query.query = 'test';
      
      const mockBooks = [
        { title: 'Test Book', authors: ['Author'], isbn: '123', isbn_code: '456' },
        { title: 'Another', authors: ['Test Author'], isbn: '789', isbn_code: '012' },
        { title: 'Different', authors: ['Other'], isbn: '345', isbn_code: '678' }
      ];

      mockBook.getAllBooks.resolves(mockBooks);

      await bookController.searchBooksInDB(req, res);

      expect(res.json.called).to.be.true;
      const result = res.json.firstCall.args[0];
      expect(result).to.have.length(2); // Solo los que contienen 'test'
    });

    it('debería manejar error en búsqueda - Línea 585', async () => {
      req.query.query = 'test';
      mockBook.getAllBooks.throws(new Error('Search error'));

      await bookController.searchBooksInDB(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Error al buscar libros en la base de datos' })).to.be.true;
    });
  });

  describe('getLibraryBooks - Líneas 510-515', () => {
    it('debería obtener todos los libros de la biblioteca - Líneas 511-513', async () => {
      const mockBooks = [{ book_id: 1, title: 'Library Book' }];
      mockBook.getAllBooks.resolves(mockBooks);

      await bookController.getLibraryBooks(req, res);

      expect(mockBook.getAllBooks.called).to.be.true;
      expect(res.json.calledWith(mockBooks)).to.be.true;
    });

    it('debería manejar error - Líneas 514-515', async () => {
      mockBook.getAllBooks.throws(new Error('Library error'));

      await bookController.getLibraryBooks(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Error al obtener libros de la biblioteca' })).to.be.true;
    });
  });
}); 
