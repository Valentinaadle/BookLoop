/// <reference types="cypress" />

describe('Login y marcar y desmarcar un libro como favorito', () => {
  it('Marca y luego elimina "El Camino del Lobo" de favoritos', () => {
    // 1. Iniciar sesión
    cy.viewport(1280, 720);
    cy.visit('/login');

    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');
    cy.contains('button', 'Ingresar').click();

    // 2. Verificar login exitoso
    cy.url().should('not.include', '/login');
    cy.contains('Quiero comprar', { timeout: 10000 }).should('be.visible');

    // 3. Ir a "Quiero comprar"
    cy.contains('Quiero comprar').click();

    // 4. Esperar que el libro esté visible
    cy.contains('Pride and Prejudice', { timeout: 10000 }).should('be.visible');

    // 5. Guardar referencia a la tarjeta
    cy.contains('Pride and Prejudice')
      .parents('[class*="card"]')
      .as('cardLibro');

    // 6. Marcar como favorito
    cy.get('@cardLibro')
      .find('button')
      .first()
      .click();

    // 7. Esperar un poco y volver a hacer clic para desmarcar
    cy.wait(500);
    cy.get('@cardLibro')
      .find('button')
      .first()
      .click();

    // 8. Confirmar eliminación en el modal
    cy.contains('Confirmar').click();
  });
});
