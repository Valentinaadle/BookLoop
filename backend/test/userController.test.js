const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('userController.js - Tests de Cobertura', () => {
  let userController;
  let mockUser, mockJwt;
  let req, res;

  beforeEach(() => {
    // Mocks para User model
    mockUser = {
      getAllUsers: sinon.stub(),
      getUserById: sinon.stub(),
      getUserByEmail: sinon.stub(),
      validatePassword: sinon.stub(),
      createUser: sinon.stub(),
      updateUser: sinon.stub(),
      deleteUser: sinon.stub()
    };

    // Mock para JWT
    mockJwt = {
      sign: sinon.stub()
    };

    // Cargar el controlador con mocks
    userController = proxyquire('../src/controllers/userController', {
      '../models': { User: mockUser },
      'jsonwebtoken': mockJwt
    });

    // Setup req y res
    req = {
      params: {},
      body: {},
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

  describe('getUsers - Líneas 8-13', () => {
    it('debería obtener todos los usuarios exitosamente - Líneas 9-11', async () => {
      const mockUsers = [
        { id: 1, username: 'user1', email: 'user1@test.com' },
        { id: 2, username: 'user2', email: 'user2@test.com' }
      ];
      mockUser.getAllUsers.resolves(mockUsers);

      await userController.getUsers(req, res);

      expect(mockUser.getAllUsers.called).to.be.true;
      expect(res.json.calledWith(mockUsers)).to.be.true;
    });

    it('debería manejar error al obtener usuarios - Líneas 12-13', async () => {
      mockUser.getAllUsers.throws(new Error('Database error'));

      await userController.getUsers(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'Error al obtener usuarios' })).to.be.true;
    });
  });

  describe('getUserById - Líneas 19-28', () => {
    it('debería obtener usuario por ID exitosamente - Líneas 20-22', async () => {
      const mockUserData = { id: 1, username: 'testuser', email: 'test@test.com' };
      mockUser.getUserById.resolves(mockUserData);

      req.params.id = 1;
      await userController.getUserById(req, res);

      expect(mockUser.getUserById.calledWith(1)).to.be.true;
      expect(res.json.calledWith(mockUserData)).to.be.true;
    });

    it('debería retornar 404 si usuario no existe - Líneas 23-25', async () => {
      mockUser.getUserById.resolves(null);

      req.params.id = 999;
      await userController.getUserById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Usuario no encontrado' })).to.be.true;
    });

    it('debería manejar error al obtener usuario - Líneas 26-28', async () => {
      mockUser.getUserById.throws(new Error('Database error'));

      req.params.id = 1;
      await userController.getUserById(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'Error al obtener usuario' })).to.be.true;
    });
  });

  describe('loginUser - Líneas 34-66', () => {
    beforeEach(() => {
      req.body = {
        email: 'test@test.com',
        password: 'testpassword'
      };
    });

    it('debería hacer login exitosamente - Líneas 35-53', async () => {
      const mockUserData = {
        id: 1,
        username: 'testuser',
        email: 'test@test.com',
        nombre: 'Test',
        apellido: 'User',
        role: 'user'
      };

      mockUser.getUserByEmail.resolves(mockUserData);
      mockUser.validatePassword.resolves(true);
      mockJwt.sign.returns('fake-jwt-token');

      await userController.loginUser(req, res);

      expect(mockUser.getUserByEmail.calledWith('test@test.com')).to.be.true;
      expect(mockUser.validatePassword.calledWith(mockUserData, 'testpassword')).to.be.true;
      expect(res.json.called).to.be.true;
      
      const result = res.json.firstCall.args[0];
      expect(result).to.have.property('user');
      expect(result).to.have.property('token', 'fake-jwt-token');
    });

    it('debería retornar 401 si usuario no existe - Líneas 37-39', async () => {
      mockUser.getUserByEmail.resolves(null);

      await userController.loginUser(req, res);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ message: 'Credenciales inválidas' })).to.be.true;
    });

    it('debería retornar 401 si password inválido - Líneas 41-43', async () => {
      const mockUserData = { id: 1, email: 'test@test.com' };
      mockUser.getUserByEmail.resolves(mockUserData);
      mockUser.validatePassword.resolves(false);

      await userController.loginUser(req, res);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ message: 'Credenciales inválidas' })).to.be.true;
    });

    it('debería generar JWT token correctamente - Líneas 45-48', async () => {
      const mockUserData = {
        id: 1,
        email: 'test@test.com',
        username: 'testuser'
      };

      mockUser.getUserByEmail.resolves(mockUserData);
      mockUser.validatePassword.resolves(true);
      mockJwt.sign.returns('jwt-token');

      await userController.loginUser(req, res);

      expect(mockJwt.sign.calledWith(
        { id: 1, email: 'test@test.com' },
        sinon.match.string,
        { expiresIn: '24h' }
      )).to.be.true;
    });

    it('debería manejar error en login - Líneas 64-66', async () => {
      mockUser.getUserByEmail.throws(new Error('Database error'));

      await userController.loginUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'Error al iniciar sesión' })).to.be.true;
    });
  });

  describe('createUser - Líneas 72-93', () => {
    beforeEach(() => {
      req.body = {
        username: 'newuser',
        email: 'new@test.com',
        password: 'password123',
        nombre: 'New',
        apellido: 'User'
      };
    });

    it('debería crear usuario exitosamente - Líneas 73-87', async () => {
      mockUser.getUserByEmail.resolves(null); // No existe usuario
      mockUser.createUser.resolves({ id: 1 });

      await userController.createUser(req, res);

      expect(mockUser.getUserByEmail.calledWith('new@test.com')).to.be.true;
      expect(mockUser.createUser.calledWith({
        username: 'newuser',
        email: 'new@test.com',
        password: 'password123',
        nombre: 'New',
        apellido: 'User',
        role: 'user',
        activo: true
      })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ message: 'Usuario registrado exitosamente' })).to.be.true;
    });

    it('debería retornar 400 si email ya existe - Líneas 76-78', async () => {
      const existingUser = { id: 1, email: 'new@test.com' };
      mockUser.getUserByEmail.resolves(existingUser);

      await userController.createUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'El email ya está registrado' })).to.be.true;
    });

    it('debería manejar error al crear usuario - Líneas 91-93', async () => {
      mockUser.getUserByEmail.resolves(null);
      mockUser.createUser.throws(new Error('Database error'));

      await userController.createUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'Error al crear usuario' })).to.be.true;
    });
  });

  describe('updateUser - Líneas 99-110', () => {
    beforeEach(() => {
      req.params.id = 1;
      req.body = {
        username: 'updateduser',
        nombre: 'Updated',
        photo_url: 'should-be-excluded.jpg'
      };
    });

    it('debería actualizar usuario exitosamente excluyendo photo_url - Líneas 100-108', async () => {
      const mockUserData = { id: 1, username: 'olduser' };
      const updatedUser = { id: 1, username: 'updateduser' };

      mockUser.getUserById.resolves(mockUserData);
      mockUser.updateUser.resolves(updatedUser);

      await userController.updateUser(req, res);

      expect(mockUser.getUserById.calledWith(1)).to.be.true;
      expect(mockUser.updateUser.calledWith(1, {
        username: 'updateduser',
        nombre: 'Updated'
        // photo_url should be excluded
      })).to.be.true;
      expect(res.json.calledWith(updatedUser)).to.be.true;
    });

    it('debería retornar 404 si usuario no existe - Líneas 101-103', async () => {
      mockUser.getUserById.resolves(null);

      await userController.updateUser(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Usuario no encontrado' })).to.be.true;
    });

    it('debería manejar error al actualizar - Líneas 108-110', async () => {
      mockUser.getUserById.throws(new Error('Database error'));

      await userController.updateUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'Error al actualizar usuario' })).to.be.true;
    });
  });

  describe('uploadProfilePhoto - Líneas 116-136', () => {
    beforeEach(() => {
      req.params.id = 1;
    });

    it('debería subir foto de perfil exitosamente - Líneas 117-132', async () => {
      req.file = { filename: 'profile-photo.jpg' };
      const mockUserData = { id: 1, username: 'testuser' };
      const updatedUser = { id: 1, photo_url: '/uploads/profiles/profile-photo.jpg' };

      mockUser.getUserById.resolves(mockUserData);
      mockUser.updateUser.resolves(updatedUser);

      await userController.uploadProfilePhoto(req, res);

      expect(mockUser.getUserById.calledWith(1)).to.be.true;
      expect(mockUser.updateUser.calledWith(1, { photo_url: '/uploads/profiles/profile-photo.jpg' })).to.be.true;
      expect(res.json.called).to.be.true;
      
      const result = res.json.firstCall.args[0];
      expect(result).to.have.property('message', 'Foto de perfil actualizada correctamente');
      expect(result).to.have.property('photo_url', '/uploads/profiles/profile-photo.jpg');
    });

    it('debería retornar 400 si no hay archivo - Líneas 118-120', async () => {
      req.file = null;

      await userController.uploadProfilePhoto(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'No se recibió ningún archivo' })).to.be.true;
    });

    it('debería retornar 404 si usuario no existe - Líneas 122-124', async () => {
      req.file = { filename: 'photo.jpg' };
      mockUser.getUserById.resolves(null);

      await userController.uploadProfilePhoto(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Usuario no encontrado' })).to.be.true;
    });

    it('debería manejar error al subir foto - Líneas 134-136', async () => {
      req.file = { filename: 'photo.jpg' };
      mockUser.getUserById.throws(new Error('Database error'));

      await userController.uploadProfilePhoto(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'Error al subir foto de perfil' })).to.be.true;
    });
  });

  describe('deleteUser - Líneas 142-152', () => {
    it('debería eliminar usuario exitosamente - Líneas 143-147', async () => {
      const mockUserData = { id: 1, username: 'testuser' };
      mockUser.getUserById.resolves(mockUserData);
      mockUser.deleteUser.resolves();

      req.params.id = 1;
      await userController.deleteUser(req, res);

      expect(mockUser.getUserById.calledWith(1)).to.be.true;
      expect(mockUser.deleteUser.calledWith(1)).to.be.true;
      expect(res.json.calledWith({ message: 'Usuario eliminado' })).to.be.true;
    });

    it('debería retornar 404 si usuario no existe - Línea 148', async () => {
      mockUser.getUserById.resolves(null);

      req.params.id = 999;
      await userController.deleteUser(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Usuario no encontrado' })).to.be.true;
    });

    it('debería manejar error al eliminar - Líneas 150-152', async () => {
      mockUser.getUserById.throws(new Error('Database error'));

      req.params.id = 1;
      await userController.deleteUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'Error al eliminar usuario' })).to.be.true;
    });
  });
}); 
