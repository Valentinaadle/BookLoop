const { expect } = require('chai');
const sinon = require('sinon');

describe('Image Model', () => {
  let mockSupabase;
  let Image;

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
    delete require.cache[require.resolve('../src/models/Image')];
    require.cache[require.resolve('../src/config/db')] = {
      exports: mockSupabase
    };
    
    Image = require('../src/models/Image');
  });

  afterEach(() => {
    sinon.restore();
    delete require.cache[require.resolve('../src/models/Image')];
    delete require.cache[require.resolve('../src/config/db')];
  });

  describe('getAllImages', () => {
    it('debe retornar todas las imágenes exitosamente', async () => {
      const mockData = [
        { image_id: 1, image_url: 'https://example.com/image1.jpg', book_id: 1 },
        { image_id: 2, image_url: 'https://example.com/image2.jpg', book_id: 2 }
      ];
      mockSupabase.select.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Image.getAllImages();

      expect(mockSupabase.from.calledWith('images')).to.be.true;
      expect(mockSupabase.select.calledWith('*')).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando Supabase falla', async () => {
      const mockError = new Error('Database error');
      mockSupabase.select.returns(Promise.resolve({ data: null, error: mockError }));

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
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Image.getImageById(1);

      expect(mockSupabase.from.calledWith('images')).to.be.true;
      expect(mockSupabase.select.calledWith('*')).to.be.true;
      expect(mockSupabase.eq.calledWith('image_id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando la imagen no existe', async () => {
      const mockError = new Error('Image not found');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

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
      const imageData = { image_url: 'https://example.com/newimage.jpg', book_id: 1 };
      const mockData = { image_id: 1, ...imageData };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Image.createImage(imageData);

      expect(mockSupabase.from.calledWith('images')).to.be.true;
      expect(mockSupabase.insert.calledWith([imageData])).to.be.true;
      expect(mockSupabase.select.called).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la creación', async () => {
      const imageData = { image_url: 'invalid-url', book_id: null };
      const mockError = new Error('Validation error');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

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
      const updates = { image_url: 'https://example.com/updated.jpg' };
      const mockData = { image_id: 1, book_id: 1, ...updates };
      mockSupabase.single.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Image.updateImage(1, updates);

      expect(mockSupabase.from.calledWith('images')).to.be.true;
      expect(mockSupabase.update.calledWith(updates)).to.be.true;
      expect(mockSupabase.eq.calledWith('image_id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe lanzar error cuando falla la actualización', async () => {
      const updates = { image_url: 'https://example.com/updated.jpg' };
      const mockError = new Error('Update error');
      mockSupabase.single.returns(Promise.resolve({ data: null, error: mockError }));

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
      mockSupabase.delete.returns(Promise.resolve({ error: null }));

      const result = await Image.deleteImage(1);

      expect(mockSupabase.from.calledWith('images')).to.be.true;
      expect(mockSupabase.delete.called).to.be.true;
      expect(mockSupabase.eq.calledWith('image_id', 1)).to.be.true;
      expect(result).to.deep.equal({ success: true });
    });

    it('debe lanzar error cuando falla la eliminación', async () => {
      const mockError = new Error('Delete error');
      mockSupabase.delete.returns(Promise.resolve({ error: mockError }));

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
        { image_id: 1, image_url: 'https://example.com/book1_img1.jpg', book_id: 1 },
        { image_id: 2, image_url: 'https://example.com/book1_img2.jpg', book_id: 1 }
      ];
      mockSupabase.eq.returns(Promise.resolve({ data: mockData, error: null }));

      const result = await Image.getImagesByBook(1);

      expect(mockSupabase.from.calledWith('images')).to.be.true;
      expect(mockSupabase.select.calledWith('*')).to.be.true;
      expect(mockSupabase.eq.calledWith('book_id', 1)).to.be.true;
      expect(result).to.deep.equal(mockData);
    });

    it('debe retornar array vacío cuando el libro no tiene imágenes', async () => {
      mockSupabase.eq.returns(Promise.resolve({ data: [], error: null }));

      const result = await Image.getImagesByBook(999);

      expect(result).to.deep.equal([]);
    });

    it('debe lanzar error cuando falla la consulta', async () => {
      const mockError = new Error('Query error');
      mockSupabase.eq.returns(Promise.resolve({ data: null, error: mockError }));

      try {
        await Image.getImagesByBook(1);
        expect.fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });
}); 
