import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import "../Assets/css/home.css";
import "../Assets/css/header.css";
import "../Assets/css/footer.css";
import "../Assets/css/filtro.css";
import "../Assets/css/bookcard.css";
import BookCard from '../components/BookCard';
import { getBookImage, getBookAuthor } from '../utils/bookUtils';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const DEFAULT_BOOK_IMAGE = '/icono2.png';

const Comprar = () => {
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
      setBooks(Array.isArray(data) ? data : []);
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

  const filteredBooks = books.filter(book => {
    const price = book.precio || book.price;
    if (priceRange.min && price < parseFloat(priceRange.min)) return false;
    if (priceRange.max && price > parseFloat(priceRange.max)) return false;
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
              {[
                "Novela", "Cuento", "Poesía", "Drama", "Ciencia ficción", "Fantasía", "Misterio", "Terror", "Romance", "Deportes", "Realistas", "Salud", "Tecnología"
              ].map((genre) => (
                <label key={genre}>
                  <input type="checkbox" /> {genre}
                </label>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("idioma")}>Idioma <span>{collapsed.idioma ? "-" : "+"}</span></div>
            <div className={`filter-options ${collapsed.idioma ? "" : "collapsed"}`}>
              {[
                "Español", "Inglés", "Francés"
              ].map((lang) => (
                <label key={lang}>
                  <input type="checkbox" /> {lang}
                </label>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("estado")}>Estado <span>{collapsed.estado ? "-" : "+"}</span></div>
            <div className={`filter-options ${collapsed.estado ? "" : "collapsed"}`}>
              {[
                "Nuevo","Como Nuevo","Buen Estado", "Usado"
              ].map((state) => (
                <label key={state}>
                  <input type="checkbox" /> {state}
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
              {books.length > 0 ? (
                books.map((book) => (
                  <BookCard
                    key={book.book_id || book.id}
                    descuento={null}
                    img={getBookImage(book, API_URL)}
                    titulo={book.title || book.titulo || 'Sin título'}
                    autor={getBookAuthor(book)}
                    precio={book.price || book.precio}
                    favorito={false}
                    onToggleFavorito={() => {}}
                    onBuy={() => {}}
                    book_id={book.book_id || book.id}
                  />
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