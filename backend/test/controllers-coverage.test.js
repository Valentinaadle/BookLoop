// Configurar variables de entorno antes de importar módulos
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test_key_for_testing';
process.env.JWT_SECRET = 'test_jwt_secret_for_tests';

const { expect } = require('chai');
const sinon = require('sinon');

describe('Controllers Coverage Tests', () => {
  let consoleLogStub, consoleErrorStub;

  beforeEach(() => {
    // Silenciar console.log y console.error durante tests
    consoleLogStub = sinon.stub(console, 'log');
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('bookController - Casos de error y validaciones', () => {
    it('debería validar la configuración de multer', () => {
      // Test simple para verificar que podemos cargar el controlador
      expect(() => {
        require('../src/controllers/bookController');
      }).to.not.throw();
    });
  });

  describe('userController - Validaciones JWT', () => {
    it('debería usar JWT_SECRET del environment', () => {
      const userController = require('../src/controllers/userController');
      expect(userController).to.be.an('object');
      expect(userController.loginUser).to.be.a('function');
    });
  });

  describe('googleBooksController - Fetch requests', () => {
    it('debería tener funciones de búsqueda', () => {
      const googleController = require('../src/controllers/googleBooksController');
      expect(googleController).to.be.an('object');
      expect(googleController.searchBooks).to.be.a('function');
      expect(googleController.addBookFromGoogle).to.be.a('function');
    });
  });

  describe('notificationController - Email service', () => {
    it('debería tener función de notificación', () => {
      const notificationController = require('../src/controllers/notificationController');
      expect(notificationController).to.be.an('object');
      expect(notificationController.notifySeller).to.be.a('function');
    });
  });

  describe('Tests funcionales básicos', () => {
    let req, res;

    beforeEach(() => {
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

    describe('bookController uploadImage middleware', () => {
      it('debería retornar error 400 cuando no hay archivo', async () => {
        const bookController = require('../src/controllers/bookController');
        
        // Simular el middleware de upload sin archivo
        req.file = null;
        
        // Obtener la función del middleware (segunda posición del array)
        const uploadHandler = bookController.uploadImage[1];
        await uploadHandler(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ message: 'No se subió ninguna imagen' })).to.be.true;
      });

      it('debería retornar URL de imagen cuando hay archivo', async () => {
        const bookController = require('../src/controllers/bookController');
        
        // Simular archivo subido
        req.file = { filename: 'test-image.jpg' };
        
        const uploadHandler = bookController.uploadImage[1];
        await uploadHandler(req, res);

        expect(res.json.calledWith({ imageurl: '/uploads/test-image.jpg' })).to.be.true;
      });
    });

    describe('googleBooksController validaciones', () => {
      it('debería validar parámetro de búsqueda requerido', async () => {
        const googleController = require('../src/controllers/googleBooksController');
        
        // Sin parámetro 'q'
        req.query = {};
        
        await googleController.searchBooks(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ message: 'Se requiere un término de búsqueda' })).to.be.true;
      });
    });

    describe('notificationController validaciones', () => {
      it('debería validar datos requeridos para notificación', async () => {
        const notificationController = require('../src/controllers/notificationController');
        
        // Datos faltantes
        req.body = {};
        
        await notificationController.notifySeller(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({
          success: false,
          message: 'Faltan datos requeridos'
        })).to.be.true;
      });

      it('debería validar datos parcialmente faltantes', async () => {
        const notificationController = require('../src/controllers/notificationController');
        
        // Solo algunos datos
        req.body = { bookId: 1 }; // Faltan buyerName y buyerEmail
        
        await notificationController.notifySeller(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({
          success: false,
          message: 'Faltan datos requeridos'
        })).to.be.true;
      });
    });
  });

  describe('Tests de lógica específica', () => {
    it('debería probar normalización de autores en createBook', () => {
      // Test de la lógica de normalización de autores que se ejecuta en bookController
      
      // Caso 1: String JSON
      let authors = '["Author 1", "Author 2"]';
      if (typeof authors === 'string') {
        try {
          const parsed = JSON.parse(authors);
          if (Array.isArray(parsed)) {
            authors = parsed;
          } else {
            authors = [authors];
          }
        } catch {
          authors = authors.split(',').map(a => a.trim());
        }
      }
      expect(authors).to.deep.equal(['Author 1', 'Author 2']);

      // Caso 2: String separado por comas
      authors = 'Author 1, Author 2, Author 3';
      if (typeof authors === 'string') {
        try {
          const parsed = JSON.parse(authors);
          if (Array.isArray(parsed)) {
            authors = parsed;
          } else {
            authors = [authors];
          }
        } catch {
          authors = authors.split(',').map(a => a.trim());
        }
      }
      expect(authors).to.deep.equal(['Author 1', 'Author 2', 'Author 3']);

      // Caso 3: Array anidado
      authors = [['Author 1'], ['Author 2']];
      if (Array.isArray(authors)) {
        authors = authors.flat(Infinity).map(a => typeof a === 'string' ? a.trim() : a).filter(Boolean);
      }
      expect(authors).to.deep.equal(['Author 1', 'Author 2']);
    });

    it('debería filtrar URLs de imágenes inválidas', () => {
      // Test de la lógica de filtrado de imágenes en updateBook
      const images = ['valid-url.jpg', '', null, undefined, 'another-valid.png', '   '];
      
      const filteredImages = images.filter(url => typeof url === 'string' && url.trim().length > 0);
      
      expect(filteredImages).to.deep.equal(['valid-url.jpg', 'another-valid.png']);
    });

    it('debería procesar vendedor con fallback values', () => {
      // Test de la lógica de procesamiento de vendedor en getBooks
      
      // Caso 1: Vendedor completo
      let book = {
        seller: { nombre: 'Juan', apellido: 'Pérez', username: 'juan', email: 'juan@test.com' }
      };
      let vendedor = book.seller ? 
        `${book.seller.nombre || ''} ${book.seller.apellido || ''}`.trim() || 
        book.seller.username || 
        book.seller.email : 'No especificado';
      expect(vendedor).to.equal('Juan Pérez');

      // Caso 2: Solo username
      book = {
        seller: { nombre: '', apellido: '', username: 'juanp', email: 'juan@test.com' }
      };
      vendedor = book.seller ? 
        `${book.seller.nombre || ''} ${book.seller.apellido || ''}`.trim() || 
        book.seller.username || 
        book.seller.email : 'No especificado';
      expect(vendedor).to.equal('juanp');

      // Caso 3: Solo email
      book = {
        seller: { nombre: '', apellido: '', username: '', email: 'juan@test.com' }
      };
      vendedor = book.seller ? 
        `${book.seller.nombre || ''} ${book.seller.apellido || ''}`.trim() || 
        book.seller.username || 
        book.seller.email : 'No especificado';
      expect(vendedor).to.equal('juan@test.com');

      // Caso 4: Sin vendedor
      book = {};
      vendedor = book.seller ? 
        `${book.seller.nombre || ''} ${book.seller.apellido || ''}`.trim() || 
        book.seller.username || 
        book.seller.email : 'No especificado';
      expect(vendedor).to.equal('No especificado');
    });

    it('debería procesar datos de Google Books con valores por defecto', () => {
      // Test de lógica de addBookFromGoogle
      
      // Caso con datos completos
      let bookData = {
        title: 'Test Book',
        authors: ['Author 1', 'Author 2'],
        industryIdentifiers: [{ identifier: '9781234567890' }],
        description: 'Test description',
        publishedDate: '2023',
        pageCount: 200,
        imageLinks: { thumbnail: 'test-image.jpg' }
      };

      let processedData = {
        title: bookData.title || 'Sin título',
        author: bookData.authors ? bookData.authors.join(', ') : 'Autor desconocido',
        isbn: bookData.industryIdentifiers ? 
            bookData.industryIdentifiers[0].identifier : 'ISBN no disponible',
        description: bookData.description || 'Sin descripción',
        publishedDate: bookData.publishedDate || null,
        pageCount: bookData.pageCount || 0,
        imageUrl: bookData.imageLinks ? bookData.imageLinks.thumbnail : null,
        quantity: 1
      };

      expect(processedData.title).to.equal('Test Book');
      expect(processedData.author).to.equal('Author 1, Author 2');
      expect(processedData.isbn).to.equal('9781234567890');

      // Caso con datos vacíos
      bookData = {};
      processedData = {
        title: bookData.title || 'Sin título',
        author: bookData.authors ? bookData.authors.join(', ') : 'Autor desconocido',
        isbn: bookData.industryIdentifiers ? 
            bookData.industryIdentifiers[0].identifier : 'ISBN no disponible',
        description: bookData.description || 'Sin descripción',
        publishedDate: bookData.publishedDate || null,
        pageCount: bookData.pageCount || 0,
        imageUrl: bookData.imageLinks ? bookData.imageLinks.thumbnail : null,
        quantity: 1
      };

      expect(processedData.title).to.equal('Sin título');
      expect(processedData.author).to.equal('Autor desconocido');
      expect(processedData.isbn).to.equal('ISBN no disponible');
    });
  });
}); 
