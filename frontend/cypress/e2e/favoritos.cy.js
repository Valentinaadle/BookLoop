/// <reference types="cypress" />

describe('Login y manejo de Favoritos', () => {
  it('Marca y luego elimina "El Principito" de Favoritos', () => {
    // 1. Iniciar sesión
    cy.viewport(1280, 720);
    cy.visit('/login');

    cy.get('input[name="email"]').type('valentinaadle1@gmail.com');
    cy.get('input[name="password"]').type('Honduras760');
    cy.contains('button', 'Ingresar').click();

    // 2. Verificar login exitoso
    cy.url().should('not.include', '/login');
    cy.contains('Quiero comprar', { timeout: 10000 }).should('be.visible');

    // 3. Ir a "Quiero comprar"
    cy.contains('Quiero comprar').click();

    // 4. Esperar que el libro esté visible
    cy.contains('El Principito', { timeout: 10000 }).should('be.visible');

    // 5. Guardar referencia a la tarjeta
    cy.contains('El Principito')
      .parents('[class*="card"]')
      .as('cardLibro');

    // 6. Marcar como favorito (y confirmar si hay modal)
    cy.get('@cardLibro')
      .find('button')
      .first()
      .click();

    // Si aparece el modal de confirmación, confirmar
    cy.contains('Sí, agregar', { timeout: 1000 }).then($btn => {
      if ($btn.is(':visible')) {
        cy.wrap($btn).click();
      }
    });

    // 6.1. Ir a la sección de favoritos (clic en el ícono de corazón)
    cy.get('svg').find('path[d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"]')
      .parents('svg')
      .first()
      .parent()
      .click();

    // 6.2. Corroborar que 'El Principito' está en favoritos
    cy.contains('El Principito').should('be.visible');

    // 7. Buscar la card de 'El Principito' en favoritos y quitar de favoritos
    cy.contains('El Principito')
      .parents('[class*="card"]')
      .as('cardFavorito');

    cy.wait(3000);
    cy.get('@cardFavorito')
      .find('button')
      .first()
      .click();

    // Confirmar eliminación en el modal
    cy.contains('Sí, quitar', { timeout: 2000 }).should('be.visible').click();
  });
});
