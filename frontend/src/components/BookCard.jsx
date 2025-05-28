import React from 'react';
import '../Assets/css/bookcard.css';
import { FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';

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
}) => (
  <div className="product-card">
    {descuento && <span className="discount">{descuento}</span>}
    {showFavorito && (
      <button
        className="favorite-btn"
        onClick={onToggleFavorito}
        aria-label="Agregar a favoritos"
      >
        {favorito ? <FaHeart /> : <FaRegHeart />}
      </button>
    )}
    <img src={img} alt={titulo} />
    <h3>{titulo}</h3>
    <p>de {autor}</p>
    {precio && (
      <div className="book-price">
        <span className="price">${precio}</span>
        {showComprar && (
          <button className="buy-btn" onClick={onBuy}>
            <FaShoppingCart /> Comprar
          </button>
        )}
      </div>
    )}
  </div>
);

export default BookCard;