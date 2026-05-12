import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import "../Assets/css/home.css";
import "../Assets/css/header.css";
import "../Assets/css/footer.css";
import "../Assets/css/filtro.css";
import "../Assets/css/bookcard.css";
import "../Assets/css/desktopFilters.css";
import BookCard from '../components/BookCard';
import DesktopFilters from '../components/DesktopFilters';
import { getBookImage, getBookAuthor } from '../utils/bookUtils';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const DEFAULT_BOOK_IMAGE = '/icono2.png';

const Comprar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState({
    genero: true,
    idioma: true,
    estado: true,
    precio: true
  });
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('default');
  const [categories, setCategories] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Géneros a excluir del filtro
  const genresToExclude = ['Ciencias', 'Filosofía', 'Fantasía', 'Escolar'];

  // Mapeo de códigos de idioma a nombres completos
  const languageMap = {
    'en': 'Inglés',
    'es': 'Español',
  };

  // Leer el query param 'genero' al cargar la página
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genero = params.get('genero');
    if (genero) {
      setSelectedGenres([genero]);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/books`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      // Filtrar libros vendidos en el frontend por si acaso
      const filtered = Array.isArray(data) ? data.filter(book => book.status !== 'vendido') : [];
      setBooks(filtered);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Error al cargar los libros. Por favor, intenta de nuevo más tarde.');
      setBooks([]);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const toggle = (key) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenreChange = (genre) => {
    setSelectedGenres((prevSelectedGenres) => {
      if (prevSelectedGenres.includes(genre)) {
        return prevSelectedGenres.filter((g) => g !== genre);
      } else {
        return [...prevSelectedGenres, genre];
      }
    });
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguages((prevSelectedLanguages) => {
      if (prevSelectedLanguages.includes(language)) {
        return prevSelectedLanguages.filter((l) => l !== language);
      } else {
        return [...prevSelectedLanguages, language];
      }
    });
  };

  const handleConditionChange = (condition) => {
    setSelectedConditions((prevSelectedConditions) => {
      if (prevSelectedConditions.includes(condition)) {
        return prevSelectedConditions.filter((c) => c !== condition);
      } else {
        return [...prevSelectedConditions, condition];
      }
    });
  };

  const handleSort = (books) => {
    switch (sortBy) {
      case 'price-asc':
        return [...books].sort((a, b) => (a.precio || a.price) - (b.precio || b.price));
      case 'price-desc':
        return [...books].sort((a, b) => (b.precio || b.price) - (a.precio || a.price));
      case 'most-sold':
        return [...books].sort((a, b) => (b.id || b.book_id) - (a.id || a.book_id));
      default:
        return books;
    }
  };

  // Admin handlers for edit/delete
  const [deleting, setDeleting] = useState(false);
  const [adminError, setAdminError] = useState(null);

  const handleEditBook = (id) => {
    navigate(`/edit-book/${id}`);
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('¿Seguro que quieres borrar este libro?')) return;
    setDeleting(true);
    setAdminError(null);
    try {
      const res = await fetch(`${API_URL}/api/books/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al borrar libro');
      // Refresh books
      fetchBooks();
    } catch (err) {
      setAdminError('Error al borrar libro');
    }
    setDeleting(false);
  };

  const filteredBooks = books.filter(book => {
    const price = book.precio || book.price;
    if (priceRange.min && price < parseFloat(priceRange.min)) return false;
    if (priceRange.max && price > parseFloat(priceRange.max)) return false;

    // --- Filtrado por categoría/género ---
    if (selectedGenres.length > 0) {
      let bookCategory = '';
      // Soportar diferentes estructuras posibles
      if (book.categoria) {
        bookCategory = book.categoria;
      } else if (book.category && typeof book.category === 'object' && book.category.category_name) {
        bookCategory = book.category.category_name;
      } else if (book.category && typeof book.category === 'string') {
        bookCategory = book.category;
      } else if (book.genero) {
        bookCategory = book.genero;
      }
      // Normalizar para comparar
      const normalizedBookCategory = (bookCategory || '').toLowerCase().trim();
      const matchesGenre = selectedGenres.some(selectedGenre =>
        normalizedBookCategory === selectedGenre.toLowerCase().trim()
      );
      if (!matchesGenre) return false;
    }

    // --- Filtrado por idioma ---
    if (selectedLanguages.length > 0) {
      const bookLanguage = book.language || '';
      const fullLanguageName = languageMap[bookLanguage] || '';
      if (!selectedLanguages.includes(fullLanguageName)) return false;
    }

    // --- Filtrado por estado ---
    if (selectedConditions.length > 0) {
      // Soportar variantes: estado, condition, state
      let bookCondition = book.estado || book.condition || book.state || '';
      bookCondition = bookCondition.trim().toLowerCase();
      const matchesCondition = selectedConditions.some(selectedCond =>
        bookCondition === selectedCond.trim().toLowerCase()
      );
      if (!matchesCondition) return false;
    }

    return true;
  });

  const sortedBooks = handleSort(filteredBooks);

  return (
    <>
      <Header />
      {/* PANEL DE FILTROS MÓVIL */}
      {showMobileFilters && (
        <>
          <div
            onClick={() => setShowMobileFilters(false)}
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
            className="mobile-filters"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '280px',
              maxWidth: '75vw',
              height: '100vh',
              backgroundColor: 'var(--bl-bg-elevated, #ffffff)',
              zIndex: 99999,
              padding: '24px',
              paddingBottom: '40px',
              overflowY: 'auto',
              boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ 
              marginBottom: '25px',
              paddingBottom: '15px',
              borderBottom: '1px solid var(--bl-border-light, #f3f4f6)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                color: 'var(--bl-text-primary, #111827)',
                fontFamily: "'Playfair Display', serif"
              }}>
                Filtros
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary-color, #555)',
                  border: '1px solid var(--border-color, #e0e0e0)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.07)',
                  transition: 'all 0.2s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f8f8';
                  e.target.style.color = 'var(--danger-color, #dc3545)';
                  e.target.style.borderColor = 'var(--danger-color, #dc3545)';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--text-secondary-color, #555)';
                  e.target.style.borderColor = 'var(--border-color, #e0e0e0)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.07)';
                }}
              >
                ✕
              </button>
            </div>
            

       
            {/* Filtro de Género */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                margin: '0 0 15px 0', 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: 'var(--bl-text-primary, #111827)'
              }}>
                Género
              </h3>
              <div className="chips-container" style={{ padding: '4px' }}>
                {categories
                  .filter(category => !genresToExclude.includes(category.category_name))
                  .map(category => {
                    const isSelected = selectedGenres.includes(category.category_name);
                    return (
                      <button
                        key={category.category_id}
                        className={`filter-chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleGenreChange(category.category_name)}
                      >
                        {category.category_name}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Filtro de Idioma */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                margin: '0 0 15px 0', 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: 'var(--bl-text-primary, #111827)'
              }}>
                Idioma
              </h3>
              <div className="chips-container" style={{ padding: '4px' }}>
                {Object.values(languageMap).map(lang => {
                  const isSelected = selectedLanguages.includes(lang);
                  return (
                    <button
                      key={lang}
                      className={`filter-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filtro de Estado */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                margin: '0 0 15px 0', 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: 'var(--bl-text-primary, #111827)'
              }}>
                Estado
              </h3>
              <div className="chips-container" style={{ padding: '4px' }}>
                {["Nuevo", "Como Nuevo", "Buen Estado", "Aceptable"].map(condition => {
                  const isSelected = selectedConditions.includes(condition);
                  return (
                    <button
                      key={condition}
                      className={`filter-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleConditionChange(condition)}
                    >
                      {condition}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filtro de Precio */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                margin: '0 0 15px 0', 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: 'var(--bl-text-primary, #111827)'
              }}>
                Rango de Precio
              </h3>
              <div className="price-inputs-row" style={{ marginTop: '10px' }}>
                <div className="price-input-wrapper">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="modern-price-input"
                  />
                </div>
                <span className="price-separator">-</span>
                <div className="price-input-wrapper">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="modern-price-input"
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px' }}>
              <button
                onClick={() => {
                  setShowMobileFilters(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  backgroundColor: 'var(--bl-brand-primary, #3b82f6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bl-brand-primary-hover, #2563eb)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--bl-brand-primary, #3b82f6)'}
              >
                Aplicar Filtros
              </button>
              
              <button
                onClick={() => {
                  setSelectedGenres([]);
                  setSelectedLanguages([]);
                  setSelectedConditions([]);
                  setPriceRange({ min: '', max: '' });
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

      <main className="home-container" style={{ paddingLeft: '0.5rem' }}>
        {/* SIDEBAR CON FILTROS DE DESKTOP */}
        <aside className="hidden lg:block">
          <DesktopFilters
            categories={categories}
            selectedGenres={selectedGenres}
            selectedLanguages={selectedLanguages}
            selectedConditions={selectedConditions}
            priceRange={priceRange}
            onGenreChange={handleGenreChange}
            onLanguageChange={handleLanguageChange}
            onConditionChange={handleConditionChange}
            onPriceChange={setPriceRange}
            languageMap={languageMap}
          />
        </aside>
        
        <section className="main-content">
          <div className="sort-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 1rem' }}>
            {/* BOTÓN FILTROS MÓVIL */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="block lg:hidden filter-sort-button mobile-filters"
              style={{
                backgroundColor: 'transparent',
                color: '#333',
                border: '1.5px solid #bdbdbd',
                borderRadius: '20px',
                padding: '0.5rem 1rem',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.07)',
                transition: 'all 0.2s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginLeft: '20px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f8f8f8';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.07)';
              }}
            >
              ☰ Filtros
            </button>
            {/* CONTADOR DE RESULTADOS */}
            <div style={{ 
              textAlign: 'center',
              fontSize: '1rem',
              color: '#555',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexGrow: 1
            }}>
              {filteredBooks.length}
              <span style={{fontWeight: 'normal', marginLeft: '0.3rem' }}>
                {filteredBooks.length === 1 ? 'Resultado' : 'Resultados'}
              </span>
              {selectedGenres.length > 0 && (
                <span style={{
                  marginLeft: '0.5rem',
                  color: '#666',
                  backgroundColor: '#f5f5f5',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.85rem'
                }}>
                  Filtros: {selectedGenres.join(', ')}
                </span>
              )}
            </div>
            
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select filter-sort-button">
              <option value="default">Ordenar por</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="most-sold">Recién ingresados</option>
            </select>
          </div>
          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError(null)} className="close-error">×</button>
            </div>
          )}
          {loading ? (
            <div className="loading">Cargando libros...</div>
          ) : (
            <div className="books-grid">
              {adminError && (
                <div className="error-message">{adminError}</div>
              )}
              {sortedBooks.length > 0 ? (
                sortedBooks.map((book) => (
                  <div key={book.book_id || book.id} style={{ position: 'relative' }}>
                    <BookCard
                      descuento={null}
                      img={getBookImage(book, API_URL)}
                      titulo={book.title || book.titulo || 'Sin título'}
                      autor={getBookAuthor(book)}
                      precio={book.price || book.precio}
                      favorito={false}
                      onToggleFavorito={() => {}}
                      onBuy={() => {}}
                      book_id={book.book_id || book.id}
                      isAdmin={user?.role === 'admin'}
                    />

                  </div>
                ))
              ) : (
                <div className="no-books">
                  <p>No hay libros disponibles.</p>
                  <Link to="/search" className="add-book-link">
                    Agregar libros
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Comprar; 