import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Assets/css/Books.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books`);
      const data = await response.json();
      setBooks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setBooks(books.filter(book => book.id !== id));
        }
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando libros...</div>;
  }

  return (
    <div className="books-page">
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
              src={book.imageLinks?.thumbnail || '/placeholder-book.png'}
              alt={book.title}
              className="book-cover"
            />
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">{book.authors?.join(', ')}</p>
              <button
                onClick={() => handleDelete(book.id)}
                className="delete-button"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books; 