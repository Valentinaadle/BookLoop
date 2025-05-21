import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Assets/css/Books.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBook, setEditingBook] = useState(null);

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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Error al cargar los libros. Por favor, intenta de nuevo más tarde.');
      setBooks([]);
      setLoading(false);
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/${editingBook.id}`, {
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
        book.id === updatedBook.id ? updatedBook : book
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

        setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
      } catch (error) {
        console.error('Error deleting book:', error);
        setError('Error al eliminar el libro. Por favor, intenta de nuevo.');
      }
    }
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

  if (loading) {
    return <div className="loading">Cargando libros...</div>;
  }

  return (
    <div className="books-page">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}

      <div className="books-header">
        <h1>Mi Biblioteca</h1>
        <Link to="/search" className="add-book-button">
          Agregar Libros
        </Link>
      </div>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <img
              src={book.imageUrl || '/placeholder-book.png'}
              alt={book.title}
              className="book-cover"
              onError={(e) => {
                e.target.src = '/placeholder-book.png';
              }}
            />
            {editingBook?.id === book.id ? (
              <form onSubmit={handleUpdateBook} className="edit-form">
                <input
                  type="text"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ 
                    ...editingBook, 
                    title: e.target.value 
                  })}
                  required
                />
                <input
                  type="text"
                  value={Array.isArray(editingBook.authors) 
                    ? editingBook.authors.join(', ') 
                    : editingBook.authors}
                  onChange={(e) => setEditingBook({ 
                    ...editingBook, 
                    authors: e.target.value 
                  })}
                  required
                />
                <textarea
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({ 
                    ...editingBook, 
                    description: e.target.value 
                  })}
                />
                <div className="edit-buttons">
                  <button type="submit">Guardar</button>
                  <button 
                    type="button" 
                    onClick={() => setEditingBook(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="book-info">
                <h3 title={book.title}>{truncateText(book.title, 100)}</h3>
                <p>{Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}</p>
                <p className="book-price">{formatPrice(book.price)}</p>
                <div className="book-actions">
                  <Link 
                    to={`/book/${book.id}`} 
                    className="view-details-button"
                  >
                    Ver Detalles
                  </Link>
                  <button 
                    onClick={() => setEditingBook(book)}
                    className="edit-button"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(book.id)}
                    className="delete-button"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books; 