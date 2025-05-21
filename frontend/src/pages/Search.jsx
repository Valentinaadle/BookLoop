import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookSearch from '../components/BookSearch';
import '../Assets/css/Search.css';

const Search = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleBookSelect = async (book) => {
    try {
      setError(null);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleBooksId: book.googleBooksId
        }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el libro');
      }

      const addedBook = await response.json();
      console.log('Libro agregado:', addedBook);
      
      navigate('/books');
    } catch (error) {
      console.error('Error:', error);
      setError('Error al agregar el libro. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="search-page">
      <h1>Buscar Libros</h1>
      <p className="search-description">
        Busca libros por título, autor o ISBN y agrégalos a tu biblioteca
      </p>
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}
      <BookSearch onBookSelect={handleBookSelect} />
    </div>
  );
};

export default Search; 