import React, { useState } from 'react';
import '../Assets/css/BookSearch.css';

const BookSearch = ({ onBookSelect }) => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchBooks = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      const data = await response.json();
      console.log('Datos recibidos:', data); // Para depuración
      setBooks(data.items || []);
    } catch (error) {
      console.error('Error searching books:', error);
      setError('Error al buscar libros. Por favor, intenta de nuevo.');
    }
    setLoading(false);
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
            <div key={book.id} className="book-card" onClick={() => onBookSelect(book.volumeInfo)}>
              <img
                src={book.volumeInfo?.imageLinks?.thumbnail || '/placeholder-book.png'}
                alt={book.volumeInfo?.title}
                className="book-cover"
              />
              <div className="book-info">
                <h3 className="book-title">{book.volumeInfo?.title}</h3>
                <p className="book-author">
                  {book.volumeInfo?.authors?.join(', ') || 'Autor desconocido'}
                </p>
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