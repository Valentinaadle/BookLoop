/// <reference types="cypress" />

describe('Crear libro', () => {
  beforeEach(() => {
    // Login con las credenciales de Valentina
    cy.loginToBookLoop('valentinaadle1@gmail.com', 'Honduras760');
  });

  it('Debería crear un libro correctamente', () => {
    // Hacer clic en "Publicar mi libro"
    cy.get('a.nav-link[href="/vender-page"]', { timeout: 20000 })
      .should('be.visible')
      .click();

    // Verificar que estamos en la página de venta
    cy.url({ timeout: 10000 }).should('include', '/vender-page');

    // Llenar el formulario
    cy.get('input#isbn', { timeout: 10000 }).should('be.visible').type('9780062315007');
    cy.wait(1000); // Esperar a que se autocompleten datos (si aplica)

    cy.get('select#estado').select('Aceptable');
    cy.get('select#categoria').select('Novela');
    cy.get('input#precio').type('1000');

    // Agregar número de páginas
    cy.get('input#paginas').type('300');

    // Completar editorial
    cy.get('input#editorial').type('Planeta');

    // Subir imagen de prueba
    cy.get('input[type="file"]').selectFile('cypress/fixtures/ejemplo.jpg', { force: true });

    // Enviar el formulario
    cy.get('button.submit-btn[type="submit"]').click();

    // Verificar redirección a la página del libro
    cy.url({ timeout: 20000 }).should('include', '/book/');

    // Verificar que el libro se creó correctamente
    cy.get('h1', { timeout: 20000 }).should('contain', 'The Alchemist');
  });
});
