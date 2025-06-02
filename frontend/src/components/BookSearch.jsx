import React, { useState, useEffect } from 'react';
import '../Assets/css/BookSearch.css';
import BookCard from './BookCard';
import { getBookImage, getBookAuthor } from '../utils/bookUtils';

const BookSearch = ({ onBookSelect, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery);
      buscar(initialQuery);
    } else if (initialQuery && books.length === 0) {
      buscar(initialQuery);
    }
    // eslint-disable-next-line
  }, [initialQuery]);

  const buscar = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/search-db?query=${encodeURIComponent(q)}`);
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      setError('Error al buscar libros. Por favor, intenta de nuevo.');
    }
    setLoading(false);
  };

  const searchBooks = async (e) => {
    e.preventDefault();
    buscar(query);
  };

  const formatPrice = (price) => {
    if (!price) return '€99.99';
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? '€99.99' : `€${numPrice.toFixed(2)}`;
  };

  return (
    <div className="book-search">
      <form onSubmit={searchBooks} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar libros..."
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Buscando libros...</div>}

      <div className="books-grid">
        {books && books.length > 0 ? (
          books.map((book) => (
            <BookCard
              key={book.book_id || book.id}
              descuento={null}
              img={getBookImage(book, process.env.REACT_APP_API_URL || 'http://localhost:5000')}
              titulo={book.title || book.titulo || 'Sin título'}
              autor={getBookAuthor(book)}
              precio={book.price || book.precio}
              onBuy={() => {}}
              book_id={book.book_id || book.id}
              onClick={() => onBookSelect(book)}
            />
          ))
        ) : !loading && (
          <div className="no-results">
            {query ? 'No se encontraron libros' : 'Ingresa un término de búsqueda'}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSearch; 