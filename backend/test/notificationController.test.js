const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('notificationController.js - Tests de Cobertura', () => {
  let notificationController;
  let mockBook, mockUser, mockSolicitud, mockEmailService;
  let req, res;

  beforeEach(() => {
    // Mocks para modelos
    mockBook = {
      getBookById: sinon.stub()
    };

    mockUser = {};

    mockSolicitud = {
      createSolicitud: sinon.stub()
    };

    // Mock para emailService
    mockEmailService = {
      sendInterestEmail: sinon.stub()
    };

    // Cargar el controlador con mocks
    notificationController = proxyquire('../src/controllers/notificationController', {
      '../models': { Book: mockBook, User: mockUser },
      '../services/emailService': mockEmailService,
      '../models/Solicitud': mockSolicitud
    });

    // Setup req y res
    req = {
      body: {}
    };
    res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis()
    };

    // Mock console.log to avoid output during tests
    sinon.stub(console, 'log');
    sinon.stub(console, 'error');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('notifySeller - Líneas 6-59', () => {
    it('debería validar datos requeridos - Líneas 9-16', async () => {
      // Caso 1: Faltan todos los datos
      req.body = {};

      await notificationController.notifySeller(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: 'Faltan datos requeridos'
      })).to.be.true;
    });

    it('debería validar datos requeridos - falta buyerName', async () => {
      req.body = {
        bookId: 1,
        buyerEmail: 'buyer@test.com'
        // Falta buyerName
      };

      await notificationController.notifySeller(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: 'Faltan datos requeridos'
      })).to.be.true;
    });

    it('debería validar datos requeridos - falta buyerEmail', async () => {
      req.body = {
        bookId: 1,
        buyerName: 'Juan Comprador'
        // Falta buyerEmail
      };

      await notificationController.notifySeller(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: 'Faltan datos requeridos'
      })).to.be.true;
    });

    it('debería retornar 404 si libro no existe - Líneas 23-28', async () => {
      req.body = {
        bookId: 999,
        buyerName: 'Juan Comprador',
        buyerEmail: 'buyer@test.com',
        buyerId: 1
      };

      mockBook.getBookById.resolves(null);

      await notificationController.notifySeller(req, res);

      expect(mockBook.getBookById.calledWith(999)).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: 'Libro o vendedor no encontrado'
      })).to.be.true;
    });

    it('debería retornar 404 si libro no tiene vendedor - Líneas 23-28', async () => {
      req.body = {
        bookId: 1,
        buyerName: 'Juan Comprador',
        buyerEmail: 'buyer@test.com',
        buyerId: 1
      };

      const mockBookData = {
        book_id: 1,
        title: 'Test Book'
        // Sin seller
      };

      mockBook.getBookById.resolves(mockBookData);

      await notificationController.notifySeller(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: 'Libro o vendedor no encontrado'
      })).to.be.true;
    });

    it('debería procesar notificación exitosamente - Líneas 35-48', async () => {
      req.body = {
        bookId: 1,
        buyerName: 'Juan Comprador',
        buyerEmail: 'buyer@test.com',
        buyerId: 2
      };

      const mockBookData = {
        book_id: 1,
        title: 'JavaScript: The Good Parts',
        seller: {
          id: 1,
          email: 'seller@test.com',
          nombre: 'María',
          apellido: 'Vendedora'
        }
      };

      mockBook.getBookById.resolves(mockBookData);
      mockSolicitud.createSolicitud.resolves({ id: 1 });
      mockEmailService.sendInterestEmail.resolves();

      await notificationController.notifySeller(req, res);

      // Verificar que se creó la solicitud
      expect(mockSolicitud.createSolicitud.calledWith({
        book_id: 1,
        seller_id: 1,
        buyer_id: 2
      })).to.be.true;

      // Verificar que se envió el email
      expect(mockEmailService.sendInterestEmail.calledWith({
        sellerEmail: 'seller@test.com',
        bookTitle: 'JavaScript: The Good Parts',
        buyerName: 'Juan Comprador',
        buyerEmail: 'buyer@test.com'
      })).to.be.true;

      // Verificar respuesta exitosa
      expect(res.json.calledWith({
        success: true,
        message: 'Notificación enviada al vendedor'
      })).to.be.true;
    });

    it('debería manejar error al buscar libro - Líneas 54-59', async () => {
      req.body = {
        bookId: 1,
        buyerName: 'Juan Comprador',
        buyerEmail: 'buyer@test.com',
        buyerId: 1
      };

      mockBook.getBookById.throws(new Error('Database connection failed'));

      await notificationController.notifySeller(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;
      
      const result = res.json.firstCall.args[0];
      expect(result).to.have.property('success', false);
      expect(result).to.have.property('message', 'Error al enviar la notificación');
      expect(result).to.have.property('error', 'Database connection failed');
    });

    it('debería manejar error al crear solicitud', async () => {
      req.body = {
        bookId: 1,
        buyerName: 'Juan Comprador',
        buyerEmail: 'buyer@test.com',
        buyerId: 2
      };

      const mockBookData = {
        book_id: 1,
        title: 'Test Book',
        seller: {
          id: 1,
          email: 'seller@test.com'
        }
      };

      mockBook.getBookById.resolves(mockBookData);
      mockSolicitud.createSolicitud.throws(new Error('Solicitud creation failed'));

      await notificationController.notifySeller(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;
      
      const result = res.json.firstCall.args[0];
      expect(result).to.have.property('success', false);
      expect(result).to.have.property('message', 'Error al enviar la notificación');
    });

    it('debería manejar error al enviar email', async () => {
      req.body = {
        bookId: 1,
        buyerName: 'Juan Comprador',
        buyerEmail: 'buyer@test.com',
        buyerId: 2
      };

      const mockBookData = {
        book_id: 1,
        title: 'Test Book',
        seller: {
          id: 1,
          email: 'seller@test.com'
        }
      };

      mockBook.getBookById.resolves(mockBookData);
      mockSolicitud.createSolicitud.resolves({ id: 1 });
      mockEmailService.sendInterestEmail.throws(new Error('Email service unavailable'));

      await notificationController.notifySeller(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;
      
      const result = res.json.firstCall.args[0];
      expect(result).to.have.property('success', false);
      expect(result).to.have.property('message', 'Error al enviar la notificación');
    });

    it('debería loggear información de debug correctamente', async () => {
      req.body = {
        bookId: 1,
        buyerName: 'Juan Comprador',
        buyerEmail: 'buyer@test.com',
        buyerId: 2
      };

      const mockBookData = {
        book_id: 1,
        title: 'Test Book',
        seller: {
          id: 1,
          email: 'seller@test.com'
        }
      };

      mockBook.getBookById.resolves(mockBookData);
      mockSolicitud.createSolicitud.resolves({ id: 1 });
      mockEmailService.sendInterestEmail.resolves();

      await notificationController.notifySeller(req, res);

      // Verificar que se llamaron los console.log apropiados
      expect(console.log.calledWith('Recibida petición de notificación:', req.body)).to.be.true;
      expect(console.log.calledWith('Buscando libro con ID:', 1)).to.be.true;
      expect(console.log.calledWith('Email enviado exitosamente')).to.be.true;
    });
  });
}); 
