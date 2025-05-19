import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import "../Assets/css/home.css";
import "../Assets/css/header.css";
import "../Assets/css/footer.css";
import "../Assets/css/filtro.css";
import "../Assets/css/bookcard.css";

const Home = () => {
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

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setError(null);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Error al cargar los libros. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const toggle = (key) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <>
      <Header />
      <main className="home-container">
        <aside className="sidebar">
          <h3 className="sidebar-title">Filtrar</h3>
          
          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("genero")}>
              Género <span>{collapsed.genero ? "-" : "+"}</span>
            </div>
            <div className={`filter-options ${collapsed.genero ? "" : "collapsed"}`}>
              {[
                "Novela", "Cuento", "Poesía", "Drama", "Ciencia ficción",
                "Fantasía", "Misterio", "Terror", "Romance", "Deportes",
                "Realistas", "Salud", "Tecnología"
              ].map((genre) => (
                <label key={genre}>
                  <input type="checkbox" /> {genre}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("idioma")}>
              Idioma <span>{collapsed.idioma ? "-" : "+"}</span>
            </div>
            <div className={`filter-options ${collapsed.idioma ? "" : "collapsed"}`}>
              {["Español", "Inglés", "Francés"].map((lang) => (
                <label key={lang}>
                  <input type="checkbox" /> {lang}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("estado")}>
              Estado <span>{collapsed.estado ? "-" : "+"}</span>
            </div>
            <div className={`filter-options ${collapsed.estado ? "" : "collapsed"}`}>
              {["Nuevo", "Usado"].map((state) => (
                <label key={state}>
                  <input type="checkbox" /> {state}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("precio")}>
              Rango de Precio <span>{collapsed.precio ? "-" : "+"}</span>
            </div>
            <div className={`filter-options ${collapsed.precio ? "" : "collapsed"}`}>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Desde"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                />
                <input
                  type="number"
                  placeholder="Hasta"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </aside>

        <section className="main-content">
          <div className="sort-container">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
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
              {books.length > 0 ? (
                books.map((book) => (
                  <div key={book.id} className="book-card">
                    <Link to="/bookdetails" state={{ book }}>
                      <img
                        src={book.imageLinks?.thumbnail || '/placeholder-book.png'}
                        alt={book.title}
                        onError={(e) => {
                          e.target.src = '/placeholder-book.png';
                        }}
                      />
                      <div className="book-card-content">
                        <h3 title={book.title}>{truncateText(book.title, 70)}</h3>
                        <p>{Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}</p>
                        <div className="price-container">
                          <span className="price">$99.99</span>
                          <button className="buy-button">Comprar</button>
                        </div>
                      </div>
                    </Link>
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

export default Home;
