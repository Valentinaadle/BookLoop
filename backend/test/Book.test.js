const { expect } = require('chai');
const sinon = require('sinon');

describe('Book Model', () => {
  let mockSupabase;
  let Book;

  beforeEach(() => {
    // Mock Supabase
    mockSupabase = {
      from: sinon.stub().returnsThis(),
      select: sinon.stub().returnsThis(),
      eq: sinon.stub().returnsThis(),
      neq: sinon.stub().returnsThis(),
      single: sinon.stub().returnsThis(),
      insert: sinon.stub().returnsThis(),
      update: sinon.stub().returnsThis(),
      delete: sinon.stub().returnsThis()
    };

    // Mock require para Supabase
    delete require.cache[require.resolve('../src/models/Book')];
    require.cache[require.resolve('../src/config/db')] = {
      exports: mockSupabase
    };
    
    Book = require('../src/models/Book');
  });

  afterEach(() => {
    sinon.restore();
    delete require.cache[require.resolve('../src/models/Book')];
    delete require.cache[require.resolve('../src/config/db')];
  });

  describe('getAllBooks', () => {
    it('debe retornar todos los libros exitosamente', async () => {
      const mockData = [
        { book_id: 1, title: 'Test Book 1', status: 'disponible' },
        { book_id: 2, title: 'Test Book 2', status: 'disponible' }
      ];
      mockSupabase.neq.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Book.getAllBooks();

      expect(mockSupabase.from.calledWith('books')).to.be.true;
      expect(mockSupabase.select.calledWith('*')).to.be.true;
      expect(mockSupabase.neq.calledWith('status', 'vendido')).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando Supabase falla', async () => {
      const mockError = new Error('Database error');
      mockSupabase.neq.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Book.getAllBooks();
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getBookById', () => {
    it('debe retornar un libro por ID exitosamente', async () => {
      const mockData = { 
        book_id: 1, 
        title: 'Test Book',
        seller: { id: 1, nombre: 'John', apellido: 'Doe' },
        category: { category_id: 1, category_name: 'Fiction' }
      };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Book.getBookById(1);

      expect(mockSupabase.from.calledWith('books')).to.be.true;
      expect(mockSupabase.select.calledWith('*, seller:seller_id(id, nombre, apellido, username, email), category:category_id(category_id, category_name)')).to.be.true;
      expect(mockSupabase.eq.calledWith('book_id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando el libro no existe', async () => {
      const mockError = new Error('Book not found');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Book.getBookById(999);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('createBook', () => {
    it('debe crear un libro exitosamente', async () => {
      const bookData = { title: 'New Book', authors: ['Author'], price: 29.99 };
      const mockData = { book_id: 1, ...bookData };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Book.createBook(bookData);

      expect(mockSupabase.from.calledWith('books')).to.be.true;
      expect(mockSupabase.insert.calledWith([bookData])).to.be.true;
      expect(mockSupabase.select.called).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la creación', async () => {
      const bookData = { title: 'New Book' };
      const mockError = new Error('Validation error');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Book.createBook(bookData);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('updateBook', () => {
    it('debe actualizar un libro exitosamente', async () => {
      const updates = { title: 'Updated Title', price: 35.99 };
      const mockData = { book_id: 1, ...updates };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Book.updateBook(1, updates);

      expect(mockSupabase.from.calledWith('books')).to.be.true;
      expect(mockSupabase.update.calledWith(updates)).to.be.true;
      expect(mockSupabase.eq.calledWith('book_id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la actualización', async () => {
      const updates = { title: 'Updated Title' };
      const mockError = new Error('Update error');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Book.updateBook(1, updates);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('deleteBook', () => {
    it('debe eliminar un libro exitosamente', async () => {
      mockSupabase.delete.returns(Promise.resolve({ error: null }));

      const result = await Book.deleteBook(1);

      expect(mockSupabase.from.calledWith('books')).to.be.true;
      expect(mockSupabase.delete.called).to.be.true;
      expect(mockSupabase.eq.calledWith('book_id', 1)).to.be.true;
      expect(result).to.deep.equal({ success: true });
    });

    it('debe lanzar error cuando falla la eliminación', async () => {
      const mockError = new Error('Delete error');
      mockSupabase.delete.returns(Promise.resolve({ error: mockError }));

      try {
        await Book.deleteBook(1);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getBooksByUser', () => {
    it('debe retornar libros de un usuario exitosamente', async () => {
      const mockData = [
        { book_id: 1, title: 'User Book 1', seller_id: 1 },
        { book_id: 2, title: 'User Book 2', seller_id: 1 }
      ];
      mockSupabase.eq.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Book.getBooksByUser(1);

      expect(mockSupabase.from.calledWith('books')).to.be.true;
      expect(mockSupabase.select.calledWith('*')).to.be.true;
      expect(mockSupabase.eq.calledWith('seller_id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la consulta', async () => {
      const mockError = new Error('Query error');
      mockSupabase.eq.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Book.getBooksByUser(1);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('updateBookCover', () => {
    it('debe actualizar la portada de un libro exitosamente', async () => {
      const coverUrl = 'https://example.com/cover.jpg';
      const mockData = { book_id: 1, coverimageurl: coverUrl };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Book.updateBookCover(1, coverUrl);

      expect(mockSupabase.from.calledWith('books')).to.be.true;
      expect(mockSupabase.update.calledWith({ coverimageurl: coverUrl })).to.be.true;
      expect(mockSupabase.eq.calledWith('book_id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la actualización de portada', async () => {
      const coverUrl = 'https://example.com/cover.jpg';
      const mockError = new Error('Cover update error');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Book.updateBookCover(1, coverUrl);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });
}); 
