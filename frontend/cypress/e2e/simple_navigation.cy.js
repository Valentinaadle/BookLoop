/// <reference types="cypress" />

describe('BookLoop - Navegación Simple', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it('Login básico y navegación', () => {
    // 1. Ir al login
    cy.visit('/login');
    
    // 2. Completar formulario
    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');
    
    // 3. Hacer clic en "Ingresar"
    cy.contains('button', 'Ingresar').click();
    
    // 4. Verificar que el login fue exitoso
    cy.url().should('not.include', '/login');
    cy.contains('Quiero comprar', { timeout: 10000 }).should('be.visible');
  });

  it('Navegación a página de venta', () => {
    // Login
    cy.visit('/login');
    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');
    cy.contains('button', 'Ingresar').click();
    cy.url().should('not.include', '/login');
    
    // Ir a página de venta
    cy.visit('/vender-page');
    
    // Verificar que cargó correctamente
    cy.get('h2').contains('Vende tus libros de forma rápida y sencilla en BookLoop').should('be.visible');
    cy.get('h2').contains('Formulario de venta').should('be.visible');
  });

  it('Navegación entre secciones', () => {
    // Login
    cy.visit('/login');
    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');
    cy.contains('button', 'Ingresar').click();
    cy.url().should('not.include', '/login');
    
    // Ir a Quiero comprar
    cy.contains('Quiero comprar').click();
    cy.url().should('include', '/comprar');
    
    // Ir a Quiero vender
    cy.contains('Quiero vender').click();
    cy.url().should('include', '/vender-page');
    
    // Ir a Favoritos
    cy.contains('Favoritos').click();
    cy.url().should('include', '/favoritos');
  });

  it('Verificación de formulario de venta', () => {
    // Login
    cy.visit('/login');
    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');
    cy.contains('button', 'Ingresar').click();
    cy.url().should('not.include', '/login');
    
    // Ir a página de venta
    cy.visit('/vender-page');
    
    // Verificar que el formulario existe
    cy.get('form.sell-form').should('be.visible');
    cy.get('input[name="isbn"]').should('be.visible');
    cy.get('input[name="titulo"]').should('be.visible');
    cy.get('input[name="autor"]').should('be.visible');
    cy.get('input[name="precio"]').should('be.visible');
    cy.get('select[name="estado"]').should('be.visible');
    cy.get('select[name="categoria"]').should('be.visible');
    cy.get('textarea[name="descripcion"]').should('be.visible');
  });

  it('Búsqueda básica', () => {
    // Login
    cy.visit('/login');
    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');
    cy.contains('button', 'Ingresar').click();
    cy.url().should('not.include', '/login');
    
    // Buscar libros
    cy.get('input[placeholder="Buscar libros..."]', { timeout: 10000 }).should('be.visible');
    cy.get('input[placeholder="Buscar libros..."]').type('Harry Potter{enter}');
    
    // Verificar que se realizó la búsqueda
    cy.url().should('include', '/search');
  });

  it('Completar formulario básico de venta', () => {
    // Login
    cy.visit('/login');
    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');
    cy.contains('button', 'Ingresar').click();
    cy.url().should('not.include', '/login');
    
    // Ir a página de venta
    cy.visit('/vender-page');
    
    // Completar formulario básico
    cy.get('input[name="titulo"]').type('Libro de Prueba Simple');
    cy.get('input[name="autor"]').type('Autor de Prueba');
    cy.get('input[name="precio"]').type('25.99');
    cy.get('textarea[name="descripcion"]').type('Descripción del libro para pruebas');
    
    // Seleccionar estado (si está disponible)
    cy.get('select[name="estado"]').then($select => {
      if ($select.find('option').length > 1) {
        cy.get('select[name="estado"]').select('Muy bueno');
      }
    });
    
    // Seleccionar categoría (si está disponible)
    cy.get('select[name="categoria"]').then($select => {
      if ($select.find('option').length > 1) {
        cy.get('select[name="categoria"]').select(1);
      }
    });
    
    // Verificar que los campos están completados
    cy.get('input[name="titulo"]').should('have.value', 'Libro de Prueba Simple');
    cy.get('input[name="autor"]').should('have.value', 'Autor de Prueba');
    cy.get('input[name="precio"]').should('have.value', '25.99');
  });
}); 