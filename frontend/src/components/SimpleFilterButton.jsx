import React, { useState } from 'react';

const SimpleFilterButton = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* BOTÓN SIMPLE - Siempre visible en móviles */}
      <div className="block md:hidden">
        <button
          onClick={toggleFilters}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            backgroundColor: '#3B82F6',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: 999999,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
        >
          ☰ Filtros
        </button>
      </div>

      {/* PANEL DE FILTROS */}
      {isOpen && (
        <>
          {/* Overlay oscuro */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 99998
            }}
            className="block md:hidden"
          />
          
          {/* Panel con filtros */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100vh',
              width: '300px',
              maxWidth: '80vw',
              backgroundColor: 'white',
              padding: '20px',
              overflowY: 'auto',
              zIndex: 99999,
              boxShadow: '2px 0 10px rgba(0,0,0,0.3)'
            }}
            className="block md:hidden"
          >
            {/* Botón cerrar */}
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  backgroundColor: '#EF4444',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ✕ Cerrar
              </button>
            </div>
            
            {/* Aquí van los filtros */}
            {children}
          </div>
        </>
      )}

      {/* FILTROS DESKTOP - Siempre visibles */}
      <div className="hidden md:block">
        {children}
      </div>
    </div>
  );
};

export default SimpleFilterButton; 