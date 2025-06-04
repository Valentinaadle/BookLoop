import React from 'react';
import BookCard from './BookCard';
import '../Assets/css/recomendaciones.css';

function Recomendados({ libros }) {
  return (
    <div className="recomendaciones">
      <div className="recomendaciones-grid">
        {libros.map(libro => (
          <BookCard key={libro.book_id} {...libro} />
        ))}
      </div>
    </div>
  );
}

export default Recomendados; 