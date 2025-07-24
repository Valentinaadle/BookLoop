const { expect } = require('chai');

describe('Solicitud Model', () => {
  let Solicitud;
  let mockSupabase;

  beforeEach(() => {
    // Usar el mock global de Supabase
    mockSupabase = global.mockSupabaseClient;
    
    // Limpiar el cache y cargar el modelo
    delete require.cache[require.resolve('../src/models/Solicitud')];
    Solicitud = require('../src/models/Solicitud');
  });

  afterEach(() => {
    // Limpiar mocks
    jest.clearAllMocks();
  });

  describe('createSolicitud', () => {
    it('debe crear una solicitud exitosamente', async () => {
      const solicitudData = { book_id: 1, seller_id: 2, buyer_id: 3 };
      const mockData = { id: 1, ...solicitudData, created_at: '2024-01-01T00:00:00Z' };
      mockSupabase.single.mockResolvedValue({ data: mockData, error: null });

      const result = await Solicitud.createSolicitud(solicitudData);

      expect(mockSupabase.from.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.from.mock.calls[0][0]).to.equal('solicitudes');
      expect(mockSupabase.insert.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.insert.mock.calls[0][0]).to.deep.equal([{
        book_id: 1,
        seller_id: 2,
        buyer_id: 3
      }]);
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la creación', async () => {
      const solicitudData = { invalid: 'data' };
      const mockError = new Error('Validation error');
      mockSupabase.single.mockResolvedValue({ data: null, error: mockError });

      try {
        await Solicitud.createSolicitud(solicitudData);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });

    it('debe manejar parámetros faltantes', async () => {
      const mockError = new Error('Missing required field');
      mockSupabase.single.mockResolvedValue({ data: null, error: mockError });

      try {
        await Solicitud.createSolicitud({});
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getSolicitudesBySeller', () => {
    it('debe retornar solicitudes de un vendedor exitosamente (sin libros vendidos)', async () => {
      const mockData = [
        {
          id: 1,
          book_id: 1,
          seller_id: 2,
          buyer_id: 3,
          books: { 
            id: 1, 
            title: 'Libro Test', 
            status: 'disponible' 
          },
          users: {
            id: 3,
            name: 'Comprador Test'
          }
        }
      ];
      
      mockSupabase.order.mockResolvedValue({ data: mockData, error: null });

      const result = await Solicitud.getSolicitudesBySeller(2);

      expect(mockSupabase.from.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.from.mock.calls[0][0]).to.equal('solicitudes');
      expect(mockSupabase.select.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.select.mock.calls[0][0]).to.equal('*, books(*), users!buyer_id(*)');
      expect(result).to.have.length(1);
      expect(result[0].books.status).to.equal('disponible');
    });

    it('debe filtrar solicitudes con libros vendidos', async () => {
      const mockDataFromDB = [
        {
          id: 1,
          books: { status: 'disponible', title: 'Libro Disponible' }
        },
        {
          id: 2,
          books: { status: 'vendido', title: 'Libro Vendido' }
        }
      ];
      
      mockSupabase.order.mockResolvedValue({ data: mockDataFromDB, error: null });

      const result = await Solicitud.getSolicitudesBySeller(2);

      // Solo debe retornar la solicitud del libro disponible
      expect(result).to.have.length(1);
      expect(result[0].books.status).to.equal('disponible');
      expect(result[0].books.title).to.equal('Libro Disponible');
    });

    it('debe manejar solicitudes sin libros asociados', async () => {
      const mockDataFromDB = [
        {
          id: 1,
          books: null
        }
      ];
      
      mockSupabase.order.mockResolvedValue({ data: mockDataFromDB, error: null });

      const result = await Solicitud.getSolicitudesBySeller(2);

      // Debe incluir solicitudes con books null ya que no están "vendidos"
      expect(result).to.have.length(1);
      expect(result[0].books).to.be.null;
    });

    it('debe lanzar error cuando Supabase falla', async () => {
      const mockError = new Error('Database error');
      mockSupabase.order.mockResolvedValue({ data: null, error: mockError });

      try {
        await Solicitud.getSolicitudesBySeller(2);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });
}); 
