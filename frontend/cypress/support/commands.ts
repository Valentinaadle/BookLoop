/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// ***********************************************
// BookLoop Custom Commands
// ***********************************************

// Comando para iniciar sesión
Cypress.Commands.add('loginToBookLoop', (email = 'silcimolina@gmail.com', password = '12345678') => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.contains('button', 'Ingresar').click();
  cy.url().should('not.include', '/login');
  cy.contains('Quiero comprar', { timeout: 10000 }).should('be.visible');
});

// Comando para buscar libros desde la barra superior
Cypress.Commands.add('searchFromTopBar', (searchTerm: string) => {
  cy.get('input[placeholder="Buscar libros..."]', { timeout: 10000 })
    .should('be.visible')
    .click()
    .clear()
    .type(`${searchTerm}{enter}`, { delay: 100 });
});

// Comando para ir a la página de vender
Cypress.Commands.add('goToSellPage', () => {
  cy.visit('/vender-page');
  cy.get('h2').contains('Formulario de venta').should('be.visible');
});

// Comando para completar formulario de venta básico
Cypress.Commands.add('fillBookForm', (bookData: any) => {
  if (bookData.isbn) {
    cy.get('input[name="isbn"]').type(bookData.isbn);
    cy.get('input[name="isbn"]').blur();
  }
  
  if (bookData.title) {
    cy.get('input[name="titulo"]').clear().type(bookData.title);
  }
  
  if (bookData.author) {
    cy.get('input[name="autor"]').clear().type(bookData.author);
  }
  
  if (bookData.condition) {
    cy.get('select[name="estado"]').select(bookData.condition);
  }
  
  if (bookData.category) {
    cy.get('select[name="categoria"]').select(bookData.category);
  }
  
  if (bookData.price) {
    cy.get('input[name="precio"]').type(bookData.price);
  }
  
  if (bookData.description) {
    cy.get('textarea[name="descripcion"]').type(bookData.description);
  }
});

// Comando para configurar interceptores comunes
Cypress.Commands.add('setupBookLoopInterceptors', () => {
  // Interceptar categorías
  cy.intercept('GET', '**/api/categories', {
    statusCode: 200,
    body: [
      { category_id: 1, category_name: 'Ficción' },
      { category_id: 2, category_name: 'Misterio' },
      { category_id: 3, category_name: 'Romance' },
      { category_id: 4, category_name: 'Ciencia Ficción' }
    ]
  }).as('getCategories');
  
  // Interceptar búsqueda de libros
  cy.intercept('GET', '**/api/books/search*', {
    statusCode: 200,
    body: [
      {
        book_id: 1,
        title: 'Lord of the Flies',
        authors: ['William Golding'],
        price: 25.99,
        condition: 'Muy bueno',
        imageUrl: 'https://example.com/lord-flies.jpg'
      }
    ]
  }).as('searchBooks');
  
  // Interceptar todos los libros
  cy.intercept('GET', '**/api/books', {
    statusCode: 200,
    body: [
      {
        book_id: 1,
        title: 'Lord of the Flies',
        authors: ['William Golding'],
        price: 25.99,
        condition: 'Muy bueno',
        category: { category_name: 'Ficción' }
      },
      {
        book_id: 2,
        title: 'Crime and Punishment',
        authors: ['Fyodor Dostoevsky'],
        price: 18.50,
        condition: 'Bueno',
        category: { category_name: 'Misterio' }
      }
    ]
  }).as('getAllBooks');
});

// Comando para navegar a secciones principales
Cypress.Commands.add('goToSection', (section: string) => {
  cy.contains(section).click();
  
  switch (section) {
    case 'Quiero comprar':
      cy.url().should('include', '/comprar');
      break;
    case 'Quiero vender':
      cy.url().should('include', '/vender-page');
      break;
    case 'Favoritos':
      cy.url().should('include', '/favoritos');
      break;
    case 'Perfil':
      cy.url().should('include', '/profile');
      break;
  }
});

// Comando para verificar que un libro aparece en los resultados
Cypress.Commands.add('verifyBookInResults', (bookTitle: string, shouldExist = true) => {
  if (shouldExist) {
    cy.contains(bookTitle, { timeout: 10000 }).should('be.visible');
  } else {
    cy.contains(bookTitle).should('not.exist');
  }
});

// Comando para simular carga de imagen
Cypress.Commands.add('uploadBookImage', (filename = 'example.json') => {
  cy.get('input[type="file"]').selectFile(`cypress/fixtures/${filename}`, { force: true });
});

// Comando para verificar mensajes de éxito/error
Cypress.Commands.add('verifyMessage', (message: string, type: 'success' | 'error' = 'success') => {
  const className = type === 'success' ? '.success-message' : '.error-message';
  cy.get(className).should('contain', message);
});

// Declaraciones de tipos para TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      loginToBookLoop(email?: string, password?: string): Chainable<void>
      searchFromTopBar(searchTerm: string): Chainable<void>
      goToSellPage(): Chainable<void>
      fillBookForm(bookData: any): Chainable<void>
      setupBookLoopInterceptors(): Chainable<void>
      goToSection(section: string): Chainable<void>
      verifyBookInResults(bookTitle: string, shouldExist?: boolean): Chainable<void>
      uploadBookImage(filename?: string): Chainable<void>
      verifyMessage(message: string, type?: 'success' | 'error'): Chainable<void>
    }
  }
}