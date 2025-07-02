import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BookSearch from '../components/BookSearch';
import Header from '../components/Header';
import '../Assets/css/Search.css';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [initialQuery, setInitialQuery] = useState('');

  // Leer el query de la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setInitialQuery(q);
  }, [location.search]);

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
    <>
      <Header />
      <div className="search-page">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)} className="close-error">×</button>
          </div>
        )}
        <BookSearch onBookSelect={handleBookSelect} initialQuery={initialQuery} />
      </div>
    </>
  );
};

export default Search; 