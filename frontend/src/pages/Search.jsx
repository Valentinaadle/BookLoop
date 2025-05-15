import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookSearch from '../components/BookSearch';
import '../Assets/css/Search.css';

const Search = () => {
  const navigate = useNavigate();

  const handleBookSelect = async (book) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
      });

      if (response.ok) {
        navigate('/books');
      } else {
        console.error('Error adding book');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="search-page">
      <h1>Buscar Libros</h1>
      <p className="search-description">
        Busca libros por título, autor o ISBN y agrégalos a tu biblioteca
      </p>
      <BookSearch onBookSelect={handleBookSelect} />
    </div>
  );
};

export default Search; 