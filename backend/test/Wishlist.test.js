const { expect } = require('chai');
const sinon = require('sinon');

describe('Wishlist Model', () => {
  let mockSupabase;
  let Wishlist;

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
    delete require.cache[require.resolve('../src/models/Wishlist')];
    require.cache[require.resolve('../src/config/db')] = {
      exports: mockSupabase
    };
    
    Wishlist = require('../src/models/Wishlist');
  });

  afterEach(() => {
    sinon.restore();
    delete require.cache[require.resolve('../src/models/Wishlist')];
    delete require.cache[require.resolve('../src/config/db')];
  });

  describe('getAllWishlist', () => {
    it('debe retornar todos los registros de wishlist exitosamente', async () => {
      const mockData = [
        { wishlist_id: 1, user_id: 1, book_id: 1 },
        { wishlist_id: 2, user_id: 2, book_id: 2 }
      ];
      mockSupabase.select.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Wishlist.getAllWishlist();

      expect(mockSupabase.from.calledWith('wishlist')).to.be.true;
      expect(mockSupabase.select.calledWith('*')).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando Supabase falla', async () => {
      const mockError = new Error('Database error');
      mockSupabase.select.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Wishlist.getAllWishlist();
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getWishlistById', () => {
    it('debe retornar un registro de wishlist por ID exitosamente', async () => {
      const mockData = { wishlist_id: 1, user_id: 1, book_id: 1, created_at: '2024-01-01' };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Wishlist.getWishlistById(1);

      expect(mockSupabase.from.calledWith('wishlist')).to.be.true;
      expect(mockSupabase.select.calledWith('*')).to.be.true;
      expect(mockSupabase.eq.calledWith('wishlist_id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando el registro no existe', async () => {
      const mockError = new Error('Wishlist item not found');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Wishlist.getWishlistById(999);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('createWishlist', () => {
    it('debe crear un registro de wishlist exitosamente', async () => {
      const wishlistData = { user_id: 1, book_id: 1 };
      const mockData = { wishlist_id: 1, ...wishlistData };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Wishlist.createWishlist(wishlistData);

      expect(mockSupabase.from.calledWith('wishlist')).to.be.true;
      expect(mockSupabase.insert.calledWith([wishlistData])).to.be.true;
      expect(mockSupabase.select.called).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la creación', async () => {
      const wishlistData = { user_id: null, book_id: 1 };
      const mockError = new Error('Validation error');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Wishlist.createWishlist(wishlistData);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('updateWishlist', () => {
    it('debe actualizar un registro de wishlist exitosamente', async () => {
      const updates = { notes: 'Libro interesante' };
      const mockData = { wishlist_id: 1, user_id: 1, book_id: 1, ...updates };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Wishlist.updateWishlist(1, updates);

      expect(mockSupabase.from.calledWith('wishlist')).to.be.true;
      expect(mockSupabase.update.calledWith(updates)).to.be.true;
      expect(mockSupabase.eq.calledWith('wishlist_id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la actualización', async () => {
      const updates = { notes: 'Notas actualizadas' };
      const mockError = new Error('Update error');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Wishlist.updateWishlist(1, updates);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('deleteWishlist', () => {
    it('debe eliminar un registro de wishlist exitosamente', async () => {
      mockSupabase.delete.returns(Promise.resolve({ error: null }));

      const result = await Wishlist.deleteWishlist(1);

      expect(mockSupabase.from.calledWith('wishlist')).to.be.true;
      expect(mockSupabase.delete.called).to.be.true;
      expect(mockSupabase.eq.calledWith('wishlist_id', 1)).to.be.true;
      expect(result).to.deep.equal({ success: true });
    });

    it('debe lanzar error cuando falla la eliminación', async () => {
      const mockError = new Error('Delete error');
      mockSupabase.delete.returns(Promise.resolve({ error: mockError }));

      try {
        await Wishlist.deleteWishlist(1);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('deleteWishlistByBookId', () => {
    it('debe eliminar todos los registros de wishlist por book_id exitosamente', async () => {
      mockSupabase.delete.returns(Promise.resolve({ error: null }));

      const result = await Wishlist.deleteWishlistByBookId(1);

      expect(mockSupabase.from.calledWith('wishlist')).to.be.true;
      expect(mockSupabase.delete.called).to.be.true;
      expect(mockSupabase.eq.calledWith('book_id', 1)).to.be.true;
      expect(result).to.deep.equal({ success: true });
    });

    it('debe lanzar error cuando falla la eliminación por book_id', async () => {
      const mockError = new Error('Delete by book_id error');
      mockSupabase.delete.returns(Promise.resolve({ error: mockError }));

      try {
        await Wishlist.deleteWishlistByBookId(1);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });

    it('debe manejar eliminación exitosa cuando no hay registros para el book_id', async () => {
      // Esto debería seguir siendo exitoso incluso si no hay registros para eliminar
      mockSupabase.delete.returns(Promise.resolve({ error: null }));

      const result = await Wishlist.deleteWishlistByBookId(999);

      expect(mockSupabase.eq.calledWith('book_id', 999)).to.be.true;
      expect(result).to.deep.equal({ success: true });
    });
  });
}); 
