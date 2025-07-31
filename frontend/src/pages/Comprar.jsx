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
            <div style={{ 
              marginBottom: '25px',
              paddingBottom: '15px',
              borderBottom: '2px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
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
                {categories.map(category => (
                  <label 
                    key={category.category_id} 
                    style={{ 
                      display: 'block', 
                      marginBottom: '8px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    <input 
                      type="checkbox"
                      checked={selectedGenres.includes(category.category_name)}
                      onChange={() => handleGenreChange(category.category_name)}
                      style={{ marginRight: '10px', cursor: 'pointer' }} 
                    />
                    {category.category_name}
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro de Idioma */}
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
                {Object.values(languageMap).map(lang => (
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

            {/* Filtro de Estado */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                margin: '0 0 15px 0', 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: '#555'
              }}>
                Estado
              </h3>
              <div style={{ 
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                padding: '10px'
              }}>
                {["Nuevo", "Como Nuevo", "Buen Estado", "Aceptable", ].map(condition => (
                  <label 
                    key={condition} 
                    style={{ 
                      display: 'block', 
                      marginBottom: '8px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    <input 
                      type="checkbox"
                      checked={selectedConditions.includes(condition)}
                      onChange={() => handleConditionChange(condition)}
                      style={{ marginRight: '10px', cursor: 'pointer' }} 
                    />
                    {condition}
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro de Precio */}
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
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
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
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
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
                  setShowMobileFilters(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#353b5fff',
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

      <main className="home-container">
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
          <div className="sort-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            {/* BOTÓN FILTROS MÓVIL */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="block lg:hidden filter-sort-button"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--primary-color, #000000)',
                border: '1px solid var(--primary-color, #000000)',
                borderRadius: '20px',
                padding: '0.5rem 1rem',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.07)',
                transition: 'all 0.2s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
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
            
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select filter-sort-button">
              <option value="default">Ordenar por</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="most-sold">Recien ingresados </option>
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