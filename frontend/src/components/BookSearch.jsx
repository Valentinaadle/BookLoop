import React, { useState } from 'react';
import '../Assets/css/BookSearch.css';

const BookSearch = ({ onBookSelect }) => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchBooks = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      const data = await response.json();
      console.log('Datos recibidos:', data);
      setBooks(data);
    } catch (error) {
      console.error('Error searching books:', error);
      setError('Error al buscar libros. Por favor, intenta de nuevo.');
    }
    setLoading(false);
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
            <div key={book.googleBooksId} className="book-card" onClick={() => onBookSelect(book)}>
              <img
                src={book.imageUrl || '/placeholder-book.png'}
                alt={book.title}
                className="book-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-book.png';
                }}
              />
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{Array.isArray(book.authors) ? book.authors.join(', ') : book.author}</p>
                {book.description && (
                  <p className="book-description">
                    {book.description.substring(0, 150)}...
                  </p>
                )}
                <p className="book-price">{formatPrice(book.price)}</p>
              </div>
            </div>
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