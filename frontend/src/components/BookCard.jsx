import React from 'react';
import '../Assets/css/portada.css';
import { FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (book_id) {
      navigate(`/book/${book_id}`);
    }
  };

  return (
    <div className="product-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      {descuento && <span className="discount">{descuento}</span>}
      {showFavorito && (
        <button
          className="favorite-btn"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorito();
          }}
          aria-label="Agregar a favoritos"
          type="button"
        >
          {favorito ? <FaHeart /> : <FaRegHeart />}
        </button>
      )}
      <img src={img} alt={titulo} />
      <h3>{titulo}</h3>
      <p>de {autor}</p>
      {precio && (
        <div className="book-price">
          <span className="price">${parseFloat(precio).toFixed(2)}</span>
          {showComprar && (
            <button 
              className="buy-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onBuy();
              }} 
              type="button"
            >
              <FaShoppingCart /> Comprar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookCard;