import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SimpleFilterButton from '../components/SimpleFilterButton';

const TestFilters = () => {
  return (
    <>
      <Header />
      
      <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        
        <SimpleFilterButton>
          <div style={{ padding: '10px' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
              Filtros de Búsqueda
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px', fontWeight: 'bold' }}>Género</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" />
                  <span>Novela</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" />
                  <span>Cuento</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" />
                  <span>Poesía</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" />
                  <span>Drama</span>
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px', fontWeight: 'bold' }}>Idioma</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" />
                  <span>Español</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" />
                  <span>Inglés</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" />
                  <span>Francés</span>
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px', fontWeight: 'bold' }}>Precio</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                  type="number" 
                  placeholder="Precio mínimo" 
                  style={{
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <input 
                  type="number" 
                  placeholder="Precio máximo" 
                  style={{
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>

            <button 
              style={{
                width: '100%',
                backgroundColor: '#10B981',
                color: 'white',
                padding: '12px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Aplicar Filtros
            </button>
          </div>
        </SimpleFilterButton>

        <div style={{ 
          marginLeft: '0', 
          padding: '20px'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
            Página de Prueba - Filtros Responsivos
          </h1>
          
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            Esta es una página de prueba para verificar que el botón de filtros funcione correctamente.
          </p>
          
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            <strong>En móviles:</strong> Deberías ver un botón azul "☰ Filtros" en la esquina superior izquierda.
          </p>
          
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            <strong>En desktop:</strong> Los filtros deberían aparecer en el lado izquierdo de la pantalla.
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '20px',
            marginTop: '30px'
          }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ marginBottom: '10px' }}>Libro {i}</h3>
                <p style={{ color: '#666', marginBottom: '10px' }}>Autor Ejemplo</p>
                <p style={{ fontWeight: 'bold', color: '#2563EB' }}>$15.99</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default TestFilters; 