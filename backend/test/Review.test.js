const { expect } = require('chai');
const sinon = require('sinon');

describe('Review Model', () => {
  let mockSupabase;
  let Review;

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
    delete require.cache[require.resolve('../src/models/Review')];
    require.cache[require.resolve('../src/config/db')] = {
      exports: mockSupabase
    };
    
    Review = require('../src/models/Review');
  });

  afterEach(() => {
    sinon.restore();
    delete require.cache[require.resolve('../src/models/Review')];
    delete require.cache[require.resolve('../src/config/db')];
  });

  describe('getAllReviews', () => {
    it('debe retornar todas las reviews exitosamente', async () => {
      const mockData = [
        { id: 1, user_id: 1, book_id: 1, rating: 5, comment: 'Excelente libro' },
        { id: 2, user_id: 2, book_id: 2, rating: 4, comment: 'Muy bueno' }
      ];
      mockSupabase.select.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Review.getAllReviews();

      expect(mockSupabase.from.calledWith('reviews')).to.be.true;
      expect(mockSupabase.select.calledWith('*')).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando Supabase falla', async () => {
      const mockError = new Error('Database error');
      mockSupabase.select.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Review.getAllReviews();
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getReviewById', () => {
    it('debe retornar una review por ID exitosamente', async () => {
      const mockData = { id: 1, user_id: 1, book_id: 1, rating: 5, comment: 'Excelente' };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Review.getReviewById(1);

      expect(mockSupabase.from.calledWith('reviews')).to.be.true;
      expect(mockSupabase.select.calledWith('*')).to.be.true;
      expect(mockSupabase.eq.calledWith('id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando la review no existe', async () => {
      const mockError = new Error('Review not found');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Review.getReviewById(999);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('createReview', () => {
    it('debe crear una review exitosamente', async () => {
      const reviewData = { user_id: 1, book_id: 1, rating: 5, comment: 'Excelente libro' };
      const mockData = { id: 1, ...reviewData };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Review.createReview(reviewData);

      expect(mockSupabase.from.calledWith('reviews')).to.be.true;
      expect(mockSupabase.insert.calledWith([reviewData])).to.be.true;
      expect(mockSupabase.select.called).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la creación', async () => {
      const reviewData = { user_id: null, book_id: 1, rating: 5 };
      const mockError = new Error('Validation error');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Review.createReview(reviewData);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('updateReview', () => {
    it('debe actualizar una review exitosamente', async () => {
      const updates = { rating: 4, comment: 'Review actualizada' };
      const mockData = { id: 1, user_id: 1, book_id: 1, ...updates };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Review.updateReview(1, updates);

      expect(mockSupabase.from.calledWith('reviews')).to.be.true;
      expect(mockSupabase.update.calledWith(updates)).to.be.true;
      expect(mockSupabase.eq.calledWith('id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la actualización', async () => {
      const updates = { rating: 3 };
      const mockError = new Error('Update error');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Review.updateReview(1, updates);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('deleteReview', () => {
    it('debe eliminar una review exitosamente', async () => {
      mockSupabase.delete.returns(Promise.resolve({ error: null }));

      const result = await Review.deleteReview(1);

      expect(mockSupabase.from.calledWith('reviews')).to.be.true;
      expect(mockSupabase.delete.called).to.be.true;
      expect(mockSupabase.eq.calledWith('id', 1)).to.be.true;
      expect(result).to.deep.equal({ success: true });
    });

    it('debe lanzar error cuando falla la eliminación', async () => {
      const mockError = new Error('Delete error');
      mockSupabase.delete.returns(Promise.resolve({ error: mockError }));

      try {
        await Review.deleteReview(1);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });
}); 
