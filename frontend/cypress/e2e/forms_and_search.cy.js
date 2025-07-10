/// <reference types="cypress" />

describe('Comprar libro filtrando por categoría', () => {
  it('Inicia sesión, filtra por Misterio y compra Crime and Punishment', () => {
    // 1. Login
    cy.viewport(1280, 720);
    cy.visit('/login');

    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');

    // Cambiamos submit por clic en el botón que diga "Ingresar"
    cy.contains('button', 'Ingresar').click();

    // Verificar que el login fue exitoso
    cy.url().should('not.include', '/login');

    // 2. Ir a "Quiero comprar"
    cy.contains('Quiero comprar').click();

    // 3. Filtrar por categoría "Misterio"
    cy.contains('Misterio').click();

    // 4. Verificar que aparece el libro "Crime and Punishment"
    cy.contains('Crime and Punishment').should('be.visible');

    // 5. Hacer clic en "Comprar" en el contenedor del libro
    cy.contains('Crime and Punishment')
      .parent()
      .contains('Comprar')
      .click();

    // 6. Fin del test
  });
});
