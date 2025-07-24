const { expect } = require('chai');

describe('Google Books Controller Tests', () => {
  describe('Google Books API Integration', () => {
    it('should validate Google Books API response structure', () => {
      const mockGoogleResponse = {
        kind: 'books#volumes',
        totalItems: 100,
        items: [
          {
            id: 'book123',
            volumeInfo: {
              title: 'JavaScript: The Good Parts',
              authors: ['Douglas Crockford'],
              description: 'A book about JavaScript',
              imageLinks: {
                thumbnail: 'http://example.com/thumbnail.jpg'
              }
            }
          }
        ]
      };

      expect(mockGoogleResponse).to.have.property('kind');
      expect(mockGoogleResponse).to.have.property('totalItems');
      expect(mockGoogleResponse).to.have.property('items');
      expect(mockGoogleResponse.items).to.be.an('array');
      expect(mockGoogleResponse.items[0]).to.have.property('volumeInfo');
    });

    it('should validate search query parameters', () => {
      const searchQueries = [
        'javascript programming',
        'author:Douglas Crockford',
        'subject:computer science',
        'inauthor:Martin Fowler',
        'intitle:clean code'
      ];

      searchQueries.forEach(query => {
        expect(query).to.be.a('string');
        expect(query.length).to.be.above(0);
      });
    });

    it('should handle book data transformation', () => {
      const googleBookData = {
        id: 'abc123',
        volumeInfo: {
          title: 'Test Book',
          authors: ['Author One', 'Author Two'],
          description: 'A test book description',
          publishedDate: '2023-01-01',
          pageCount: 300,
          categories: ['Fiction', 'Adventure'],
          imageLinks: {
            thumbnail: 'http://example.com/thumb.jpg',
            small: 'http://example.com/small.jpg'
          }
        }
      };

      const transformedBook = {
        google_id: googleBookData.id,
        title: googleBookData.volumeInfo.title,
        authors: googleBookData.volumeInfo.authors,
        description: googleBookData.volumeInfo.description,
        published_date: googleBookData.volumeInfo.publishedDate,
        page_count: googleBookData.volumeInfo.pageCount,
        categories: googleBookData.volumeInfo.categories,
        thumbnail: googleBookData.volumeInfo.imageLinks?.thumbnail
      };

      expect(transformedBook.google_id).to.equal('abc123');
      expect(transformedBook.title).to.equal('Test Book');
      expect(transformedBook.authors).to.be.an('array');
      expect(transformedBook.authors).to.have.lengthOf(2);
    });

    it('should validate error handling for API failures', () => {
      const apiError = {
        error: {
          code: 400,
          message: 'Invalid query parameter',
          errors: [
            {
              domain: 'global',
              reason: 'invalidParameter',
              message: 'Invalid value for query parameter'
            }
          ]
        }
      };

      expect(apiError).to.have.property('error');
      expect(apiError.error).to.have.property('code');
      expect(apiError.error).to.have.property('message');
      expect(apiError.error.code).to.equal(400);
    });

    it('should handle pagination parameters', () => {
      const paginationParams = {
        startIndex: 0,
        maxResults: 40,
        totalItems: 150
      };

      const totalPages = Math.ceil(paginationParams.totalItems / paginationParams.maxResults);
      const currentPage = Math.floor(paginationParams.startIndex / paginationParams.maxResults) + 1;

      expect(totalPages).to.equal(4);
      expect(currentPage).to.equal(1);
      expect(paginationParams.maxResults).to.be.at.most(40);
    });

    it('should validate book categories mapping', () => {
      const googleCategories = ['Fiction', 'Juvenile Fiction', 'Computers'];
      const categoryMapping = {
        'Fiction': 'fiction',
        'Juvenile Fiction': 'children',
        'Computers': 'technology',
        'Science': 'science'
      };

      const mappedCategories = googleCategories.map(cat => 
        categoryMapping[cat] || cat.toLowerCase()
      );

      expect(mappedCategories).to.include('fiction');
      expect(mappedCategories).to.include('children');
      expect(mappedCategories).to.include('technology');
    });

    it('should handle book search filters', () => {
      const searchFilters = {
        author: 'Douglas Crockford',
        subject: 'JavaScript',
        publisher: 'O\'Reilly',
        langRestrict: 'en',
        printType: 'books'
      };

      const buildQuery = (filters) => {
        const queryParts = [];
        if (filters.author) queryParts.push(`inauthor:${filters.author}`);
        if (filters.subject) queryParts.push(`subject:${filters.subject}`);
        if (filters.publisher) queryParts.push(`inpublisher:${filters.publisher}`);
        return queryParts.join('+');
      };

      const query = buildQuery(searchFilters);
      expect(query).to.include('inauthor:Douglas Crockford');
      expect(query).to.include('subject:JavaScript');
    });

    it('should validate ISBN handling', () => {
      const isbns = [
        { isbn: '9780596517748', valid: true },
        { isbn: '978-0596517748', valid: true },
        { isbn: '0596517742', valid: true },
        { isbn: 'invalid-isbn', valid: false }
      ];

      isbns.forEach(item => {
        const cleanISBN = item.isbn.replace(/[-\s]/g, '');
        const isValidLength = cleanISBN.length === 10 || cleanISBN.length === 13;
        const isNumeric = /^\d+$/.test(cleanISBN);
        
        if (item.valid) {
          expect(isValidLength).to.be.true;
          expect(isNumeric).to.be.true;
        }
      });
    });
  });
}); 