const { expect } = require('chai');
const sinon = require('sinon');

describe('User Model', () => {
  let mockSupabase;
  let mockBcrypt;
  let User;

  beforeEach(() => {
    // Mock Supabase
    mockSupabase = {
      from: sinon.stub().returnsThis(),
      select: sinon.stub().returnsThis(),
      eq: sinon.stub().returnsThis(),
      insert: sinon.stub().returnsThis(),
      update: sinon.stub().returnsThis(),
      delete: sinon.stub().returnsThis(),
      single: sinon.stub().returnsThis()
    };

    // Mock bcrypt
    mockBcrypt = {
      hash: sinon.stub(),
      compare: sinon.stub()
    };

    // Mock requires
    delete require.cache[require.resolve('../src/models/User')];
    require.cache[require.resolve('../src/config/db')] = {
      exports: mockSupabase
    };
    require.cache[require.resolve('bcryptjs')] = {
      exports: mockBcrypt
    };
    
    User = require('../src/models/User');
  });

  afterEach(() => {
    sinon.restore();
    delete require.cache[require.resolve('../src/models/User')];
    delete require.cache[require.resolve('../src/config/db')];
    delete require.cache[require.resolve('bcryptjs')];
  });

  describe('getAllUsers', () => {
    it('debe retornar todos los usuarios exitosamente', async () => {
      const mockData = [
        { id: 1, nombre: 'John', apellido: 'Doe', email: 'john@test.com' },
        { id: 2, nombre: 'Jane', apellido: 'Smith', email: 'jane@test.com' }
      ];
      mockSupabase.select.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await User.getAllUsers();

      expect(mockSupabase.from.calledWith('users')).to.be.true;
      expect(mockSupabase.select.calledWith('id, nombre, apellido, username, email, role')).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando Supabase falla', async () => {
      const mockError = new Error('Database error');
      mockSupabase.select.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await User.getAllUsers();
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getUserById', () => {
    it('debe retornar un usuario por ID exitosamente', async () => {
      const mockData = { id: 1, nombre: 'John', email: 'john@test.com' };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await User.getUserById(1);

      expect(mockSupabase.from.calledWith('users')).to.be.true;
      expect(mockSupabase.select.calledWith('*')).to.be.true;
      expect(mockSupabase.eq.calledWith('id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando el usuario no existe', async () => {
      const mockError = new Error('User not found');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await User.getUserById(999);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getUserByEmail', () => {
    it('debe retornar un usuario por email exitosamente (array con un elemento)', async () => {
      const mockData = [{ id: 1, email: 'john@test.com', nombre: 'John' }];
      mockSupabase.eq.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await User.getUserByEmail('john@test.com');

      expect(mockSupabase.from.calledWith('users')).to.be.true;
      expect(mockSupabase.eq.calledWith('email', 'john@test.com')).to.be.true;
      expect(result).to.deep.equal(mockData[0]);
    });

    it('debe retornar un usuario por email exitosamente (objeto único)', async () => {
      const mockData = { id: 1, email: 'john@test.com', nombre: 'John' };
      mockSupabase.eq.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await User.getUserByEmail('john@test.com');

      expect(result).to.deep.equal(mockData);
    });

    it('debe retornar null cuando no encuentra el usuario (array vacío)', async () => {
      mockSupabase.eq.returns(Promise.resolve({ data: [], error: null }));

      const result = await User.getUserByEmail('notfound@test.com');

      expect(result).to.be.null;
    });

    it('debe retornar null cuando data es null', async () => {
      mockSupabase.eq.returns(Promise.resolve({ data: null, error: null }));

      const result = await User.getUserByEmail('notfound@test.com');

      expect(result).to.be.null;
    });

    it('debe retornar null cuando hay múltiples usuarios con el mismo email', async () => {
      const mockData = [
        { id: 1, email: 'duplicate@test.com' },
        { id: 2, email: 'duplicate@test.com' }
      ];
      mockSupabase.eq.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await User.getUserByEmail('duplicate@test.com');

      expect(result).to.be.null;
    });

    it('debe lanzar error cuando Supabase falla', async () => {
      const mockError = new Error('Database error');
      mockSupabase.eq.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await User.getUserByEmail('john@test.com');
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('createUser', () => {
    it('debe crear un usuario exitosamente', async () => {
      const userData = { 
        email: 'newuser@test.com', 
        password: 'plainpassword',
        nombre: 'New',
        apellido: 'User'
      };
      const hashedPassword = 'hashedpassword123';
      const mockData = [{ id: 1, ...userData, password: hashedPassword }];
      
      mockBcrypt.hash.returns(Promise.resolve(hashedPassword));
      mockSupabase.select.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await User.createUser(userData);

      expect(mockBcrypt.hash.calledWith('plainpassword', 10)).to.be.true;
      expect(mockSupabase.from.calledWith('users')).to.be.true;
      expect(mockSupabase.insert.calledWith([{ ...userData, password: hashedPassword }])).to.be.true;
      expect(result).to.deep.equal(mockData[0]);
    });

    it('debe crear un usuario y retornar objeto único cuando no es array', async () => {
      const userData = { email: 'newuser@test.com', password: 'plainpassword' };
      const hashedPassword = 'hashedpassword123';
      const mockData = { id: 1, ...userData, password: hashedPassword };
      
      mockBcrypt.hash.returns(Promise.resolve(hashedPassword));
      mockSupabase.select.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await User.createUser(userData);

      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error controlado para email duplicado', async () => {
      const userData = { email: 'duplicate@test.com', password: 'password' };
      const hashedPassword = 'hashedpassword123';
      const mockError = { code: '23505', message: 'duplicate key value violates unique constraint' };
      
      mockBcrypt.hash.returns(Promise.resolve(hashedPassword));
      mockSupabase.select.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await User.createUser(userData);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error.message).to.equal('El email ya está registrado');
      }
    });

    it('debe lanzar error controlado para mensaje de clave duplicada', async () => {
      const userData = { email: 'duplicate@test.com', password: 'password' };
      const hashedPassword = 'hashedpassword123';
      const mockError = { message: 'duplicate key error occurred' };
      
      mockBcrypt.hash.returns(Promise.resolve(hashedPassword));
      mockSupabase.select.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await User.createUser(userData);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error.message).to.equal('El email ya está registrado');
      }
    });

    it('debe lanzar error original para otros errores', async () => {
      const userData = { email: 'newuser@test.com', password: 'password' };
      const hashedPassword = 'hashedpassword123';
      const mockError = new Error('Other database error');
      
      mockBcrypt.hash.returns(Promise.resolve(hashedPassword));
      mockSupabase.select.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await User.createUser(userData);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('updateUser', () => {
    it('debe actualizar un usuario exitosamente', async () => {
      const updates = { nombre: 'Updated', apellido: 'Name' };
      const mockData = { id: 1, ...updates };
      
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await User.updateUser(1, updates);

      expect(mockSupabase.from.calledWith('users')).to.be.true;
      expect(mockSupabase.update.calledWith(updates)).to.be.true;
      expect(mockSupabase.eq.calledWith('id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe actualizar contraseña hasheándola', async () => {
      const updates = { password: 'newpassword' };
      const hashedPassword = 'newhashed123';
      const mockData = { id: 1, password: hashedPassword };
      
      mockBcrypt.hash.returns(Promise.resolve(hashedPassword));
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await User.updateUser(1, updates);

      expect(mockBcrypt.hash.calledWith('newpassword', 10)).to.be.true;
      expect(mockSupabase.update.calledWith({ password: hashedPassword })).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe retornar usuario actual cuando no hay actualizaciones', async () => {
      const mockUserData = { id: 1, nombre: 'John' };
      
      // Mock getUserById para el caso sin actualizaciones
      const mockGetUserById = sinon.stub().returns(Promise.resolve(mockUserData));
      User.getUserById = mockGetUserById;

      const result = await User.updateUser(1, {});

      expect(mockGetUserById.calledWith(1)).to.be.true;
      expect(result).to.deep.equal(mockUserData);
    });

    it('debe lanzar error cuando falla la actualización', async () => {
      const updates = { nombre: 'Updated' };
      const mockError = new Error('Update error');
      
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await User.updateUser(1, updates);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('deleteUser', () => {
    it('debe eliminar un usuario exitosamente', async () => {
      mockSupabase.delete.returns(Promise.resolve({ error: null }));

      const result = await User.deleteUser(1);

      expect(mockSupabase.from.calledWith('users')).to.be.true;
      expect(mockSupabase.delete.called).to.be.true;
      expect(mockSupabase.eq.calledWith('id', 1)).to.be.true;
      expect(result).to.deep.equal({ success: true });
    });

    it('debe lanzar error cuando falla la eliminación', async () => {
      const mockError = new Error('Delete error');
      mockSupabase.delete.returns(Promise.resolve({ error: mockError }));

      try {
        await User.deleteUser(1);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('validatePassword', () => {
    it('debe validar contraseña correcta', async () => {
      const user = { password: 'hashedpassword' };
      const plainPassword = 'plainpassword';
      
      mockBcrypt.compare.returns(Promise.resolve(true));

      const result = await User.validatePassword(user, plainPassword);

      expect(mockBcrypt.compare.calledWith(plainPassword, 'hashedpassword')).to.be.true;
      expect(result).to.be.true;
    });

    it('debe rechazar contraseña incorrecta', async () => {
      const user = { password: 'hashedpassword' };
      const plainPassword = 'wrongpassword';
      
      mockBcrypt.compare.returns(Promise.resolve(false));

      const result = await User.validatePassword(user, plainPassword);

      expect(result).to.be.false;
    });

    it('debe retornar false para usuario null', async () => {
      const result = await User.validatePassword(null, 'password');
      expect(result).to.be.false;
    });

    it('debe retornar false para usuario sin password', async () => {
      const user = { email: 'test@test.com' };
      const result = await User.validatePassword(user, 'password');
      expect(result).to.be.false;
    });
  });

  describe('validPassword', () => {
    it('debe validar contraseña usando bcrypt.compare', async () => {
      const plainPassword = 'plainpassword';
      const hashedPassword = 'hashedpassword';
      
      mockBcrypt.compare.returns(Promise.resolve(true));

      const result = await User.validPassword(plainPassword, hashedPassword);

      expect(mockBcrypt.compare.calledWith(plainPassword, hashedPassword)).to.be.true;
      expect(result).to.be.true;
    });

    it('debe retornar false para contraseña incorrecta', async () => {
      const plainPassword = 'wrongpassword';
      const hashedPassword = 'hashedpassword';
      
      mockBcrypt.compare.returns(Promise.resolve(false));

      const result = await User.validPassword(plainPassword, hashedPassword);

      expect(result).to.be.false;
    });
  });
}); 
