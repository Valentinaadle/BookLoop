const { expect } = require('chai');
const sinon = require('sinon');

describe('Solicitud Model', () => {
  let mockSupabase;
  let Solicitud;

  beforeEach(() => {
    // Mock Supabase
    mockSupabase = {
      from: sinon.stub().returnsThis(),
      select: sinon.stub().returnsThis(),
      eq: sinon.stub().returnsThis(),
      single: sinon.stub().returnsThis(),
      insert: sinon.stub().returnsThis(),
      order: sinon.stub().returnsThis()
    };

    // Mock require para Supabase
    delete require.cache[require.resolve('../src/models/Solicitud')];
    require.cache[require.resolve('../src/config/db')] = {
      exports: mockSupabase
    };
    
    Solicitud = require('../src/models/Solicitud');
  });

  afterEach(() => {
    sinon.restore();
    delete require.cache[require.resolve('../src/models/Solicitud')];
    delete require.cache[require.resolve('../src/config/db')];
  });

  describe('createSolicitud', () => {
    it('debe crear una solicitud exitosamente', async () => {
      const solicitudData = { book_id: 1, seller_id: 2, buyer_id: 3 };
      const mockData = { id: 1, ...solicitudData, created_at: '2024-01-01T00:00:00Z' };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Solicitud.createSolicitud(solicitudData);

      expect(mockSupabase.from.calledWith('solicitudes')).to.be.true;
      expect(mockSupabase.insert.calledWith([{
        book_id: 1,
        seller_id: 2,
        buyer_id: 3
      }])).to.be.true;
      expect(mockSupabase.select.called).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la creación', async () => {
      const solicitudData = { book_id: 1, seller_id: 2, buyer_id: 3 };
      const mockError = new Error('Validation error');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Solicitud.createSolicitud(solicitudData);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });

    it('debe manejar parámetros faltantes', async () => {
      const solicitudData = { book_id: 1, seller_id: 2 }; // buyer_id faltante
      const mockError = new Error('Missing required field');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Solicitud.createSolicitud(solicitudData);
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
          seller_id: 2,
          buyer_id: 3,
          book_id: 1,
          books: { id: 1, title: 'Libro 1', status: 'disponible' },
          users: { id: 3, nombre: 'Comprador', email: 'buyer@test.com' }
        },
        {
          id: 2,
          seller_id: 2,
          buyer_id: 4,
          book_id: 2,
          books: { id: 2, title: 'Libro 2', status: 'disponible' },
          users: { id: 4, nombre: 'Otro Comprador', email: 'buyer2@test.com' }
        }
      ];
      
      mockSupabase.order.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Solicitud.getSolicitudesBySeller(2);

      expect(mockSupabase.from.calledWith('solicitudes')).to.be.true;
      expect(mockSupabase.select.calledWith('*, books(*), users!buyer_id(*)')).to.be.true;
      expect(mockSupabase.eq.calledWith('seller_id', 2)).to.be.true;
      expect(mockSupabase.order.calledWith('created_at', { ascending: false })).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe filtrar solicitudes con libros vendidos', async () => {
      const mockData = [
        {
          id: 1,
          seller_id: 2,
          buyer_id: 3,
          book_id: 1,
          books: { id: 1, title: 'Libro Disponible', status: 'disponible' },
          users: { id: 3, nombre: 'Comprador', email: 'buyer@test.com' }
        },
        {
          id: 2,
          seller_id: 2,
          buyer_id: 4,
          book_id: 2,
          books: { id: 2, title: 'Libro Vendido', status: 'vendido' },
          users: { id: 4, nombre: 'Otro Comprador', email: 'buyer2@test.com' }
        }
      ];
      
      mockSupabase.order.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Solicitud.getSolicitudesBySeller(2);

      // Solo debe retornar la solicitud del libro disponible
      expect(result).to.have.length(1);
      expect(result[0].books.status).to.equal('disponible');
      expect(result[0].books.title).to.equal('Libro Disponible');
    });

    it('debe retornar array vacío cuando no hay solicitudes', async () => {
      mockSupabase.order.returns(Promise.resolve({ data: [], error: null }));

      const result = await Solicitud.getSolicitudesBySeller(999);

      expect(result).to.deep.equal([]);
    });

    it('debe retornar array vacío cuando data es null', async () => {
      mockSupabase.order.returns(Promise.resolve({ data: null, error: null }));

      const result = await Solicitud.getSolicitudesBySeller(999);

      expect(result).to.deep.equal([]);
    });

    it('debe manejar solicitudes sin libros asociados', async () => {
      const mockData = [
        {
          id: 1,
          seller_id: 2,
          buyer_id: 3,
          book_id: 1,
          books: null, // Libro no encontrado
          users: { id: 3, nombre: 'Comprador', email: 'buyer@test.com' }
        }
      ];
      
      mockSupabase.order.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Solicitud.getSolicitudesBySeller(2);

      // Debe incluir solicitudes con books null ya que no están "vendidos"
      expect(result).to.have.length(1);
      expect(result[0].books).to.be.null;
    });

    it('debe lanzar error cuando Supabase falla', async () => {
      const mockError = new Error('Database error');
      mockSupabase.order.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Solicitud.getSolicitudesBySeller(2);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });
}); 
