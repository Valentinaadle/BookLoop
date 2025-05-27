import React from 'react';
import { Link } from 'react-router-dom';
import '../Assets/css/bookcard.css'; // Importa el archivo CSS

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BookCard = ({ book, onClick }) => {
  let imageUrl = '/placeholder-book.png';
  if (book.Images && Array.isArray(book.Images) && book.Images.length > 0 && book.Images[0].image_url) {
    imageUrl = book.Images[0].image_url.startsWith('http')
      ? book.Images[0].image_url
      : `${API_URL}${book.Images[0].image_url}`;
  } else if (book.imageUrl) {
    imageUrl = book.imageUrl.startsWith('http')
      ? book.imageUrl
      : `${API_URL}${book.imageUrl}`;
  }
  const descuento = book.descuento || '-30%';

  return (
    <div className="book-card" style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', padding: '0', margin: '10px', width: '250px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Badge de descuento */}
      {descuento && (
        <span style={{ position: 'absolute', top: 12, left: 12, background: '#394B60', color: '#fff', borderRadius: '6px', padding: '4px 12px', fontWeight: 'bold', fontSize: '1rem', zIndex: 2 }}>{descuento}</span>
      )}
      {/* Ícono de favorito */}
      <button style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }} aria-label="Favorito">
        <span style={{ fontSize: '1.5rem', color: '#394B60' }}>&#9825;</span>
      </button>
      <Link to={`/book/${book.book_id || book.id}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={onClick}>
        <img src={imageUrl} alt={book.title} style={{ width: '90%', height: '270px', objectFit: 'cover', borderRadius: '8px', marginTop: '32px' }} onError={e => { e.target.src = '/placeholder-book.png'; }} />
        <div className="book-card-content" style={{ padding: '16px', textAlign: 'center', width: '100%' }}>
          <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem', margin: '10px 0 4px 0', color: '#333' }}>{book.title}</h3>
          <p style={{ color: '#666', fontSize: '0.95rem', margin: 0 }}>
            de {(() => {
              if (Array.isArray(book.authors)) {
                return book.authors.join(', ');
              } else if (typeof book.authors === 'string') {
                // Si es string tipo '["Autor"]' o '[Autor]'
                const str = book.authors.trim();
                if (str.startsWith('[') && str.endsWith(']')) {
                  try {
                    const parsed = JSON.parse(str);
                    if (Array.isArray(parsed)) {
                      return parsed.join(', ');
                    }
                  } catch {
                    // Si no es JSON válido, limpiar manualmente
                    return str.slice(1, -1).replace(/"/g, '').replace(/'/g, '');
                  }
                }
                return str;
              } else {
                return '';
              }
            })()}
          </p>
          <p style={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#394B60', margin: '12px 0 8px 0' }}>{book.price ? `€${parseFloat(book.price).toFixed(2)}` : 'Precio no disponible'}</p>
        </div>
      </Link>
      <button className="buy-button" style={{ background: '#394B60', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 0', width: '90%', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px' }}>
        <span style={{ fontSize: '1.2rem' }}>&#128722;</span> Comprar
      </button>
    </div>
  );
};

export default BookCard;