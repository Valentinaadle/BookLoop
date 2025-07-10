const { expect } = require('chai');
const {
  calculateDiscount,
  isBookAvailable,
  getBookCondition
} = require('./utils');

describe('Lógica de Negocio', () => {
  describe('calculateDiscount', () => {
    it('debe calcular descuentos correctamente', () => {
      expect(calculateDiscount(100, 10)).to.equal(90);
      expect(calculateDiscount(50, 20)).to.equal(40);
      expect(calculateDiscount(25.99, 15)).to.be.closeTo(22.0915, 0.001);
    });

    it('debe manejar descuentos del 0%', () => {
      expect(calculateDiscount(100, 0)).to.equal(100);
    });

    it('debe manejar descuentos del 100%', () => {
      expect(calculateDiscount(100, 100)).to.equal(0);
    });

    it('debe rechazar descuentos negativos', () => {
      expect(calculateDiscount(100, -10)).to.be.null;
    });

    it('debe rechazar descuentos mayores al 100%', () => {
      expect(calculateDiscount(100, 110)).to.be.null;
    });

    it('debe rechazar precios inválidos', () => {
      expect(calculateDiscount(-10, 20)).to.be.null;
      expect(calculateDiscount(0, 20)).to.be.null;
      expect(calculateDiscount('abc', 20)).to.be.null;
    });

    it('debe rechazar descuentos inválidos', () => {
      expect(calculateDiscount(100, 'abc')).to.be.null;
      expect(calculateDiscount(100, null)).to.be.null;
      expect(calculateDiscount(100, undefined)).to.be.null;
    });

    it('debe manejar strings válidos', () => {
      expect(calculateDiscount('100', '10')).to.equal(90);
      expect(calculateDiscount('50.5', '20')).to.be.closeTo(40.4, 0.001);
    });
  });

  describe('isBookAvailable', () => {
    it('debe retornar true para libros disponibles', () => {
      expect(isBookAvailable({ available: true })).to.be.true;
      expect(isBookAvailable({ available: 'true' })).to.be.true;
      expect(isBookAvailable({ available: 1 })).to.be.true;
    });

    it('debe retornar false para libros no disponibles', () => {
      expect(isBookAvailable({ available: false })).to.be.false;
      expect(isBookAvailable({ available: 'false' })).to.be.false;
      expect(isBookAvailable({ available: 0 })).to.be.false;
      expect(isBookAvailable({ available: null })).to.be.false;
      expect(isBookAvailable({ available: undefined })).to.be.false;
    });

    it('debe retornar false para libros sin campo available', () => {
      expect(isBookAvailable({})).to.be.false;
      expect(isBookAvailable({ title: 'Test Book' })).to.be.false;
    });

    it('debe manejar book null o undefined', () => {
      expect(isBookAvailable(null)).to.be.false;
      expect(isBookAvailable(undefined)).to.be.false;
    });

    it('debe manejar tipos de datos incorrectos', () => {
      expect(isBookAvailable('string')).to.be.false;
      expect(isBookAvailable(123)).to.be.false;
      expect(isBookAvailable([])).to.be.false;
    });
  });

  describe('getBookCondition', () => {
    it('debe retornar condiciones válidas', () => {
      expect(getBookCondition('nuevo')).to.equal('nuevo');
      expect(getBookCondition('muy bueno')).to.equal('muy bueno');
      expect(getBookCondition('bueno')).to.equal('bueno');
      expect(getBookCondition('regular')).to.equal('regular');
      expect(getBookCondition('malo')).to.equal('malo');
    });

    it('debe manejar condiciones en mayúsculas', () => {
      expect(getBookCondition('NUEVO')).to.equal('NUEVO');
      expect(getBookCondition('MUY BUENO')).to.equal('MUY BUENO');
      expect(getBookCondition('BUENO')).to.equal('BUENO');
    });

    it('debe manejar condiciones con espacios', () => {
      expect(getBookCondition('  nuevo  ')).to.equal('nuevo');
      expect(getBookCondition('  muy bueno  ')).to.equal('muy bueno');
    });

    it('debe retornar "No especificado" para condiciones inválidas', () => {
      expect(getBookCondition('excelente')).to.equal('No especificado');
      expect(getBookCondition('terrible')).to.equal('No especificado');
      expect(getBookCondition('como nuevo')).to.equal('No especificado');
    });

    it('debe manejar valores null, undefined o vacíos', () => {
      expect(getBookCondition(null)).to.equal('No especificado');
      expect(getBookCondition(undefined)).to.equal('No especificado');
      expect(getBookCondition('')).to.equal('No especificado');
      expect(getBookCondition('   ')).to.equal('No especificado');
    });

    it('debe manejar tipos de datos incorrectos', () => {
      expect(getBookCondition(123)).to.equal('No especificado');
      expect(getBookCondition([])).to.equal('No especificado');
      expect(getBookCondition({})).to.equal('No especificado');
      expect(getBookCondition(true)).to.equal('No especificado');
    });
  });
}); 
