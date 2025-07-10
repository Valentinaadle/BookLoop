/// <reference types="cypress" />

describe('Crear Libro - QuieroVender', () => {
  beforeEach(() => {
    // Configuración inicial
    cy.viewport(1280, 720);
    
    // Interceptar llamadas a la API para evitar crear libros reales
    cy.intercept('GET', '**/api/categories', {
      statusCode: 200,
      body: [
        { category_id: 1, category_name: 'Ficción' },
        { category_id: 2, category_name: 'Misterio' },
        { category_id: 3, category_name: 'Romance' },
        { category_id: 4, category_name: 'Ciencia Ficción' }
      ]
    }).as('getCategories');
    
    // Interceptar búsqueda por ISBN
    cy.intercept('GET', '**/api/books/search-isbn?isbn=9780140283334', {
      statusCode: 200,
      body: {
        titulo: 'El Camino del Lobo',
        autor: 'Autor Ejemplo',
        idioma: 'es',
                  descripcion: 'Una historia fascinante de aventuras',
        imagen: 'https://example.com/libro.jpg',
        paginas: '224',
        publicacion: '1954',
        editorial: 'Penguin Classics'
      }
    }).as('searchISBN');
    
    // Interceptar subida de imagen
    cy.intercept('POST', '**/api/books/upload-image', {
      statusCode: 200,
      body: { imageUrl: 'https://example.com/uploaded-image.jpg' }
    }).as('uploadImage');
    
    // Interceptar creación del libro
    cy.intercept('POST', '**/api/books', {
      statusCode: 200,
      body: { book_id: 123, title: 'El Camino del Lobo' }
    }).as('createBook');
  });

  it('Debe crear un libro exitosamente completando el formulario', () => {
    // 1. Iniciar sesión
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');
    cy.contains('button', 'Ingresar').click();
    
    // Verificar que el login fue exitoso
    cy.url().should('not.include', '/login');
    
    // 2. Navegar a "Quiero Vender"
    cy.visit('/quiero-vender');
    
    // 3. Completar el formulario de venta
    cy.get('h2').contains('Formulario de venta').should('be.visible');
    
    // Ingresar ISBN y esperar que se complete automáticamente
    cy.get('input[name="isbn"]').type('9780140283334');
    cy.get('input[name="isbn"]').blur();
    
    // Esperar que se complete la información del libro
    cy.wait('@searchISBN');
        cy.get('input[name="titulo"]').should('have.value', 'El Camino del Lobo');
    cy.get('input[name="autor"]').should('have.value', 'Autor Ejemplo');
    
    // Completar campos adicionales
    cy.get('select[name="estado"]').select('Muy bueno');
    cy.get('select[name="categoria"]').select('1'); // Ficción
    cy.get('input[name="precio"]').type('25.99');
    cy.get('textarea[name="descripcion"]').type('Libro en excelente estado, casi nuevo');
    
    // Subir imagen (simular)
    cy.get('input[type="file"]').selectFile('cypress/fixtures/example.json', { force: true });
    
    // 4. Enviar el formulario
    cy.get('button[type="submit"]').click();
    
    // Verificar que se envió la información correcta
    cy.wait('@createBook').then((interception) => {
      expect(interception.request.body).to.deep.include({
        title: 'El Camino del Lobo',
        price: '25.99',
        condition: 'Muy bueno',
        category_id: '1'
      });
    });
    
    // 5. Verificar mensaje de éxito
    cy.contains('¡Libro publicado correctamente!').should('be.visible');
  });

  it('Debe validar campos requeridos', () => {
    // 1. Iniciar sesión
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');
    cy.contains('button', 'Ingresar').click();
    
    // 2. Ir a quiero vender
    cy.visit('/quiero-vender');
    
    // 3. Intentar enviar formulario vacío
    cy.get('button[type="submit"]').click();
    
    // 4. Verificar que aparecen validaciones (depende de tu implementación)
    cy.get('input[name="isbn"]').should('have.focus');
  });

  it('Debe manejar error de ISBN no encontrado', () => {
    // Interceptar error de ISBN
    cy.intercept('GET', '**/api/books/search-isbn?isbn=1234567890', {
      statusCode: 404,
      body: { error: 'No se encontró información para ese ISBN.' }
    }).as('searchISBNError');
    
    // 1. Iniciar sesión
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');
    cy.contains('button', 'Ingresar').click();
    
    // 2. Ir a quiero vender
    cy.visit('/quiero-vender');
    
    // 3. Ingresar ISBN inválido
    cy.get('input[name="isbn"]').type('1234567890');
    cy.get('input[name="isbn"]').blur();
    
    // 4. Verificar mensaje de error
    cy.wait('@searchISBNError');
    cy.contains('No se encontró información para ese ISBN.').should('be.visible');
  });

  it('Debe mostrar los pasos de venta correctamente', () => {
    cy.visit('/quiero-vender');
    
    // Verificar que se muestran todos los pasos
    cy.contains('Registrate').should('be.visible');
    cy.contains('Ingresa el codigo ISBN').should('be.visible');
    cy.contains('Selecciona un estado').should('be.visible');
    cy.contains('Pone un precio').should('be.visible');
    
    // Verificar que tienen íconos
    cy.get('.paso-icono').should('have.length', 4);
  });
}); 