import React from 'react';
import BookCard from './BookCard';
import { getBookImage } from '../utils/bookUtils';
import '../Assets/css/recomendaciones.css';

function Recomendados({ libros }) {
  return (
    <div className="recomendaciones">
      <div className="recomendaciones-grid">
        {libros.map(libro => {
          const imgUrl = getBookImage(libro);
          console.log('IMG URL:', imgUrl, 'LIBRO:', libro);
          return (
            <BookCard
              key={libro.book_id}
              {...libro}
              img={imgUrl}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Recomendados;