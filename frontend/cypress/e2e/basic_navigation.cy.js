/// <reference types="cypress" />

describe('Login y navegación básica', () => {
  it('Inicia sesión y prueba los botones de navegación', () => {
    // 1. Ir al login
    cy.viewport(1280, 720);
    cy.visit('/login');

    // 2. Completar formulario
    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');

    // 3. Hacer clic en "Ingresar"
    cy.contains('button', 'Ingresar').click();

    // 4. Verificar que ya no estamos en /login
    cy.url().should('not.include', '/login');

    // 5. Hacer clic en "Quiero comprar"
    cy.contains('Quiero comprar').click();

    // 6. Volver atrás
    cy.go('back');

    // 7. Hacer clic en "Quiero vender"
    cy.contains('Quiero vender').click();

    // 8. Fin del test
  });
});
