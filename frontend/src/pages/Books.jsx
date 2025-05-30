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

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const DEFAULT_BOOK_IMAGE = '/icono2.png';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
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

  const toggle = (key) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatPrice = (price) => {
    if (!price) return 'Precio no disponible';
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? 'Precio no disponible' : `€${numPrice.toFixed(2)}`;
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/${editingBook.book_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingBook,
          authors: typeof editingBook.authors === 'string' 
            ? editingBook.authors.split(',').map(author => author.trim())
            : editingBook.authors
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const updatedBook = await response.json();
      setBooks(prevBooks => prevBooks.map(book => 
        book.book_id === updatedBook.book_id ? updatedBook : book
      ));
      setEditingBook(null);
    } catch (error) {
      console.error('Error updating book:', error);
      setError('Error al actualizar el libro. Por favor, intenta de nuevo.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      try {
        setError(null);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        setBooks(prevBooks => prevBooks.filter(book => book.book_id !== id));
      } catch (error) {
        console.error('Error deleting book:', error);
        setError('Error al eliminar el libro. Por favor, intenta de nuevo.');
      }
    }
  };

  // Función para limpiar caracteres extraños al final del base64
  const cleanBase64 = (str) => {
    return typeof str === 'string' ? str.replace(/:1$/, '').trim() : str;
  };

  return (
    <>
      <Header />
      <main className="home-container">
        <aside className="sidebar">
          <h3 className="sidebar-title">Filtrar</h3>
          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("genero")}>Género <span>{collapsed.genero ? "-" : "+"}</span></div>
            <div className={`filter-options ${collapsed.genero ? "" : "collapsed"}`}>
              {["Novela", "Cuento", "Poesía", "Drama", "Ciencia ficción", "Fantasía", "Misterio", "Terror", "Romance", "Deportes", "Realistas", "Salud", "Tecnología"].map((genre) => (
                <label key={genre}>
                  <input type="checkbox" /> {genre}
                </label>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("idioma")}>Idioma <span>{collapsed.idioma ? "-" : "+"}</span></div>
            <div className={`filter-options ${collapsed.idioma ? "" : "collapsed"}`}>
              {["Español", "Inglés", "Francés"].map((lang) => (
                <label key={lang}>
                  <input type="checkbox" /> {lang}
                </label>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("estado")}>Estado <span>{collapsed.estado ? "-" : "+"}</span></div>
            <div className={`filter-options ${collapsed.estado ? "" : "collapsed"}`}>
              {["Nuevo","Como Nuevo","Buen Estado", "Usado"].map((state) => (
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
                books.map((book) => {
                  let imageUrl = (book.Images && book.Images.length > 0)
                    ? (book.Images[0].image_url.startsWith('http')
                        ? book.Images[0].image_url
                        : `${API_URL}${book.Images[0].image_url}`)
                    : (book.imageUrl || DEFAULT_BOOK_IMAGE);
                  // Simulación de descuento (puedes cambiar esto por un campo real)
                  const descuento = book.descuento || '-30%';
                  return (
                    <BookCard
                      key={book.book_id}
                      descuento={null}
                      img={imageUrl}
                      titulo={book.title}
                      autor={(() => {
                        if (Array.isArray(book.authors)) {
                          return book.authors.join(', ');
                        } else if (typeof book.authors === 'string') {
                          try {
                            const parsed = JSON.parse(book.authors);
                            if (Array.isArray(parsed)) {
                              return parsed.join(', ');
                            }
                            return parsed;
                          } catch {
                            return book.authors;
                          }
                        } else {
                          return '';
                        }
                      })()}
                      precio={book.price}
                      favorito={false}
                      onToggleFavorito={() => {}}
                      onBuy={() => {}}
                      book_id={book.book_id}
                    />
                  );
                })
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

export default Books; 