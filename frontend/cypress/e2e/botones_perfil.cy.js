/// <reference types="cypress" />

describe('Navegación en perfil BookLoop sin presionar Reseñas', () => {
    it('Inicia sesión y navega entre las secciones del perfil correctamente', () => {
      cy.viewport(1280, 720);
      cy.visit('/login');
  
      cy.get('input[name="email"]').type('silcimolina@gmail.com');
      cy.get('input[name="password"]').type('12345678');
  
      cy.contains('button', 'Ingresar').click();
  
      // Confirmar que salimos del login
      cy.url().should('not.include', '/login');
  
      // Hacer clic en el ícono de perfil (usando title="Perfil" si aplica)
      cy.get('a[title="Perfil"]').click();
  
      // Confirmar que estamos en la página de perfil
      cy.url().should('include', '/profile');
  
      // 📚 Hacer clic en "Libros Publicados"
      cy.contains('Libros Publicados').click();
      cy.url().should('include', '/profile'); // permanece en profile
  
      // ✅ Hacer clic en "Libros Vendidos"
      cy.contains('Libros Vendidos').click();
  
      // ✅ Hacer clic en "Solicitudes"
      cy.contains('Solicitudes').click();
  
      // ✅ Hacer clic en "Wishlist"
      cy.contains('Wishlist').click();
  
      // 🚫 NO hacer clic en "Reseñas"
      cy.contains('Reseñas').should('exist');
  
      // Confirmar que al finalizar seguimos en la página de perfil
      cy.url().should('include', '/profile');
    });
  });
  