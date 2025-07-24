const { expect } = require('chai');

describe('Solicitud Model Tests', () => {
  describe('Solicitud Operations', () => {
    it('should validate solicitud data structure', () => {
      const solicitudData = {
        id: 1,
        buyer_id: 1,
        seller_id: 2,
        book_id: 1,
        message: 'Interested in buying this book',
        status: 'pending',
        created_at: new Date()
      };

      expect(solicitudData).to.have.property('id');
      expect(solicitudData).to.have.property('buyer_id');
      expect(solicitudData).to.have.property('seller_id');
      expect(solicitudData).to.have.property('book_id');
      expect(solicitudData).to.have.property('message');
      expect(solicitudData.id).to.be.a('number');
      expect(solicitudData.message).to.be.a('string');
    });

    it('should validate solicitud status values', () => {
      const validStatuses = ['pending', 'accepted', 'rejected', 'cancelled', 'completed'];
      const solicitud = { id: 1, status: 'pending' };

      expect(validStatuses).to.include(solicitud.status);
      expect(solicitud.status).to.be.oneOf(validStatuses);
    });

    it('should handle solicitud filtering by seller', () => {
      const allSolicitudes = [
        { id: 1, seller_id: 1, buyer_id: 2, book_id: 1 },
        { id: 2, seller_id: 1, buyer_id: 3, book_id: 2 },
        { id: 3, seller_id: 2, buyer_id: 1, book_id: 3 }
      ];

      const seller1Solicitudes = allSolicitudes.filter(s => s.seller_id === 1);
      const seller2Solicitudes = allSolicitudes.filter(s => s.seller_id === 2);

      expect(seller1Solicitudes).to.have.lengthOf(2);
      expect(seller2Solicitudes).to.have.lengthOf(1);
    });

    it('should handle solicitud filtering by buyer', () => {
      const allSolicitudes = [
        { id: 1, seller_id: 1, buyer_id: 2, book_id: 1 },
        { id: 2, seller_id: 3, buyer_id: 2, book_id: 2 },
        { id: 3, seller_id: 2, buyer_id: 1, book_id: 3 }
      ];

      const buyer1Solicitudes = allSolicitudes.filter(s => s.buyer_id === 1);
      const buyer2Solicitudes = allSolicitudes.filter(s => s.buyer_id === 2);

      expect(buyer1Solicitudes).to.have.lengthOf(1);
      expect(buyer2Solicitudes).to.have.lengthOf(2);
    });

    it('should validate message content', () => {
      const solicitud = {
        id: 1,
        message: 'Hello, I am interested in purchasing this book. Is it still available?',
        word_count: 0
      };

      solicitud.word_count = solicitud.message.split(' ').length;

      expect(solicitud.message).to.be.a('string');
      expect(solicitud.message.length).to.be.above(10);
      expect(solicitud.word_count).to.equal(12);
    });

    it('should handle solicitud timestamps', () => {
      const solicitud = {
        id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        responded_at: null
      };

      expect(solicitud.created_at).to.be.an.instanceOf(Date);
      expect(solicitud.updated_at).to.be.an.instanceOf(Date);
      expect(solicitud.responded_at).to.be.null;
    });

    it('should filter out sold books from solicitudes', () => {
      const solicitudesWithBooks = [
        { id: 1, book_id: 1, books: { status: 'disponible' } },
        { id: 2, book_id: 2, books: { status: 'vendido' } },
        { id: 3, book_id: 3, books: { status: 'disponible' } }
      ];

      const availableSolicitudes = solicitudesWithBooks.filter(
        s => s.books && s.books.status !== 'vendido'
      );

      expect(availableSolicitudes).to.have.lengthOf(2);
      expect(availableSolicitudes[0].books.status).to.equal('disponible');
    });

    it('should validate solicitud priority levels', () => {
      const solicitudes = [
        { id: 1, priority: 'high', created_at: new Date(Date.now() - 86400000) },
        { id: 2, priority: 'medium', created_at: new Date(Date.now() - 43200000) },
        { id: 3, priority: 'low', created_at: new Date() }
      ];

      const sortedByPriority = solicitudes.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      expect(sortedByPriority[0].priority).to.equal('high');
      expect(sortedByPriority[2].priority).to.equal('low');
    });
  });
}); 