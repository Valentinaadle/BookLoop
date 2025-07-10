const { expect } = require('chai');

describe('Funciones de Arrays y Strings', () => {
  
  // Función para normalizar arrays de autores
  function normalizeAuthors(authors) {
    if (!authors) return [];
    
    if (typeof authors === 'string') {
      try {
        const parsed = JSON.parse(authors);
        if (Array.isArray(parsed)) {
          return parsed.flat(Infinity).filter(Boolean);
        }
        return [authors];
      } catch {
        return authors.split(',').map(a => a.trim()).filter(Boolean);
      }
    }
    
    if (Array.isArray(authors)) {
      return authors.flat(Infinity).filter(Boolean);
    }
    
    return [];
  }

  // Función para validar longitud de strings
  function validateStringLength(str, minLength, maxLength) {
    if (!str || typeof str !== 'string') {
      return false;
    }
    
    const length = str.trim().length;
    return length >= minLength && length <= maxLength;
  }

  // Función para limpiar HTML tags
  function stripHtmlTags(html) {
    if (!html || typeof html !== 'string') {
      return '';
    }
    
    return html.replace(/<[^>]*>/g, '').trim();
  }

  // Función para generar slug
  function generateSlug(text) {
    if (!text || typeof text !== 'string') {
      return '';
    }
    
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Función para contar palabras
  function countWords(text) {
    if (!text || typeof text !== 'string') {
      return 0;
    }
    
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  describe('normalizeAuthors', () => {
    it('debe normalizar arrays de autores correctamente', () => {
      expect(normalizeAuthors(['García Márquez', 'Borges'])).to.deep.equal(['García Márquez', 'Borges']);
      expect(normalizeAuthors(['Miguel de Cervantes'])).to.deep.equal(['Miguel de Cervantes']);
    });

    it('debe manejar arrays anidados', () => {
      expect(normalizeAuthors([['García Márquez'], ['Borges']])).to.deep.equal(['García Márquez', 'Borges']);
      expect(normalizeAuthors([[['Nested Author']]])).to.deep.equal(['Nested Author']);
    });

    it('debe filtrar valores vacíos', () => {
      expect(normalizeAuthors(['García Márquez', '', 'Borges'])).to.deep.equal(['García Márquez', 'Borges']);
      expect(normalizeAuthors(['', null, 'Único autor'])).to.deep.equal(['Único autor']);
    });

    it('debe parsear JSON strings válidos', () => {
      expect(normalizeAuthors('["García Márquez", "Borges"]')).to.deep.equal(['García Márquez', 'Borges']);
      expect(normalizeAuthors('["Miguel de Cervantes"]')).to.deep.equal(['Miguel de Cervantes']);
    });

    it('debe dividir strings por comas', () => {
      expect(normalizeAuthors('García Márquez, Borges')).to.deep.equal(['García Márquez', 'Borges']);
      expect(normalizeAuthors('Autor1,Autor2,Autor3')).to.deep.equal(['Autor1', 'Autor2', 'Autor3']);
    });

    it('debe manejar valores null o undefined', () => {
      expect(normalizeAuthors(null)).to.deep.equal([]);
      expect(normalizeAuthors(undefined)).to.deep.equal([]);
    });

    it('debe manejar strings que no son JSON', () => {
      expect(normalizeAuthors('García Márquez')).to.deep.equal(['García Márquez']);
    });
  });

  describe('validateStringLength', () => {
    it('debe validar longitudes correctas', () => {
      expect(validateStringLength('Hello', 1, 10)).to.be.true;
      expect(validateStringLength('Test', 4, 4)).to.be.true;
      expect(validateStringLength('  Valid  ', 1, 10)).to.be.true;
    });

    it('debe rechazar strings muy cortos', () => {
      expect(validateStringLength('Hi', 5, 10)).to.be.false;
      expect(validateStringLength('', 1, 10)).to.be.false;
    });

    it('debe rechazar strings muy largos', () => {
      expect(validateStringLength('This is too long', 1, 10)).to.be.false;
    });

    it('debe manejar valores null o undefined', () => {
      expect(validateStringLength(null, 1, 10)).to.be.false;
      expect(validateStringLength(undefined, 1, 10)).to.be.false;
    });

    it('debe manejar tipos de datos incorrectos', () => {
      expect(validateStringLength(123, 1, 10)).to.be.false;
      expect(validateStringLength([], 1, 10)).to.be.false;
      expect(validateStringLength({}, 1, 10)).to.be.false;
    });
  });

  describe('stripHtmlTags', () => {
    it('debe remover tags HTML simples', () => {
      expect(stripHtmlTags('<p>Hello World</p>')).to.equal('Hello World');
      expect(stripHtmlTags('<div>Content</div>')).to.equal('Content');
      expect(stripHtmlTags('<span>Text</span>')).to.equal('Text');
    });

    it('debe remover tags HTML anidados', () => {
      expect(stripHtmlTags('<div><p>Hello <span>World</span></p></div>')).to.equal('Hello World');
      expect(stripHtmlTags('<h1><strong>Title</strong></h1>')).to.equal('Title');
    });

    it('debe manejar tags auto-cerradas', () => {
      expect(stripHtmlTags('Line 1<br/>Line 2')).to.equal('Line 1Line 2');
      expect(stripHtmlTags('Image: <img src="test.jpg" />')).to.equal('Image:');
    });

    it('debe manejar strings sin HTML', () => {
      expect(stripHtmlTags('Plain text')).to.equal('Plain text');
      expect(stripHtmlTags('No tags here')).to.equal('No tags here');
    });

    it('debe manejar valores null o undefined', () => {
      expect(stripHtmlTags(null)).to.equal('');
      expect(stripHtmlTags(undefined)).to.equal('');
    });

    it('debe manejar tipos de datos incorrectos', () => {
      expect(stripHtmlTags(123)).to.equal('');
      expect(stripHtmlTags([])).to.equal('');
      expect(stripHtmlTags({})).to.equal('');
    });
  });

  describe('generateSlug', () => {
    it('debe generar slugs básicos', () => {
      expect(generateSlug('Hello World')).to.equal('hello-world');
      expect(generateSlug('Test String')).to.equal('test-string');
      expect(generateSlug('Simple Text')).to.equal('simple-text');
    });

    it('debe remover caracteres especiales', () => {
      expect(generateSlug('Hello, World!')).to.equal('hello-world');
      expect(generateSlug('Test@#$%^&*()String')).to.equal('teststring');
      expect(generateSlug('Title: Subtitle')).to.equal('title-subtitle');
    });

    it('debe normalizar espacios múltiples', () => {
      expect(generateSlug('Hello    World')).to.equal('hello-world');
      expect(generateSlug('Multiple   Spaces   Here')).to.equal('multiple-spaces-here');
    });

    it('debe remover guiones al inicio y final', () => {
      expect(generateSlug('-Hello World-')).to.equal('hello-world');
      expect(generateSlug('--Test--')).to.equal('test');
    });

    it('debe manejar valores null o undefined', () => {
      expect(generateSlug(null)).to.equal('');
      expect(generateSlug(undefined)).to.equal('');
    });

    it('debe manejar tipos de datos incorrectos', () => {
      expect(generateSlug(123)).to.equal('');
      expect(generateSlug([])).to.equal('');
      expect(generateSlug({})).to.equal('');
    });
  });

  describe('countWords', () => {
    it('debe contar palabras correctamente', () => {
      expect(countWords('Hello world')).to.equal(2);
      expect(countWords('One two three four')).to.equal(4);
      expect(countWords('Single')).to.equal(1);
    });

    it('debe manejar espacios múltiples', () => {
      expect(countWords('Hello    world')).to.equal(2);
      expect(countWords('One   two   three')).to.equal(3);
    });

    it('debe manejar espacios al inicio y final', () => {
      expect(countWords('  Hello world  ')).to.equal(2);
      expect(countWords('\tOne two\n')).to.equal(2);
    });

    it('debe manejar strings vacíos', () => {
      expect(countWords('')).to.equal(0);
      expect(countWords('   ')).to.equal(0);
    });

    it('debe manejar valores null o undefined', () => {
      expect(countWords(null)).to.equal(0);
      expect(countWords(undefined)).to.equal(0);
    });

    it('debe manejar tipos de datos incorrectos', () => {
      expect(countWords(123)).to.equal(0);
      expect(countWords([])).to.equal(0);
      expect(countWords({})).to.equal(0);
    });
  });
}); 
