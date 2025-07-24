const { expect } = require('chai');

describe('Image Model', () => {
  let Image;
  let mockSupabase;

  beforeEach(() => {
    // Usar el mock global de Supabase
    mockSupabase = global.mockSupabaseClient;
    
    // Limpiar el cache y cargar el modelo
    delete require.cache[require.resolve('../src/models/Image')];
    Image = require('../src/models/Image');
  });

  afterEach(() => {
    // Limpiar mocks
    jest.clearAllMocks();
  });

  describe('getAllImages', () => {
    it('debe retornar todas las imágenes exitosamente', async () => {
      const mockData = [
        { image_id: 1, image_url: 'https://example.com/image1.jpg', book_id: 1 },
        { image_id: 2, image_url: 'https://example.com/image2.jpg', book_id: 2 }
      ];
      mockSupabase.select.mockResolvedValue({ data: mockData, error: null });

      const result = await Image.getAllImages();

      expect(mockSupabase.from.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.from.mock.calls[0][0]).to.equal('images');
      expect(mockSupabase.select.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.select.mock.calls[0][0]).to.equal('*');
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando Supabase falla', async () => {
      const mockError = new Error('Database error');
      mockSupabase.select.mockResolvedValue({ data: null, error: mockError });

      try {
        await Image.getAllImages();
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getImageById', () => {
    it('debe retornar una imagen por ID exitosamente', async () => {
      const mockData = { image_id: 1, image_url: 'https://example.com/image1.jpg', book_id: 1 };
      mockSupabase.single.mockResolvedValue({ data: mockData, error: null });

      const result = await Image.getImageById(1);

      expect(mockSupabase.from.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.from.mock.calls[0][0]).to.equal('images');
      expect(mockSupabase.eq.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.eq.mock.calls[0]).to.deep.equal(['image_id', 1]);
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando la imagen no existe', async () => {
      const mockError = new Error('Image not found');
      mockSupabase.single.mockResolvedValue({ data: null, error: mockError });

      try {
        await Image.getImageById(999);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('createImage', () => {
    it('debe crear una imagen exitosamente', async () => {
      const imageData = { image_url: 'https://example.com/new-image.jpg', book_id: 1 };
      const mockData = { image_id: 3, ...imageData };
      mockSupabase.single.mockResolvedValue({ data: mockData, error: null });

      const result = await Image.createImage(imageData);

      expect(mockSupabase.from.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.from.mock.calls[0][0]).to.equal('images');
      expect(mockSupabase.insert.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.insert.mock.calls[0][0]).to.deep.equal([imageData]);
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la creación', async () => {
      const imageData = { invalid: 'data' };
      const mockError = new Error('Validation error');
      mockSupabase.single.mockResolvedValue({ data: null, error: mockError });

      try {
        await Image.createImage(imageData);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('updateImage', () => {
    it('debe actualizar una imagen exitosamente', async () => {
      const updates = { image_url: 'https://example.com/updated-image.jpg' };
      const mockData = { image_id: 1, ...updates, book_id: 1 };
      mockSupabase.single.mockResolvedValue({ data: mockData, error: null });

      const result = await Image.updateImage(1, updates);

      expect(mockSupabase.from.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.from.mock.calls[0][0]).to.equal('images');
      expect(mockSupabase.update.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.update.mock.calls[0][0]).to.deep.equal(updates);
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la actualización', async () => {
      const updates = { image_url: 'https://example.com/updated-image.jpg' };
      const mockError = new Error('Update error');
      mockSupabase.single.mockResolvedValue({ data: null, error: mockError });

      try {
        await Image.updateImage(1, updates);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('deleteImage', () => {
    it('debe eliminar una imagen exitosamente', async () => {
      mockSupabase.eq.mockResolvedValue({ error: null });

      const result = await Image.deleteImage(1);

      expect(mockSupabase.from.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.from.mock.calls[0][0]).to.equal('images');
      expect(mockSupabase.delete.mock.calls.length).to.be.greaterThan(0);
      expect(result).to.deep.equal({ success: true });
    });

    it('debe lanzar error cuando falla la eliminación', async () => {
      const mockError = new Error('Delete error');
      mockSupabase.eq.mockResolvedValue({ error: mockError });

      try {
        await Image.deleteImage(1);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getImagesByBook', () => {
    it('debe retornar imágenes de un libro exitosamente', async () => {
      const mockData = [
        { image_id: 1, image_url: 'https://example.com/image1.jpg', book_id: 1 },
        { image_id: 2, image_url: 'https://example.com/image2.jpg', book_id: 1 }
      ];
      mockSupabase.eq.mockResolvedValue({ data: mockData, error: null });

      const result = await Image.getImagesByBook(1);

      expect(mockSupabase.from.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.from.mock.calls[0][0]).to.equal('images');
      expect(mockSupabase.eq.mock.calls.length).to.be.greaterThan(0);
      expect(mockSupabase.eq.mock.calls[0]).to.deep.equal(['book_id', 1]);
      expect(result).to.deep.equal(mockData);
    });

    it('debe retornar array vacío cuando el libro no tiene imágenes', async () => {
      mockSupabase.eq.mockResolvedValue({ data: [], error: null });

      const result = await Image.getImagesByBook(999);

      expect(result).to.deep.equal([]);
    });

    it('debe lanzar error cuando falla la consulta', async () => {
      const mockError = new Error('Query error');
      mockSupabase.eq.mockResolvedValue({ data: null, error: mockError });

      try {
        await Image.getImagesByBook(1);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });
}); 
