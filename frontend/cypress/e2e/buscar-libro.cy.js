/// <reference types="cypress" />

describe('Login y búsqueda en la barra superior', () => {
  it('Inicia sesión y busca un libro desde la barra superior', () => {
    // 1. Iniciar sesión
    cy.viewport(1280, 720);
    cy.visit('/login');

    // Completar formulario de login con tu email y contraseña indicados
    cy.get('input[name="email"]').type('valentinaadle1@gmail.com');
    cy.get('input[name="password"]').type('Honduras760');

    // Hacer clic en el botón "Ingresar" de forma estable
    cy.contains('button', 'Ingresar').click();

    // 2. Verificar que ingresó correctamente
    cy.url().should('not.include', '/login');
    cy.contains('Quiero comprar', { timeout: 10000 }).should('be.visible');

    // 3. Buscar "El Camino del Lobo" desde la barra superior
    cy.get('input[placeholder="Buscar libros..."]', { timeout: 10000 })
      .should('be.visible')
      .click()
      .type('El Camino del Lobo{enter}', { delay: 100 });

    // 4. Verificar que aparece el libro
    cy.contains('El Camino del Lobo', { timeout: 10000 }).should('be.visible');
  });
});
