const { expect } = require('chai');

describe('Funciones de Fechas', () => {
  
  // Función para validar formato de fecha
  function validateDateFormat(dateString) {
    if (!dateString || typeof dateString !== 'string') {
      return false;
    }
    
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  // Función para formatear fecha
  function formatDate(date, format = 'DD/MM/YYYY') {
    if (!date) return '';
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    
    // Usar UTC para evitar problemas de zona horaria
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const year = dateObj.getUTCFullYear();
    
    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return `${day}/${month}/${year}`;
    }
  }

  // Función para calcular diferencia en días
  function daysDifference(date1, date2) {
    if (!date1 || !date2) return null;
    
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    
    const timeDiff = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }

  // Función para validar edad mínima
  function validateMinAge(birthDate, minAge) {
    if (!birthDate || !minAge) return false;
    
    const birth = new Date(birthDate);
    const today = new Date();
    
    if (isNaN(birth.getTime())) return false;
    
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1 >= minAge;
    }
    
    return age >= minAge;
  }

  // Función para validar fecha de publicación
  function validatePublicationDate(date) {
    if (!date) return false;
    
    const pubDate = new Date(date);
    const today = new Date();
    const oldestBookDate = new Date('1000-01-01');
    
    if (isNaN(pubDate.getTime())) return false;
    
    return pubDate >= oldestBookDate && pubDate <= today;
  }

  describe('validateDateFormat', () => {
    it('debe validar formatos de fecha válidos', () => {
      expect(validateDateFormat('2023-12-25')).to.be.true;
      expect(validateDateFormat('12/25/2023')).to.be.true;
      expect(validateDateFormat('2023-01-01T00:00:00.000Z')).to.be.true;
    });

    it('debe rechazar formatos inválidos', () => {
      expect(validateDateFormat('invalid-date')).to.be.false;
      expect(validateDateFormat('2023-13-01')).to.be.false;
      expect(validateDateFormat('2023-12-32')).to.be.false;
    });

    it('debe manejar valores null o undefined', () => {
      expect(validateDateFormat(null)).to.be.false;
      expect(validateDateFormat(undefined)).to.be.false;
      expect(validateDateFormat('')).to.be.false;
    });

    it('debe manejar tipos de datos incorrectos', () => {
      expect(validateDateFormat(123)).to.be.false;
      expect(validateDateFormat([])).to.be.false;
      expect(validateDateFormat({})).to.be.false;
    });
  });

  describe('formatDate', () => {
    it('debe formatear fecha en formato DD/MM/YYYY por defecto', () => {
      expect(formatDate('2023-12-25')).to.equal('25/12/2023');
      expect(formatDate('2023-01-01')).to.equal('01/01/2023');
    });

    it('debe formatear fecha en formato MM/DD/YYYY', () => {
      expect(formatDate('2023-12-25', 'MM/DD/YYYY')).to.equal('12/25/2023');
      expect(formatDate('2023-01-01', 'MM/DD/YYYY')).to.equal('01/01/2023');
    });

    it('debe formatear fecha en formato YYYY-MM-DD', () => {
      expect(formatDate('2023-12-25', 'YYYY-MM-DD')).to.equal('2023-12-25');
      expect(formatDate('2023-01-01', 'YYYY-MM-DD')).to.equal('2023-01-01');
    });

    it('debe manejar fechas inválidas', () => {
      expect(formatDate('invalid-date')).to.equal('');
      expect(formatDate('2023-13-01')).to.equal('');
    });

    it('debe manejar valores null o undefined', () => {
      expect(formatDate(null)).to.equal('');
      expect(formatDate(undefined)).to.equal('');
    });
  });

  describe('daysDifference', () => {
    it('debe calcular diferencia en días correctamente', () => {
      expect(daysDifference('2023-01-01', '2023-01-02')).to.equal(1);
      expect(daysDifference('2023-01-01', '2023-01-08')).to.equal(7);
      expect(daysDifference('2023-01-01', '2023-02-01')).to.equal(31);
    });

    it('debe manejar orden de fechas', () => {
      expect(daysDifference('2023-01-02', '2023-01-01')).to.equal(1);
      expect(daysDifference('2023-01-08', '2023-01-01')).to.equal(7);
    });

    it('debe manejar la misma fecha', () => {
      expect(daysDifference('2023-01-01', '2023-01-01')).to.equal(0);
    });

    it('debe manejar fechas inválidas', () => {
      expect(daysDifference('invalid-date', '2023-01-01')).to.be.null;
      expect(daysDifference('2023-01-01', 'invalid-date')).to.be.null;
    });

    it('debe manejar valores null o undefined', () => {
      expect(daysDifference(null, '2023-01-01')).to.be.null;
      expect(daysDifference('2023-01-01', undefined)).to.be.null;
    });
  });

  describe('validateMinAge', () => {
    it('debe validar edad mínima correctamente', () => {
      const twentyYearsAgo = new Date();
      twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);
      
      expect(validateMinAge(twentyYearsAgo.toISOString(), 18)).to.be.true;
      expect(validateMinAge(twentyYearsAgo.toISOString(), 21)).to.be.false;
    });

    it('debe manejar fechas límite', () => {
      const today = new Date();
      const exactlyEighteenYearsAgo = new Date();
      exactlyEighteenYearsAgo.setFullYear(today.getFullYear() - 18);
      
      expect(validateMinAge(exactlyEighteenYearsAgo.toISOString(), 18)).to.be.true;
    });

    it('debe manejar fechas inválidas', () => {
      expect(validateMinAge('invalid-date', 18)).to.be.false;
    });

    it('debe manejar valores null o undefined', () => {
      expect(validateMinAge(null, 18)).to.be.false;
      expect(validateMinAge('2000-01-01', null)).to.be.false;
    });
  });

  describe('validatePublicationDate', () => {
    it('debe validar fechas de publicación válidas', () => {
      expect(validatePublicationDate('2023-01-01')).to.be.true;
      expect(validatePublicationDate('1900-01-01')).to.be.true;
      expect(validatePublicationDate('1500-01-01')).to.be.true;
    });

    it('debe rechazar fechas futuras', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      expect(validatePublicationDate(futureDate.toISOString())).to.be.false;
    });

    it('debe rechazar fechas muy antiguas', () => {
      expect(validatePublicationDate('0500-01-01')).to.be.false;
      expect(validatePublicationDate('0001-01-01')).to.be.false;
    });

    it('debe manejar fechas inválidas', () => {
      expect(validatePublicationDate('invalid-date')).to.be.false;
      expect(validatePublicationDate('2023-13-01')).to.be.false;
    });

    it('debe manejar valores null o undefined', () => {
      expect(validatePublicationDate(null)).to.be.false;
      expect(validatePublicationDate(undefined)).to.be.false;
    });
  });
}); 
