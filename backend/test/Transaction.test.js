const { expect } = require('chai');
const sinon = require('sinon');

describe('Transaction Model', () => {
  let mockSupabase;
  let Transaction;

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
    delete require.cache[require.resolve('../src/models/Transaction')];
    require.cache[require.resolve('../src/config/db')] = {
      exports: mockSupabase
    };
    
    Transaction = require('../src/models/Transaction');
  });

  afterEach(() => {
    sinon.restore();
    delete require.cache[require.resolve('../src/models/Transaction')];
    delete require.cache[require.resolve('../src/config/db')];
  });

  describe('getAllTransactions', () => {
    it('debe retornar todas las transacciones exitosamente', async () => {
      const mockData = [
        { 
          id: 1, 
          buyer_id: 1, 
          seller_id: 2, 
          book_id: 1, 
          amount: 29.99, 
          status: 'completed' 
        },
        { 
          id: 2, 
          buyer_id: 2, 
          seller_id: 3, 
          book_id: 2, 
          amount: 39.99, 
          status: 'pending' 
        }
      ];
      mockSupabase.select.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Transaction.getAllTransactions();

      expect(mockSupabase.from.calledWith('transactions')).to.be.true;
      expect(mockSupabase.select.calledWith('*')).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando Supabase falla', async () => {
      const mockError = new Error('Database error');
      mockSupabase.select.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Transaction.getAllTransactions();
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getTransactionById', () => {
    it('debe retornar una transacción por ID exitosamente', async () => {
      const mockData = { 
        id: 1, 
        buyer_id: 1, 
        seller_id: 2, 
        book_id: 1, 
        amount: 29.99, 
        status: 'completed',
        created_at: '2024-01-01T00:00:00Z'
      };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Transaction.getTransactionById(1);

      expect(mockSupabase.from.calledWith('transactions')).to.be.true;
      expect(mockSupabase.select.calledWith('*')).to.be.true;
      expect(mockSupabase.eq.calledWith('id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando la transacción no existe', async () => {
      const mockError = new Error('Transaction not found');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Transaction.getTransactionById(999);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('createTransaction', () => {
    it('debe crear una transacción exitosamente', async () => {
      const transactionData = { 
        buyer_id: 1, 
        seller_id: 2, 
        book_id: 1, 
        amount: 29.99, 
        status: 'pending' 
      };
      const mockData = { id: 1, ...transactionData };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Transaction.createTransaction(transactionData);

      expect(mockSupabase.from.calledWith('transactions')).to.be.true;
      expect(mockSupabase.insert.calledWith([transactionData])).to.be.true;
      expect(mockSupabase.select.called).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la creación', async () => {
      const transactionData = { 
        buyer_id: null, 
        seller_id: 2, 
        book_id: 1, 
        amount: 29.99 
      };
      const mockError = new Error('Validation error');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Transaction.createTransaction(transactionData);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('updateTransaction', () => {
    it('debe actualizar una transacción exitosamente', async () => {
      const updates = { status: 'completed', completed_at: '2024-01-01T12:00:00Z' };
      const mockData = { 
        id: 1, 
        buyer_id: 1, 
        seller_id: 2, 
        book_id: 1, 
        amount: 29.99, 
        ...updates 
      };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Transaction.updateTransaction(1, updates);

      expect(mockSupabase.from.calledWith('transactions')).to.be.true;
      expect(mockSupabase.update.calledWith(updates)).to.be.true;
      expect(mockSupabase.eq.calledWith('id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la actualización', async () => {
      const updates = { status: 'failed' };
      const mockError = new Error('Update error');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Transaction.updateTransaction(1, updates);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('deleteTransaction', () => {
    it('debe eliminar una transacción exitosamente', async () => {
      mockSupabase.delete.returns(Promise.resolve({ error: null }));

      const result = await Transaction.deleteTransaction(1);

      expect(mockSupabase.from.calledWith('transactions')).to.be.true;
      expect(mockSupabase.delete.called).to.be.true;
      expect(mockSupabase.eq.calledWith('id', 1)).to.be.true;
      expect(result).to.deep.equal({ success: true });
    });

    it('debe lanzar error cuando falla la eliminación', async () => {
      const mockError = new Error('Delete error');
      mockSupabase.delete.returns(Promise.resolve({ error: mockError }));

      try {
        await Transaction.deleteTransaction(1);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });
}); 
