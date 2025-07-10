const { expect } = require('chai');
const sinon = require('sinon');

describe('Role Model', () => {
  let mockSupabase;
  let Role;

  beforeEach(() => {
    // Mock Supabase
    mockSupabase = {
      from: sinon.stub().returnsThis(),
      select: sinon.stub().returnsThis(),
      eq: sinon.stub().returnsThis(),
      single: sinon.stub().returnsThis(),
      insert: sinon.stub().returnsThis(),
      update: sinon.stub().returnsThis(),
      delete: sinon.stub().returnsThis()
    };

    // Mock require para Supabase
    delete require.cache[require.resolve('../src/models/Role')];
    require.cache[require.resolve('../src/config/db')] = {
      exports: mockSupabase
    };
    
    Role = require('../src/models/Role');
  });

  afterEach(() => {
    sinon.restore();
    delete require.cache[require.resolve('../src/models/Role')];
    delete require.cache[require.resolve('../src/config/db')];
  });

  describe('getAllRoles', () => {
    it('debe retornar todos los roles exitosamente', async () => {
      const mockData = [
        { id: 1, name: 'admin', description: 'Administrator' },
        { id: 2, name: 'user', description: 'Regular user' }
      ];
      mockSupabase.select.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Role.getAllRoles();

      expect(mockSupabase.from.calledWith('roles')).to.be.true;
      expect(mockSupabase.select.calledWith('*')).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando Supabase falla', async () => {
      const mockError = new Error('Database error');
      mockSupabase.select.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Role.getAllRoles();
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getRoleById', () => {
    it('debe retornar un rol por ID exitosamente', async () => {
      const mockData = { id: 1, name: 'admin', description: 'Administrator role' };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Role.getRoleById(1);

      expect(mockSupabase.from.calledWith('roles')).to.be.true;
      expect(mockSupabase.select.calledWith('*')).to.be.true;
      expect(mockSupabase.eq.calledWith('id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando el rol no existe', async () => {
      const mockError = new Error('Role not found');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Role.getRoleById(999);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('createRole', () => {
    it('debe crear un rol exitosamente', async () => {
      const roleData = { name: 'moderator', description: 'Moderator role' };
      const mockData = { id: 1, ...roleData };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Role.createRole(roleData);

      expect(mockSupabase.from.calledWith('roles')).to.be.true;
      expect(mockSupabase.insert.calledWith([roleData])).to.be.true;
      expect(mockSupabase.select.called).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la creación', async () => {
      const roleData = { name: '', description: 'Invalid role' };
      const mockError = new Error('Validation error');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Role.createRole(roleData);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('updateRole', () => {
    it('debe actualizar un rol exitosamente', async () => {
      const updates = { description: 'Updated description' };
      const mockData = { id: 1, name: 'admin', ...updates };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Role.updateRole(1, updates);

      expect(mockSupabase.from.calledWith('roles')).to.be.true;
      expect(mockSupabase.update.calledWith(updates)).to.be.true;
      expect(mockSupabase.eq.calledWith('id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la actualización', async () => {
      const updates = { description: 'Updated' };
      const mockError = new Error('Update error');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Role.updateRole(1, updates);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('deleteRole', () => {
    it('debe eliminar un rol exitosamente', async () => {
      mockSupabase.delete.returns(Promise.resolve({ error: null }));

      const result = await Role.deleteRole(1);

      expect(mockSupabase.from.calledWith('roles')).to.be.true;
      expect(mockSupabase.delete.called).to.be.true;
      expect(mockSupabase.eq.calledWith('id', 1)).to.be.true;
      expect(result).to.deep.equal({ success: true });
    });

    it('debe lanzar error cuando falla la eliminación', async () => {
      const mockError = new Error('Delete error');
      mockSupabase.delete.returns(Promise.resolve({ error: mockError }));

      try {
        await Role.deleteRole(1);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });
}); 
