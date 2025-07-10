const { expect } = require('chai');
const proxyquire = require('proxyquire');

describe('Models Coverage Tests (Simplified)', () => {
  let mockSupabase;

  beforeEach(() => {
    mockSupabase = {
      from: () => mockSupabase,
      select: () => mockSupabase,
      eq: () => mockSupabase,
      neq: () => mockSupabase,
      single: () => mockSupabase,
      insert: () => mockSupabase,
      update: () => mockSupabase,
      delete: () => mockSupabase,
      order: () => mockSupabase,
      upsert: () => mockSupabase
    };
  });

  describe('Book Model', () => {
    it('getAllBooks - debe manejar caso exitoso', async () => {
      mockSupabase.neq = () => Promise.resolve({ data: [{ book_id: 1, title: 'Test' }], error: null });
      
      const Book = proxyquire('../src/models/Book', {
        '../config/db': mockSupabase
      });

      const result = await Book.getAllBooks();
      expect(result).to.be.an('array');
      expect(result[0]).to.have.property('book_id', 1);
    });

    it('getAllBooks - debe lanzar error cuando Supabase falla', async () => {
      const testError = new Error('Test error');
      mockSupabase.neq = () => Promise.resolve({ data: null, error: testError });
      
      const Book = proxyquire('../src/models/Book', {
        '../config/db': mockSupabase
      });

      try {
        await Book.getAllBooks();
        expect.fail('Debería haber lanzado error');
      } catch (error) {
        expect(error.message).to.equal('Test error');
      }
    });

    it('getBookById - debe retornar libro exitosamente', async () => {
      mockSupabase.single = () => Promise.resolve({ 
        data: { book_id: 1, title: 'Test Book' }, 
        error: null 
      });
      
      const Book = proxyquire('../src/models/Book', {
        '../config/db': mockSupabase
      });

      const result = await Book.getBookById(1);
      expect(result).to.have.property('book_id', 1);
      expect(result).to.have.property('title', 'Test Book');
    });

    it('createBook - debe crear libro exitosamente', async () => {
      mockSupabase.single = () => Promise.resolve({ 
        data: { book_id: 1, title: 'New Book' }, 
        error: null 
      });
      
      const Book = proxyquire('../src/models/Book', {
        '../config/db': mockSupabase
      });

      const result = await Book.createBook({ title: 'New Book' });
      expect(result).to.have.property('book_id', 1);
    });

    it('deleteBook - debe eliminar exitosamente', async () => {
      mockSupabase.delete = () => Promise.resolve({ error: null });
      
      const Book = proxyquire('../src/models/Book', {
        '../config/db': mockSupabase
      });

      const result = await Book.deleteBook(1);
      expect(result).to.deep.equal({ success: true });
    });
  });

  describe('User Model', () => {
    it('getAllUsers - debe retornar usuarios exitosamente', async () => {
      mockSupabase.select = () => Promise.resolve({ 
        data: [{ id: 1, email: 'test@test.com' }], 
        error: null 
      });
      
      const User = proxyquire('../src/models/User', {
        '../config/db': mockSupabase,
        'bcryptjs': {
          hash: () => Promise.resolve('hashedpassword'),
          compare: () => Promise.resolve(true)
        }
      });

      const result = await User.getAllUsers();
      expect(result).to.be.an('array');
      expect(result[0]).to.have.property('id', 1);
    });

    it('getUserByEmail - debe retornar null para array vacío', async () => {
      mockSupabase.eq = () => Promise.resolve({ data: [], error: null });
      
      const User = proxyquire('../src/models/User', {
        '../config/db': mockSupabase,
        'bcryptjs': {
          hash: () => Promise.resolve('hashedpassword'),
          compare: () => Promise.resolve(true)
        }
      });

      const result = await User.getUserByEmail('notfound@test.com');
      expect(result).to.be.null;
    });

    it('getUserByEmail - debe retornar usuario único', async () => {
      mockSupabase.eq = () => Promise.resolve({ 
        data: [{ id: 1, email: 'found@test.com' }], 
        error: null 
      });
      
      const User = proxyquire('../src/models/User', {
        '../config/db': mockSupabase,
        'bcryptjs': {
          hash: () => Promise.resolve('hashedpassword'),
          compare: () => Promise.resolve(true)
        }
      });

      const result = await User.getUserByEmail('found@test.com');
      expect(result).to.have.property('id', 1);
    });

    it('createUser - debe hashear contraseña', async () => {
      mockSupabase.select = () => Promise.resolve({ 
        data: [{ id: 1, email: 'new@test.com', password: 'hashedpass' }], 
        error: null 
      });
      
      const User = proxyquire('../src/models/User', {
        '../config/db': mockSupabase,
        'bcryptjs': {
          hash: (password, rounds) => {
            expect(password).to.equal('plainpass');
            expect(rounds).to.equal(10);
            return Promise.resolve('hashedpass');
          },
          compare: () => Promise.resolve(true)
        }
      });

      const result = await User.createUser({ 
        email: 'new@test.com', 
        password: 'plainpass' 
      });
      expect(result).to.have.property('id', 1);
    });
  });

  describe('Category Model', () => {
    it('seedCategories - debe crear categorías', async () => {
      mockSupabase.upsert = () => Promise.resolve({ error: null });
      
      const Category = proxyquire('../src/models/Category', {
        '../config/db': mockSupabase
      });

      const result = await Category.seedCategories();
      expect(result).to.deep.equal({ success: true });
    });

    it('getAllCategories - debe retornar categorías', async () => {
      mockSupabase.select = () => Promise.resolve({ 
        data: [{ id: 1, name: 'Fiction' }], 
        error: null 
      });
      
      const Category = proxyquire('../src/models/Category', {
        '../config/db': mockSupabase
      });

      const result = await Category.getAllCategories();
      expect(result).to.be.an('array');
      expect(result[0]).to.have.property('name', 'Fiction');
    });
  });

  describe('Image Model', () => {
    it('getImagesByBook - debe retornar imágenes de libro', async () => {
      mockSupabase.eq = () => Promise.resolve({ 
        data: [{ image_id: 1, book_id: 1, image_url: 'test.jpg' }], 
        error: null 
      });
      
      const Image = proxyquire('../src/models/Image', {
        '../config/db': mockSupabase
      });

      const result = await Image.getImagesByBook(1);
      expect(result).to.be.an('array');
      expect(result[0]).to.have.property('image_id', 1);
    });
  });

  describe('Solicitud Model', () => {
    it('getSolicitudesBySeller - debe filtrar libros vendidos', async () => {
      const mockData = [
        {
          id: 1,
          books: { status: 'disponible', title: 'Libro 1' }
        },
        {
          id: 2,
          books: { status: 'vendido', title: 'Libro 2' }
        }
      ];
      
      mockSupabase.order = () => Promise.resolve({ data: mockData, error: null });
      
      const Solicitud = proxyquire('../src/models/Solicitud', {
        '../config/db': mockSupabase
      });

      const result = await Solicitud.getSolicitudesBySeller(1);
      expect(result).to.have.length(1);
      expect(result[0].books.status).to.equal('disponible');
    });
  });
}); 
