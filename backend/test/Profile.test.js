const { expect } = require('chai');
const sinon = require('sinon');

describe('Profile Model', () => {
  let mockSupabase;
  let Profile;

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
    delete require.cache[require.resolve('../src/models/Profile')];
    require.cache[require.resolve('../src/config/db')] = {
      exports: mockSupabase
    };
    
    Profile = require('../src/models/Profile');
  });

  afterEach(() => {
    sinon.restore();
    delete require.cache[require.resolve('../src/models/Profile')];
    delete require.cache[require.resolve('../src/config/db')];
  });

  describe('getAllProfiles', () => {
    it('debe retornar todos los perfiles exitosamente', async () => {
      const mockData = [
        { id: 1, userid: 1, bio: 'Usuario 1' },
        { id: 2, userid: 2, bio: 'Usuario 2' }
      ];
      mockSupabase.select.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Profile.getAllProfiles();

      expect(mockSupabase.from.calledWith('profiles')).to.be.true;
      expect(mockSupabase.select.calledWith('*')).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando Supabase falla', async () => {
      const mockError = new Error('Database error');
      mockSupabase.select.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Profile.getAllProfiles();
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getProfileById', () => {
    it('debe retornar un perfil por ID exitosamente', async () => {
      const mockData = { id: 1, userid: 1, bio: 'Mi perfil', location: 'Ciudad' };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Profile.getProfileById(1);

      expect(mockSupabase.from.calledWith('profiles')).to.be.true;
      expect(mockSupabase.select.calledWith('*')).to.be.true;
      expect(mockSupabase.eq.calledWith('id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando el perfil no existe', async () => {
      const mockError = new Error('Profile not found');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Profile.getProfileById(999);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getProfileByUserId', () => {
    it('debe retornar un perfil por userId exitosamente', async () => {
      const mockData = { id: 1, userid: 5, bio: 'Mi perfil', location: 'Ciudad' };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Profile.getProfileByUserId(5);

      expect(mockSupabase.from.calledWith('profiles')).to.be.true;
      expect(mockSupabase.select.calledWith('*')).to.be.true;
      expect(mockSupabase.eq.calledWith('userid', 5)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando el perfil no existe para el userId', async () => {
      const mockError = new Error('Profile not found for user');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Profile.getProfileByUserId(999);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('createProfile', () => {
    it('debe crear un perfil exitosamente', async () => {
      const profileData = { userid: 1, bio: 'Nuevo perfil', location: 'Mi ciudad' };
      const mockData = { id: 1, ...profileData };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Profile.createProfile(profileData);

      expect(mockSupabase.from.calledWith('profiles')).to.be.true;
      expect(mockSupabase.insert.calledWith([profileData])).to.be.true;
      expect(mockSupabase.select.called).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la creación', async () => {
      const profileData = { userid: null, bio: 'Perfil inválido' };
      const mockError = new Error('Validation error');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Profile.createProfile(profileData);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('updateProfile', () => {
    it('debe actualizar un perfil exitosamente', async () => {
      const updates = { bio: 'Perfil actualizado', location: 'Nueva ciudad' };
      const mockData = { id: 1, userid: 1, ...updates };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Profile.updateProfile(1, updates);

      expect(mockSupabase.from.calledWith('profiles')).to.be.true;
      expect(mockSupabase.update.calledWith(updates)).to.be.true;
      expect(mockSupabase.eq.calledWith('id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la actualización', async () => {
      const updates = { bio: 'Perfil actualizado' };
      const mockError = new Error('Update error');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Profile.updateProfile(1, updates);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('updateProfileByUserId', () => {
    it('debe actualizar un perfil por userId exitosamente', async () => {
      const updates = { bio: 'Perfil actualizado por userId', location: 'Ciudad nueva' };
      const mockData = { id: 1, userid: 5, ...updates };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Profile.updateProfileByUserId(5, updates);

      expect(mockSupabase.from.calledWith('profiles')).to.be.true;
      expect(mockSupabase.update.calledWith(updates)).to.be.true;
      expect(mockSupabase.eq.calledWith('userid', 5)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la actualización por userId', async () => {
      const updates = { bio: 'Perfil actualizado' };
      const mockError = new Error('Update by userId error');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Profile.updateProfileByUserId(5, updates);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('deleteProfile', () => {
    it('debe eliminar un perfil exitosamente', async () => {
      mockSupabase.delete.returns(Promise.resolve({ error: null }));

      const result = await Profile.deleteProfile(1);

      expect(mockSupabase.from.calledWith('profiles')).to.be.true;
      expect(mockSupabase.delete.called).to.be.true;
      expect(mockSupabase.eq.calledWith('id', 1)).to.be.true;
      expect(result).to.deep.equal({ success: true });
    });

    it('debe lanzar error cuando falla la eliminación', async () => {
      const mockError = new Error('Delete error');
      mockSupabase.delete.returns(Promise.resolve({ error: mockError }));

      try {
        await Profile.deleteProfile(1);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });
}); 
