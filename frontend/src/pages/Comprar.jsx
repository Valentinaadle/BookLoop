import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import "../Assets/css/home.css";
import "../Assets/css/header.css";
import "../Assets/css/footer.css";
import "../Assets/css/filtro.css";
import "../Assets/css/bookcard.css";
import BookCard from '../components/BookCard';
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

  // Mapeo de códigos de idioma a nombres completos
  const languageMap = {
    'en': 'Inglés',
    'es': 'Español',
    'fr': 'Francés',
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
      <main className="home-container">
        <aside className="sidebar">
          <h3 className="sidebar-title">Filtrar</h3>
          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("genero")}>Género <span>{collapsed.genero ? "-" : "+"}</span></div>
            <div className={`filter-options ${collapsed.genero ? "" : "collapsed"}`}>
              {categories.map((category) => (
                <label key={category.category_id}>
                  <input
                    type="checkbox"
                    value={category.category_name}
                    onChange={() => handleGenreChange(category.category_name)}
                    checked={selectedGenres.includes(category.category_name)}
                  /> {category.category_name}
                </label>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("idioma")}>Idioma <span>{collapsed.idioma ? "-" : "+"}</span></div>
            <div className={`filter-options ${collapsed.idioma ? "" : "collapsed"}`}>
              {Object.keys(languageMap).map((langCode) => (
                <label key={langCode}>
                  <input
                    type="checkbox"
                    value={languageMap[langCode]}
                    onChange={() => handleLanguageChange(languageMap[langCode])}
                    checked={selectedLanguages.includes(languageMap[langCode])}
                  /> {languageMap[langCode]}
                </label>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("estado")}>Estado <span>{collapsed.estado ? "-" : "+"}</span></div>
            <div className={`filter-options ${collapsed.estado ? "" : "collapsed"}`}>
              {[
                "Nuevo", "Como Nuevo", "Buen Estado", "Usado", "Aceptable", "Muy bueno"
              ].map((state) => (
                <label key={state}>
                  <input
                    type="checkbox"
                    value={state}
                    onChange={() => handleConditionChange(state)}
                    checked={selectedConditions.includes(state)}
                  /> {state}
                </label>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("precio")}>Rango de Precio <span>{collapsed.precio ? "-" : "+"}</span></div>
            <div className={`filter-options ${collapsed.precio ? "" : "collapsed"}`}>
              <div className="price-range">
                <input type="number" placeholder="Desde" value={priceRange.min} onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))} />
                <input type="number" placeholder="Hasta" value={priceRange.max} onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))} />
              </div>
            </div>
          </div>
        </aside>
        <section className="main-content">
          <div className="sort-container">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="default">Ordenar por</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="most-sold">Más vendidos</option>
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