import React, { useState } from 'react';

const SimpleMobileTest = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const genres = [
    'Novela', 'Cuento', 'Poesía', 'Drama', 'Ciencia ficción', 'Fantasía',
    'Misterio', 'Terror', 'Romance', 'Deportes', 'Biografía', 'Historia',
    'Ensayo', 'Autoayuda', 'Filosofía', 'Psicología', 'Educativo',
    'Técnico', 'Arte', 'Cocina'
  ];

  const languages = ['Español', 'Inglés', 'Francés', 'Alemán', 'Italiano', 'Portugués'];

  const handleGenreChange = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) 
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', position: 'relative' }}>
      
      {/* BOTÓN HAMBURGUESA */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="block lg:hidden"
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          width: '48px',
          height: '48px',
          backgroundColor: '#2563EB',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          zIndex: 999999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }}
      >
        ☰
      </button>

      {/* PANEL DE FILTROS MÓVIL */}
      {showFilters && (
        <>
          <div
            onClick={() => setShowFilters(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              zIndex: 99998
            }}
          />
          
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '320px',
              maxWidth: '85vw',
              height: '100vh',
              backgroundColor: 'white',
              zIndex: 99999,
              padding: '20px',
              paddingBottom: '40px',
              overflowY: 'auto',
              boxShadow: '2px 0 15px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header sin botón cerrar */}
            <div style={{ 
              marginBottom: '25px',
              paddingBottom: '15px',
              borderBottom: '2px solid #f0f0f0'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                Filtros
              </h2>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                margin: '0 0 15px 0', 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: '#555'
              }}>
                Género
              </h3>
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                padding: '10px'
              }}>
                {genres.map(genre => (
                  <label 
                    key={genre} 
                    style={{ 
                      display: 'block', 
                      marginBottom: '8px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    <input 
                      type="checkbox"
                      checked={selectedGenres.includes(genre)}
                      onChange={() => handleGenreChange(genre)}
                      style={{ marginRight: '10px', cursor: 'pointer' }} 
                    />
                    {genre}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                margin: '0 0 15px 0', 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: '#555'
              }}>
                Idioma
              </h3>
              <div style={{ 
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                padding: '10px'
              }}>
                {languages.map(lang => (
                  <label 
                    key={lang} 
                    style={{ 
                      display: 'block', 
                      marginBottom: '8px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    <input 
                      type="checkbox"
                      checked={selectedLanguages.includes(lang)}
                      onChange={() => handleLanguageChange(lang)}
                      style={{ marginRight: '10px', cursor: 'pointer' }} 
                    />
                    {lang}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                margin: '0 0 15px 0', 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: '#555'
              }}>
                Rango de Precio
              </h3>
              <div style={{ 
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                padding: '15px',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
              }}>
                <input 
                  type="number" 
                  placeholder="Precio mínimo ($)" 
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }} 
                />
                <input 
                  type="number" 
                  placeholder="Precio máximo ($)" 
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }} 
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px' }}>
              <button
                onClick={() => {
                  console.log('Filtros aplicados:', {
                    genres: selectedGenres,
                    languages: selectedLanguages,
                    priceMin,
                    priceMax
                  });
                  setShowFilters(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Aplicar Filtros
              </button>
              
              <button
                onClick={() => {
                  setSelectedGenres([]);
                  setSelectedLanguages([]);
                  setPriceMin('');
                  setPriceMax('');
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#6B7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </>
      )}

      <div style={{ 
        marginLeft: '0',
        padding: '80px 20px 20px 20px'
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
          Filtros Simplificados ✨
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3>Libro {i}</h3>
              <p style={{ color: '#666' }}>Autor {i}</p>
              <p style={{ fontWeight: 'bold', color: '#2563EB' }}>$19.99</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleMobileTest; 