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
const DESCUENTOS = ['-10%', '-20%', '-30%', '-40%', '-50%'];

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

  // Filtros
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);

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
  };

  // Función para limpiar caracteres extraños al final del base64
  const cleanBase64 = (str) => {
    return typeof str === 'string' ? str.replace(/:1$/, '').trim() : str;
  };

  // Función para filtrar libros según los filtros seleccionados
  function filteredBooks() {
    window.alert('filteredBooks ejecutada');
    books.forEach(book => {
      let bookGenre = '';
      if (book.categoria) {
        bookGenre = book.categoria;
      } else if (book.category && typeof book.category === 'object' && book.category.category_name) {
        bookGenre = book.category.category_name;
      } else if (book.category && typeof book.category === 'string') {
        bookGenre = book.category;
      } else if (book.genero) {
        bookGenre = book.genero;
      }
      bookGenre = bookGenre.toString().trim();
      console.log('[DEBUG libro]', {
        bookGenre,
        categoria: book.categoria,
        category: book.category,
        genero: book.genero
      });
    });
    return books.filter(book => {
      // Filtro por género/categoría
      if (selectedGenres.length > 0) {
        // Extraer el nombre de la categoría de todas las variantes posibles
        let bookGenre = '';
        if (book.categoria) {
          bookGenre = book.categoria;
        } else if (book.category && typeof book.category === 'object' && book.category.category_name) {
          bookGenre = book.category.category_name;
        } else if (book.category && typeof book.category === 'string') {
          bookGenre = book.category;
        } else if (book.genero) {
          bookGenre = book.genero;
        }
        bookGenre = bookGenre.toString().trim();
        // DEBUG: Mostrar el valor real que se compara SIEMPRE
        window.alert(`Comparando: libro='${bookGenre}' | filtros='${selectedGenres.join(", ")}'`);
        // Comparar normalizando a minúsculas y quitando espacios
        const normalizedSelected = selectedGenres.map(g => g.toLowerCase().trim());
        const normalizedBookGenre = bookGenre.toLowerCase().trim();
        if (!normalizedSelected.includes(normalizedBookGenre)) return false;
      }
      // Filtro por idioma
      if (selectedLanguages.length > 0) {
        const bookLang = (book.language || book.idioma || '').toString().trim();
        if (!selectedLanguages.includes(bookLang)) return false;
      }
      // Filtro por estado
      if (selectedStates.length > 0) {
        const bookState = (book.state || book.estado || '').toString().trim();
        if (!selectedStates.includes(bookState)) return false;
      }
      // Filtro por precio
      const price = parseFloat(book.price || book.precio || 0);
      if (priceRange.min && price < parseFloat(priceRange.min)) return false;
      if (priceRange.max && price > parseFloat(priceRange.max)) return false;
      return true;
    });
  }

  console.log('BOOKS EN RENDER', books);
  // ALERT DEBUG: Mostrar libros y filtros al renderizar
  window.alert(`Libros: ${books.length} | Géneros seleccionados: ${selectedGenres.join(', ')}`);
  return (
    <>
      <h1 style={{color:'red',background:'#fff',padding:'20px',zIndex:9999}}>ESTE ES EL BOOKS.JSX QUE ESTÁS VIENDO</h1>
      <Header />
      <main className="home-container">
        <aside className="sidebar">
          <h3 className="sidebar-title">Filtrar</h3>
          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("genero")}>Género <span>{collapsed.genero ? "-" : "+"}</span></div>
            <div className={`filter-options ${collapsed.genero ? "" : "collapsed"}`}>
              {[...new Set(books.map(book => (book.categoria || '').trim()).filter(Boolean))]
                .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
                .map((genre) => (
                  <label key={genre}>
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre)}
                      onChange={e => {
                        setSelectedGenres(prev =>
                          e.target.checked
                            ? [...prev, genre]
                            : prev.filter(g => g !== genre)
                        );
                      }}
                    /> {genre}
                  </label>
                ))}
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("idioma")}>Idioma <span>{collapsed.idioma ? "-" : "+"}</span></div>
            <div className={`filter-options ${collapsed.idioma ? "" : "collapsed"}`}>
              {["Español", "Inglés", "Francés"].map((lang) => (
                <label key={lang}>
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(lang)}
                    onChange={e => {
                      setSelectedLanguages(prev =>
                        e.target.checked
                          ? [...prev, lang]
                          : prev.filter(l => l !== lang)
                      );
                    }}
                  /> {lang}
                </label>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-header" onClick={() => toggle("estado")}>Estado <span>{collapsed.estado ? "-" : "+"}</span></div>
            <div className={`filter-options ${collapsed.estado ? "" : "collapsed"}`}>
              {["Nuevo","Como Nuevo","Buen Estado", "Usado"].map((state) => (
                <label key={state}>
                  <input
                    type="checkbox"
                    checked={selectedStates.includes(state)}
                    onChange={e => {
                      setSelectedStates(prev =>
                        e.target.checked
                          ? [...prev, state]
                          : prev.filter(s => s !== state)
                      );
                    }}
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
              {filteredBooks().length > 0 ? (
                filteredBooks().map((book, idx) => (
                  <div key={book.book_id || book.id} style={{border: '1px solid #ddd', marginBottom: '8px'}}>
                    {/* Debug visual: mostrar campos relevantes */}
                    <pre style={{fontSize:'11px',background:'#f5f5f5',padding:'4px',marginBottom:'2px'}}>
                      {JSON.stringify({
                        categoria: book.categoria,
                        category: book.category,
                        genero: book.genero,
                        selectedGenres,
                        filtroNormalizado: selectedGenres.map(g => g.toLowerCase().trim()),
                        categoriaNormalizada: (book.categoria || '').toLowerCase().trim(),
                        language: book.language,
                        idioma: book.idioma,
                        estado: book.estado,
                        state: book.state,
                        price: book.price,
                        precio: book.precio
                      }, null, 2)}
                    </pre>
                    <BookCard
                      descuento={DESCUENTOS[idx % DESCUENTOS.length]}
                      img={getBookImage(book, API_URL)}
                      titulo={book.title || book.titulo || 'Sin título'}
                      autor={getBookAuthor(book)}
                      precio={book.price || book.precio}
                      onBuy={() => {}}
                      book_id={book.book_id || book.id}
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

export default Books; 