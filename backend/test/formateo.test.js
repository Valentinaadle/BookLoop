const { expect } = require('chai');
const {
  formatPrice,
  formatAuthor,
  formatBookTitle
} = require('./utils');

describe('Formateo', () => {
  describe('formatPrice', () => {
    it('debe formatear precios válidos correctamente', () => {
      expect(formatPrice(10.5)).to.equal('$10.50');
      expect(formatPrice('15.99')).to.equal('$15.99');
      expect(formatPrice('100')).to.equal('$100.00');
      expect(formatPrice(0.01)).to.equal('$0.01');
    });

    it('debe manejar precios inválidos', () => {
      expect(formatPrice(0)).to.equal('Precio no disponible');
      expect(formatPrice(-5)).to.equal('Precio no disponible');
      expect(formatPrice('abc')).to.equal('Precio no disponible');
      expect(formatPrice(null)).to.equal('Precio no disponible');
      expect(formatPrice(undefined)).to.equal('Precio no disponible');
    });

    it('debe redondear correctamente a dos decimales', () => {
      // JavaScript redondea 10.555 a 10.55 debido a la precisión decimal
      expect(formatPrice(10.555)).to.equal('$10.55');
      expect(formatPrice(10.554)).to.equal('$10.55');
      expect(formatPrice(10)).to.equal('$10.00');
    });
  });

  describe('formatAuthor', () => {
    it('debe formatear arrays de autores', () => {
      expect(formatAuthor(['Miguel de Cervantes'])).to.equal('Miguel de Cervantes');
      expect(formatAuthor(['García Márquez', 'Borges'])).to.equal('García Márquez, Borges');
      expect(formatAuthor(['Autor 1', 'Autor 2', 'Autor 3'])).to.equal('Autor 1, Autor 2, Autor 3');
    });

    it('debe filtrar autores vacíos en arrays', () => {
      expect(formatAuthor(['García Márquez', '', 'Borges'])).to.equal('García Márquez, Borges');
      expect(formatAuthor(['', '  ', 'Único autor'])).to.equal('Único autor');
      expect(formatAuthor(['', '  ', ''])).to.equal('Autor desconocido');
    });

    it('debe manejar strings simples', () => {
      expect(formatAuthor('Miguel de Cervantes')).to.equal('Miguel de Cervantes');
      expect(formatAuthor('  García Márquez  ')).to.equal('García Márquez');
    });

    it('debe parsear JSON strings válidos', () => {
      expect(formatAuthor('["García Márquez", "Borges"]')).to.equal('García Márquez, Borges');
      expect(formatAuthor('["Miguel de Cervantes"]')).to.equal('Miguel de Cervantes');
    });

    it('debe manejar JSON strings inválidos', () => {
      expect(formatAuthor('[invalid json')).to.equal('[invalid json');
      expect(formatAuthor('["unclosed array"')).to.equal('["unclosed array"');
    });

    it('debe manejar valores null, undefined o vacíos', () => {
      expect(formatAuthor(null)).to.equal('Autor desconocido');
      expect(formatAuthor(undefined)).to.equal('Autor desconocido');
      expect(formatAuthor('')).to.equal('Autor desconocido');
      expect(formatAuthor([])).to.equal('Autor desconocido');
    });

    it('debe manejar tipos de datos incorrectos', () => {
      expect(formatAuthor(123)).to.equal('Autor desconocido');
      expect(formatAuthor({})).to.equal('Autor desconocido');
      expect(formatAuthor(true)).to.equal('Autor desconocido');
    });
  });

  describe('formatBookTitle', () => {
    it('debe formatear títulos válidos', () => {
      expect(formatBookTitle('El Quijote')).to.equal('El Quijote');
      expect(formatBookTitle('  Cien años de soledad  ')).to.equal('Cien años de soledad');
      expect(formatBookTitle('1984')).to.equal('1984');
    });

    it('debe manejar títulos inválidos', () => {
      expect(formatBookTitle(null)).to.equal('Título no disponible');
      expect(formatBookTitle(undefined)).to.equal('Título no disponible');
      expect(formatBookTitle('')).to.equal('Título no disponible');
      expect(formatBookTitle('   ')).to.equal('Título no disponible');
    });

    it('debe manejar tipos de datos incorrectos', () => {
      expect(formatBookTitle(123)).to.equal('Título no disponible');
      expect(formatBookTitle([])).to.equal('Título no disponible');
      expect(formatBookTitle({})).to.equal('Título no disponible');
    });

    it('debe limpiar espacios en blanco', () => {
      expect(formatBookTitle('   El Quijote   ')).to.equal('El Quijote');
      expect(formatBookTitle('\t\nCien años de soledad\n\t')).to.equal('Cien años de soledad');
    });
  });
}); 
