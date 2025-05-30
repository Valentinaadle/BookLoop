import React, { useState, useEffect } from 'react';
import '../Assets/css/BookSearch.css';
import BookCard from './BookCard';

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
          books.map((book) => {
            let imageUrl = null;
            if (book.Images && book.Images.length > 0 && book.Images[0].image_url) {
              imageUrl = book.Images[0].image_url.startsWith('http')
                ? book.Images[0].image_url
                : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${book.Images[0].image_url}`;
            } else if (book.imageUrl) {
              imageUrl = book.imageUrl.startsWith('http')
                ? book.imageUrl
                : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${book.imageUrl}`;
            } else if (book.imagen) {
              imageUrl = book.imagen.startsWith('http')
                ? book.imagen
                : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${book.imagen}`;
            } else if (book.volumeInfo && book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
              imageUrl = book.volumeInfo.imageLinks.thumbnail;
            } else {
              imageUrl = '/icono2.png';
            }
            return (
              <BookCard
                key={book.book_id || book.id}
                descuento={null}
                img={imageUrl}
                titulo={book.title || book.titulo || 'Sin título'}
                autor={(() => {
                  if (book.authors) {
                    if (Array.isArray(book.authors)) {
                      return book.authors.join(', ');
                    } else if (typeof book.authors === 'string') {
                      if (book.authors.trim().startsWith('[')) {
                        try {
                          const parsed = JSON.parse(book.authors);
                          if (Array.isArray(parsed)) {
                            return parsed.join(', ');
                          }
                        } catch {
                          // Si falla el parseo, sigue abajo
                        }
                      }
                      return book.authors;
                    }
                  } else if (book.autor) {
                    return book.autor;
                  } else {
                    return '';
                  }
                })()}
                precio={book.price || book.precio}
                favorito={false}
                onToggleFavorito={() => {}}
                onBuy={() => {}}
                book_id={book.book_id || book.id}
                onClick={() => onBookSelect(book)}
              />
            );
          })
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