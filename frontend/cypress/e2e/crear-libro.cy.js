/// <reference types="cypress" />

describe('Crear Libro - Desde el banner principal', () => {
  it('Debe iniciar sesión, esperar el texto del banner y crear un libro desde el botón central', () => {
    cy.viewport(1280, 720);

    // 1. Ingresar a la página de login
    cy.visit('/login');

    // 2. Login
    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');
    cy.contains('button', 'Ingresar').click();

    // 3. Confirmar que salimos del login
    cy.url().should('not.include', '/login');

    // 4. Esperar que el texto del banner esté completamente renderizado
    cy.contains('¡Dale una segunda vida a tus libros con BookLoop!', { timeout: 10000 })
      .should('be.visible');

    // 5. Hacer clic en el botón grande del centro que dice "Quiero Vender"
    cy.contains('button, a', 'Quiero Vender', { timeout: 10000 })
      .should('be.visible')
      .click();

    // 6. Esperar que cargue el formulario
    cy.get('form').should('be.visible');
    cy.get('input[name="isbn"]').should('be.visible').type('9780140283334').blur();

    // 7. Completar formulario
    cy.get('input[name="titulo"]').type('El Camino del Lobo');
    cy.get('input[name="autor"]').type('Autor Ejemplo');
    cy.get('select[name="estado"]').select('Buen estado');
    cy.get('select[name="categoria"]').select('1'); // Ajustar si cambia
    cy.get('input[name="precio"]').type('25.99');
    cy.get('textarea[name="descripcion"]').type('Libro en excelente estado, casi nuevo');

    // 8. Hacer clic en el botón "Publicar libro"
    cy.contains('button', 'Publicar libro').click();

  });
});
