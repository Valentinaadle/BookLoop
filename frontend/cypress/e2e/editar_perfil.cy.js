/// <reference types="cypress" />

describe('Editar apellido en el perfil', () => {
    it('Inicia sesión, edita el apellido y guarda los cambios', () => {
      cy.viewport(1280, 720);
      cy.visit('/login');
  
      cy.get('input[name="email"]').type('silcimolina@gmail.com');
      cy.get('input[name="password"]').type('12345678');
  
      cy.contains('button', 'Ingresar').click();
  
      // Confirmar que salimos de /login
      cy.url().should('not.include', '/login');
  
      // Hacer clic en el ícono de perfil con title="Perfil"
      cy.get('a[title="Perfil"]').click();
  
      // Hacer clic en "Editar perfil"
      cy.contains('Editar perfil').click();
  
      // Esperar el campo de apellido y cambiar a "Molina"
      cy.get('input[name="apellido"]', { timeout: 10000 })
        .should('be.visible')
        .clear()
        .type('Molina');
  
      // Guardar cambios
      cy.contains('button', 'Guardar').click();
  
      // Verificar que "Molina" se muestra en el perfil
      cy.contains('Molina').should('exist');
    });
  });
  