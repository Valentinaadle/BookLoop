const { expect } = require('chai');

describe('Transaction Model', () => {
  let Transaction;
  let mockSupabase;

  beforeEach(() => {
    // Usar el mock global de Supabase
    mockSupabase = global.mockSupabaseClient;
    
    // Limpiar el cache y cargar el modelo
    delete require.cache[require.resolve('../src/models/Transaction')];
    Transaction = require('../src/models/Transaction');
  });

  afterEach(() => {
    // Limpiar mocks
    jest.clearAllMocks();
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
          amount: 19.99, 
          status: 'pending' 
        }
      ];

      // Configurar el mock para devolver datos
      mockSupabase.select.mockResolvedValue({ data: mockData, error: null });

      const result = await Transaction.getAllTransactions();

      // Verificar que las funciones fueron llamadas correctamente
      expect(mockSupabase.from.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.from.mock.calls[0][0]).to.equal('transactions');
      expect(mockSupabase.select.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.select.mock.calls[0][0]).to.equal('*');
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando Supabase falla', async () => {
      const mockError = new Error('Database error');
      mockSupabase.select.mockResolvedValue({ data: null, error: mockError });

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
        status: 'completed' 
      };

      mockSupabase.single.mockResolvedValue({ data: mockData, error: null });

      const result = await Transaction.getTransactionById(1);

      expect(mockSupabase.from.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.from.mock.calls[0][0]).to.equal('transactions');
      expect(mockSupabase.eq.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.eq.mock.calls[0]).to.deep.equal(['id', 1]);
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando la transacción no existe', async () => {
      const mockError = new Error('Transaction not found');
      mockSupabase.single.mockResolvedValue({ data: null, error: mockError });

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
      mockSupabase.single.mockResolvedValue({ data: mockData, error: null });

      const result = await Transaction.createTransaction(transactionData);

      expect(mockSupabase.from.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.from.mock.calls[0][0]).to.equal('transactions');
      expect(mockSupabase.insert.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.insert.mock.calls[0][0]).to.deep.equal([transactionData]);
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la creación', async () => {
      const transactionData = { invalid: 'data' };
      const mockError = new Error('Validation error');
      mockSupabase.single.mockResolvedValue({ data: null, error: mockError });

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
      const updates = { status: 'completed' };
      const mockData = { id: 1, status: 'completed' };
      mockSupabase.single.mockResolvedValue({ data: mockData, error: null });

      const result = await Transaction.updateTransaction(1, updates);

      expect(mockSupabase.from.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.from.mock.calls[0][0]).to.equal('transactions');
      expect(mockSupabase.update.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.update.mock.calls[0][0]).to.deep.equal(updates);
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la actualización', async () => {
      const updates = { status: 'completed' };
      const mockError = new Error('Update error');
      mockSupabase.single.mockResolvedValue({ data: null, error: mockError });

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
      // Configurar el mock para que eq retorne la promesa correcta
      mockSupabase.eq.mockResolvedValue({ error: null });

      const result = await Transaction.deleteTransaction(1);

      expect(mockSupabase.from.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.from.mock.calls[0][0]).to.equal('transactions');
      expect(mockSupabase.delete.mock.calls.length).to.be.greaterThan(0);
      expect(result).to.deep.equal({ success: true });
    });

    it('debe lanzar error cuando falla la eliminación', async () => {
      const mockError = new Error('Delete error');
      mockSupabase.eq.mockResolvedValue({ error: mockError });

      try {
        await Transaction.deleteTransaction(1);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });
}); 
