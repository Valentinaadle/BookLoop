const { expect } = require('chai');
const {
  validateEmail,
  validatePrice,
  validateStock,
  validateISBN,
  validateRequiredFields,
  validateBookData
} = require('./utils');

describe('Validaciones', () => {
  describe('validateEmail', () => {
    it('debe validar emails correctos', () => {
      expect(validateEmail('test@example.com')).to.be.true;
      expect(validateEmail('user.name@domain.org')).to.be.true;
      expect(validateEmail('admin@bookloop.com')).to.be.true;
    });

    it('debe rechazar emails inválidos', () => {
      expect(validateEmail('invalid-email')).to.be.false;
      expect(validateEmail('test@')).to.be.false;
      expect(validateEmail('@domain.com')).to.be.false;
      expect(validateEmail('test..test@domain.com')).to.be.false;
    });

    it('debe rechazar valores null, undefined o vacíos', () => {
      expect(validateEmail(null)).to.be.false;
      expect(validateEmail(undefined)).to.be.false;
      expect(validateEmail('')).to.be.false;
      expect(validateEmail(' ')).to.be.false;
    });

    it('debe rechazar tipos de datos incorrectos', () => {
      expect(validateEmail(123)).to.be.false;
      expect(validateEmail([])).to.be.false;
      expect(validateEmail({})).to.be.false;
    });
  });

  describe('validatePrice', () => {
    it('debe validar precios válidos', () => {
      expect(validatePrice(10.5)).to.be.true;
      expect(validatePrice('15.99')).to.be.true;
      expect(validatePrice('100')).to.be.true;
      expect(validatePrice(0.01)).to.be.true;
    });

    it('debe rechazar precios inválidos', () => {
      expect(validatePrice(0)).to.be.false;
      expect(validatePrice(-5)).to.be.false;
      expect(validatePrice('abc')).to.be.false;
      expect(validatePrice('$10')).to.be.false;
    });

    it('debe rechazar valores null, undefined o vacíos', () => {
      expect(validatePrice(null)).to.be.false;
      expect(validatePrice(undefined)).to.be.false;
      expect(validatePrice('')).to.be.false;
    });
  });

  describe('validateStock', () => {
    it('debe validar stock válido', () => {
      expect(validateStock(0)).to.be.true;
      expect(validateStock(5)).to.be.true;
      expect(validateStock('10')).to.be.true;
      expect(validateStock(100)).to.be.true;
    });

    it('debe rechazar stock inválido', () => {
      expect(validateStock(-1)).to.be.false;
      expect(validateStock('abc')).to.be.false;
      expect(validateStock(-5)).to.be.false;
    });

    it('debe rechazar valores null, undefined o vacíos', () => {
      expect(validateStock(null)).to.be.false;
      expect(validateStock(undefined)).to.be.false;
      expect(validateStock('')).to.be.false;
    });
  });

  describe('validateISBN', () => {
    it('debe validar ISBN-10 correctos', () => {
      expect(validateISBN('0123456789')).to.be.true;
      expect(validateISBN('0-123-45678-9')).to.be.true;
    });

    it('debe validar ISBN-13 correctos', () => {
      expect(validateISBN('9780123456789')).to.be.true;
      expect(validateISBN('978-0-123-45678-9')).to.be.true;
    });

    it('debe rechazar ISBN inválidos', () => {
      expect(validateISBN('123')).to.be.false;
      expect(validateISBN('12345678901234')).to.be.false;
      expect(validateISBN('abc1234567')).to.be.false;
    });

    it('debe rechazar valores null, undefined o vacíos', () => {
      expect(validateISBN(null)).to.be.false;
      expect(validateISBN(undefined)).to.be.false;
      expect(validateISBN('')).to.be.false;
    });
  });

  describe('validateRequiredFields', () => {
    it('debe validar campos requeridos completos', () => {
      const fields = {
        title: 'El Quijote',
        authors: ['Miguel de Cervantes'],
        price: 25.99
      };
      expect(validateRequiredFields(fields)).to.be.true;
    });

    it('debe rechazar campos faltantes', () => {
      const fields1 = {
        title: 'El Quijote',
        authors: ['Miguel de Cervantes']
        // price faltante
      };
      expect(validateRequiredFields(fields1)).to.be.false;

      const fields2 = {
        title: '',
        authors: ['Miguel de Cervantes'],
        price: 25.99
      };
      expect(validateRequiredFields(fields2)).to.be.false;
    });

    it('debe rechazar valores null, undefined o vacíos', () => {
      expect(validateRequiredFields(null)).to.be.false;
      expect(validateRequiredFields(undefined)).to.be.false;
      expect(validateRequiredFields({})).to.be.false;
    });
  });

  describe('validateBookData', () => {
    it('debe validar datos de libro completos', () => {
      const bookData = {
        title: 'El Quijote',
        authors: ['Miguel de Cervantes'],
        price: 25.99,
        quantity: 5
      };
      const result = validateBookData(bookData);
      expect(result.valid).to.be.true;
      expect(result.errors).to.have.length(0);
    });

    it('debe retornar errores para datos inválidos', () => {
      const bookData = {
        title: '',
        authors: [],
        price: -5,
        quantity: -1
      };
      const result = validateBookData(bookData);
      expect(result.valid).to.be.false;
      expect(result.errors).to.include('El título es requerido');
      expect(result.errors).to.include('Los autores son requeridos');
      expect(result.errors).to.include('El precio debe ser un número mayor a 0');
      expect(result.errors).to.include('La cantidad debe ser un número mayor o igual a 0');
    });

    it('debe manejar datos null o undefined', () => {
      const result1 = validateBookData(null);
      expect(result1.valid).to.be.false;
      expect(result1.errors).to.include('Datos del libro inválidos');

      const result2 = validateBookData(undefined);
      expect(result2.valid).to.be.false;
      expect(result2.errors).to.include('Datos del libro inválidos');
    });
  });
}); 
