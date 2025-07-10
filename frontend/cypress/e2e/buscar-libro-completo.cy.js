describe('Buscar Libro - Completo', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    
    // Interceptar búsquedas para controlar los resultados
    cy.intercept('GET', '**/api/books/search*', (req) => {
          const query = req.url.includes('Camino') || req.url.includes('Lobo') ? 'El Camino del Lobo' : req.url.includes('empty') ? '' : 'varios';
    
    if (query === 'El Camino del Lobo') {
        req.reply({
          statusCode: 200,
          body: [
            {
              book_id: 1,
              title: 'El Camino del Lobo',
              authors: ['Autor Ejemplo'],
              price: 25.99,
              condition: 'Muy bueno',
              imageUrl: 'https://example.com/el-camino-del-lobo.jpg',
              seller: { nombre: 'Juan', apellido: 'Pérez' }
            }
          ]
        });
      } else if (query === '') {
        req.reply({
          statusCode: 200,
          body: []
        });
      } else {
        req.reply({
          statusCode: 200,
          body: [
            {
              book_id: 1,
              title: 'El Camino del Lobo',
              authors: ['Autor Ejemplo'],
              price: 25.99,
              condition: 'Muy bueno'
            },
            {
              book_id: 2,
              title: 'El Camino del Lobo',
              authors: ['Autor Ejemplo'],
              price: 18.50,
              condition: 'Bueno'
            }
          ]
        });
      }
    }).as('searchBooks');
    
    // Interceptar obtener todos los libros
    cy.intercept('GET', '**/api/books', {
      statusCode: 200,
      body: [
        {
          book_id: 1,
          title: 'El Camino del Lobo',
          authors: ['Autor Ejemplo'],
          price: 25.99,
          condition: 'Muy bueno',
          category: { category_name: 'Aventuras' }
        },
        {
          book_id: 2,
          title: 'El Camino del Lobo',
          authors: ['Autor Ejemplo'],
          price: 18.50,
          condition: 'Bueno',
          category: { category_name: 'Aventuras' }
        }
      ]
    }).as('getAllBooks');
  });

  it('Debe buscar libros desde la barra superior después de login', () => {
    // 1. Iniciar sesión
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');
    cy.contains('button', 'Ingresar').click();
    
    // Verificar login exitoso
    cy.url().should('not.include', '/login');
    cy.contains('Quiero comprar', { timeout: 10000 }).should('be.visible');
    
    // 2. Buscar desde la barra superior
    cy.get('input[placeholder="Buscar libros..."]', { timeout: 10000 })
      .should('be.visible')
      .click()
      .type('El Camino del Lobo{enter}', { delay: 100 });
    
    // 3. Verificar resultados
    cy.wait('@searchBooks');
    cy.contains('El Camino del Lobo', { timeout: 10000 }).should('be.visible');
    cy.contains('Autor Ejemplo').should('be.visible');
    cy.contains('$25.99').should('be.visible');
  });

  it('Debe buscar libros desde la página de búsqueda', () => {
    // 1. Ir directamente a la página de búsqueda
    cy.visit('/search');
    
    // 2. Realizar búsqueda
    cy.get('input[type="text"]').first().type('El Camino del Lobo');
    cy.get('button').contains('Buscar').click();
    
    // 3. Verificar resultados
    cy.wait('@searchBooks');
    cy.contains('El Camino del Lobo').should('be.visible');
  });

  it('Debe mostrar mensaje cuando no hay resultados', () => {
    // 1. Iniciar sesión
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');
    cy.contains('button', 'Ingresar').click();
    
    // 2. Buscar algo que no existe
    cy.get('input[placeholder="Buscar libros..."]', { timeout: 10000 })
      .should('be.visible')
      .click()
      .type('LibroQueNoExiste{enter}');
    
    // 3. Verificar mensaje de sin resultados
    cy.contains('No se encontraron libros').should('be.visible');
  });

  it('Debe buscar y navegar a detalles del libro', () => {
    // 1. Iniciar sesión
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');
    cy.contains('button', 'Ingresar').click();
    
    // 2. Buscar libro
    cy.get('input[placeholder="Buscar libros..."]', { timeout: 10000 })
      .should('be.visible')
      .click()
      .type('El Camino del Lobo{enter}');
    
    // 3. Hacer clic en el libro para ver detalles
    cy.wait('@searchBooks');
    cy.contains('El Camino del Lobo').click();
    
    // 4. Verificar que navega a la página de detalles
    cy.url().should('include', '/book/');
  });

  it('Debe buscar desde la página de compra y filtrar por categoría', () => {
    // 1. Iniciar sesión
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');
    cy.contains('button', 'Ingresar').click();
    
    // 2. Ir a "Quiero comprar"
    cy.contains('Quiero comprar').click();
    
    // 3. Esperar que carguen los libros
    cy.wait('@getAllBooks');
    
    // 4. Usar barra de búsqueda en la página
    cy.get('input[placeholder*="Buscar"]').type('Camino');
    
    // 5. Verificar que filtra los resultados
    cy.contains('El Camino del Lobo').should('be.visible');
  });

  it('Debe manejar búsquedas con caracteres especiales', () => {
    // 1. Iniciar sesión
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');
    cy.contains('button', 'Ingresar').click();
    
    // 2. Buscar con caracteres especiales
    cy.get('input[placeholder="Buscar libros..."]', { timeout: 10000 })
      .should('be.visible')
      .click()
      .type('Lord & the Flies@#${enter}');
    
    // 3. Verificar que no se rompe la aplicación
    cy.wait('@searchBooks');
    cy.get('body').should('be.visible'); // Página sigue funcionando
  });

  it('Debe buscar y agregar libro a favoritos', () => {
    // 1. Iniciar sesión
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');
    cy.contains('button', 'Ingresar').click();
    
    // 2. Buscar libro
    cy.get('input[placeholder="Buscar libros..."]', { timeout: 10000 })
      .should('be.visible')
      .click()
      .type('El Camino del Lobo{enter}');
    
    // 3. Buscar el botón de favoritos y hacer clic
    cy.wait('@searchBooks');
    cy.get('[data-testid="favorite-button"]').first().click();
    
    // 4. Verificar que se agregó a favoritos (podría cambiar color o ícono)
    cy.get('[data-testid="favorite-button"]').first().should('have.class', 'favorited');
  });

  it('Debe realizar búsquedas rápidas consecutivas', () => {
    // 1. Iniciar sesión
    cy.visit('/login');
    
    cy.get('input[name="email"]').type('silcimolina@gmail.com');
    cy.get('input[name="password"]').type('12345678');
    cy.contains('button', 'Ingresar').click();
    
    // 2. Realizar múltiples búsquedas rápidas
    const searches = ['Lord', 'Crime', 'Fiction'];
    
    searches.forEach((search) => {
      cy.get('input[placeholder="Buscar libros..."]', { timeout: 10000 })
        .clear()
        .type(`${search}{enter}`);
      
      cy.wait('@searchBooks');
      cy.wait(500); // Pequeña pausa entre búsquedas
    });
  });
}); 