const { expect } = require('chai');

describe('Funcionalidades Específicas BookLoop', () => {
  
  // Función para validar estructura de libro
  function validateBookStructure(book) {
    if (!book || typeof book !== 'object') return false;
    
    const requiredFields = ['title', 'authors', 'price'];
    const optionalFields = ['description', 'isbn_code', 'condition', 'imageurl', 'category_id'];
    
    // Verificar campos requeridos
    for (const field of requiredFields) {
      if (!book.hasOwnProperty(field) || !book[field]) {
        return false;
      }
    }
    
    return true;
  }

  // Función para generar código de referencia
  function generateBookReference(title, authors, year) {
    if (!title || !authors) return '';
    
    const titlePart = title.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const authorPart = Array.isArray(authors) ? 
      authors[0].replace(/\s+/g, '').substring(0, 3).toUpperCase() : 
      authors.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const yearPart = year ? year.toString().substring(2, 4) : '00';
    
    return `${titlePart}${authorPart}${yearPart}`;
  }

  // Función para calcular valor promedio de calificaciones
  function calculateAverageRating(ratings) {
    if (!ratings || !Array.isArray(ratings) || ratings.length === 0) {
      return 0;
    }
    
    const validRatings = ratings.filter(rating => 
      typeof rating === 'number' && 
      rating >= 1 && 
      rating <= 5
    );
    
    if (validRatings.length === 0) return 0;
    
    const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
    return Math.round((sum / validRatings.length) * 10) / 10;
  }

  // Función para validar categoría de libro
  function validateBookCategory(categoryId) {
    if (!categoryId) return false;
    
    const validCategories = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, // IDs válidos
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' // Strings válidos
    ];
    
    return validCategories.includes(categoryId);
  }

  // Función para filtrar libros por precio
  function filterBooksByPrice(books, minPrice, maxPrice) {
    if (!books || !Array.isArray(books)) return [];
    
    return books.filter(book => {
      if (!book.price) return false;
      
      const price = parseFloat(book.price);
      if (isNaN(price)) return false;
      
      if (minPrice !== undefined && price < minPrice) return false;
      if (maxPrice !== undefined && price > maxPrice) return false;
      
      return true;
    });
  }

  // Función para buscar libros por texto
  function searchBooksByText(books, searchText) {
    if (!books || !Array.isArray(books) || !searchText) return [];
    
    const lowerSearchText = searchText.toLowerCase();
    
    return books.filter(book => {
      const titleMatch = book.title && book.title.toLowerCase().includes(lowerSearchText);
      
      let authorMatch = false;
      if (book.authors) {
        if (Array.isArray(book.authors)) {
          authorMatch = book.authors.some(author => 
            author.toLowerCase().includes(lowerSearchText)
          );
        } else {
          authorMatch = book.authors.toLowerCase().includes(lowerSearchText);
        }
      }
      
      const descriptionMatch = book.description && 
        book.description.toLowerCase().includes(lowerSearchText);
      
      return titleMatch || authorMatch || descriptionMatch;
    });
  }

  // Función para validar cantidad de stock
  function validateStockUpdate(currentStock, requestedQuantity) {
    if (typeof currentStock !== 'number' || typeof requestedQuantity !== 'number') {
      return false;
    }
    
    if (currentStock < 0 || requestedQuantity < 0) {
      return false;
    }
    
    return currentStock >= requestedQuantity;
  }

  describe('validateBookStructure', () => {
    it('debe validar estructura de libro correcta', () => {
      const book = {
        title: 'El Quijote',
        authors: ['Miguel de Cervantes'],
        price: 25.99,
        description: 'Clásico de la literatura'
      };
      expect(validateBookStructure(book)).to.be.true;
    });

    it('debe rechazar libros sin campos requeridos', () => {
      const book1 = { title: 'Test', authors: ['Author'] }; // falta price
      const book2 = { title: 'Test', price: 25.99 }; // falta authors
      const book3 = { authors: ['Author'], price: 25.99 }; // falta title
      
      expect(validateBookStructure(book1)).to.be.false;
      expect(validateBookStructure(book2)).to.be.false;
      expect(validateBookStructure(book3)).to.be.false;
    });

    it('debe manejar valores null o undefined', () => {
      expect(validateBookStructure(null)).to.be.false;
      expect(validateBookStructure(undefined)).to.be.false;
    });
  });

  describe('generateBookReference', () => {
    it('debe generar referencias correctas', () => {
      expect(generateBookReference('El Quijote', ['Miguel de Cervantes'], 1605)).to.equal('ELQMIG05');
      expect(generateBookReference('1984', ['George Orwell'], 1949)).to.equal('198GEO49');
    });

    it('debe manejar autores como string', () => {
      expect(generateBookReference('Test Book', 'Test Author', 2023)).to.equal('TESTES23');
    });

    it('debe manejar año faltante', () => {
      expect(generateBookReference('Test Book', ['Test Author'])).to.equal('TESTES00');
    });

    it('debe manejar campos faltantes', () => {
      expect(generateBookReference('', ['Test Author'], 2023)).to.equal('');
      expect(generateBookReference('Test Book', '', 2023)).to.equal('');
    });
  });

  describe('calculateAverageRating', () => {
    it('debe calcular promedio correcto', () => {
      expect(calculateAverageRating([5, 4, 3, 4, 5])).to.equal(4.2);
      expect(calculateAverageRating([1, 2, 3, 4, 5])).to.equal(3);
      expect(calculateAverageRating([5, 5, 5])).to.equal(5);
    });

    it('debe filtrar calificaciones inválidas', () => {
      expect(calculateAverageRating([5, 0, 4, 6, 3])).to.equal(4);
      expect(calculateAverageRating([5, 'invalid', 4, null, 3])).to.equal(4);
    });

    it('debe retornar 0 para arrays vacíos', () => {
      expect(calculateAverageRating([])).to.equal(0);
      expect(calculateAverageRating([0, 6, 'invalid'])).to.equal(0);
    });

    it('debe manejar valores null o undefined', () => {
      expect(calculateAverageRating(null)).to.equal(0);
      expect(calculateAverageRating(undefined)).to.equal(0);
    });
  });

  describe('validateBookCategory', () => {
    it('debe validar categorías válidas', () => {
      expect(validateBookCategory(1)).to.be.true;
      expect(validateBookCategory('5')).to.be.true;
      expect(validateBookCategory(10)).to.be.true;
    });

    it('debe rechazar categorías inválidas', () => {
      expect(validateBookCategory(0)).to.be.false;
      expect(validateBookCategory(11)).to.be.false;
      expect(validateBookCategory(-1)).to.be.false;
      expect(validateBookCategory('invalid')).to.be.false;
    });

    it('debe manejar valores null o undefined', () => {
      expect(validateBookCategory(null)).to.be.false;
      expect(validateBookCategory(undefined)).to.be.false;
    });
  });

  describe('filterBooksByPrice', () => {
    const sampleBooks = [
      { title: 'Book 1', price: 10.00 },
      { title: 'Book 2', price: 25.99 },
      { title: 'Book 3', price: 50.00 },
      { title: 'Book 4', price: 'invalid' },
      { title: 'Book 5' } // sin precio
    ];

    it('debe filtrar por precio mínimo', () => {
      const result = filterBooksByPrice(sampleBooks, 20);
      expect(result).to.have.length(2);
      expect(result[0].title).to.equal('Book 2');
      expect(result[1].title).to.equal('Book 3');
    });

    it('debe filtrar por precio máximo', () => {
      const result = filterBooksByPrice(sampleBooks, undefined, 30);
      expect(result).to.have.length(2);
      expect(result[0].title).to.equal('Book 1');
      expect(result[1].title).to.equal('Book 2');
    });

    it('debe filtrar por rango de precios', () => {
      const result = filterBooksByPrice(sampleBooks, 20, 40);
      expect(result).to.have.length(1);
      expect(result[0].title).to.equal('Book 2');
    });

    it('debe manejar arrays vacíos o null', () => {
      expect(filterBooksByPrice([], 10, 50)).to.deep.equal([]);
      expect(filterBooksByPrice(null, 10, 50)).to.deep.equal([]);
    });
  });

  describe('searchBooksByText', () => {
    const sampleBooks = [
      { title: 'El Quijote', authors: ['Miguel de Cervantes'], description: 'Clásico español' },
      { title: '1984', authors: ['George Orwell'], description: 'Distopía futurista' },
      { title: 'Cien años de soledad', authors: ['García Márquez'], description: 'Realismo mágico' },
      { title: 'Harry Potter', authors: ['J.K. Rowling'], description: 'Fantasía juvenil' }
    ];

    it('debe buscar por título', () => {
      const result = searchBooksByText(sampleBooks, 'quijote');
      expect(result).to.have.length(1);
      expect(result[0].title).to.equal('El Quijote');
    });

    it('debe buscar por autor', () => {
      const result = searchBooksByText(sampleBooks, 'orwell');
      expect(result).to.have.length(1);
      expect(result[0].title).to.equal('1984');
    });

    it('debe buscar por descripción', () => {
      const result = searchBooksByText(sampleBooks, 'fantasía');
      expect(result).to.have.length(1);
      expect(result[0].title).to.equal('Harry Potter');
    });

    it('debe ser case-insensitive', () => {
      const result = searchBooksByText(sampleBooks, 'QUIJOTE');
      expect(result).to.have.length(1);
      expect(result[0].title).to.equal('El Quijote');
    });

    it('debe manejar búsquedas vacías', () => {
      expect(searchBooksByText(sampleBooks, '')).to.deep.equal([]);
      expect(searchBooksByText(sampleBooks, null)).to.deep.equal([]);
    });
  });

  describe('validateStockUpdate', () => {
    it('debe validar actualizaciones de stock válidas', () => {
      expect(validateStockUpdate(10, 5)).to.be.true;
      expect(validateStockUpdate(5, 5)).to.be.true;
      expect(validateStockUpdate(10, 0)).to.be.true;
    });

    it('debe rechazar actualizaciones inválidas', () => {
      expect(validateStockUpdate(5, 10)).to.be.false;
      expect(validateStockUpdate(-1, 5)).to.be.false;
      expect(validateStockUpdate(10, -1)).to.be.false;
    });

    it('debe manejar tipos de datos incorrectos', () => {
      expect(validateStockUpdate('10', 5)).to.be.false;
      expect(validateStockUpdate(10, '5')).to.be.false;
      expect(validateStockUpdate(null, 5)).to.be.false;
    });
  });
}); 
