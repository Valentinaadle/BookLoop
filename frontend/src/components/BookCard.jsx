import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../Assets/css/bookcard.css';
import { FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DEFAULT_BOOK_IMAGE = '/icono2.png';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BookCard = ({
  descuento,
  img,
  titulo,
  autor,
  precio,
  favorito,
  onToggleFavorito,
  onBuy,
  showFavorito = true,
  showComprar = true,
  book_id
}) => {
  const { user } = useAuth();
  const [isNotifying, setIsNotifying] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const navigate = useNavigate();

  const handleBuyClick = (e) => {
    e.stopPropagation();
    navigate(`/book/${book_id}`);
  };

  return (
    <div className="book-card" onClick={() => navigate(`/book/${book_id}`)} style={{cursor: 'pointer'}}>
      <div className="book-image-container">
        {descuento && <div className="discount-badge">{descuento}</div>}
        <button className="favorite-btn" tabIndex={-1} aria-label="Favorito"><FaRegHeart /></button>
        <img 
          src={img || DEFAULT_BOOK_IMAGE} 
          alt={titulo}
          onError={(e) => {
            e.target.src = DEFAULT_BOOK_IMAGE;
            e.target.onerror = null;
          }}
          className="book-image"
        />
      </div>
      <div className="book-info">
        <h3 className="book-title">{titulo}</h3>
        <p className="book-author">de {autor}</p>
        <div className="book-price-container">
          <span className="book-price">{precio && !isNaN(parseFloat(precio)) ? `$${parseFloat(precio).toFixed(2)}` : 'Precio no disponible'}</span>
        </div>
        <div className="book-actions">
          <button 
            className="buy-button"
            onClick={handleBuyClick}
          >
            <FaShoppingCart style={{ marginRight: '8px' }} />
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;