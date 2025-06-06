import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
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
  showFavorito = true,
  showComprar = true,
  book_id
}) => {
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isBookFavorite, setIsBookFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (user && book_id) {
        const result = await isFavorite(book_id);
        setIsBookFavorite(result);
      }
    };
    checkFavorite();
  }, [user, book_id, isFavorite]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    const bookData = {
      book_id,
      title: titulo,
      autor,
      price: precio,
      img
    };

    // Si estamos en la página de favoritos y vamos a quitar un favorito
    if (location.pathname === '/favoritos' && isBookFavorite) {
      setShowConfirmModal(true);
    } else {
      if (isBookFavorite) {
        await removeFavorite(book_id);
        setIsBookFavorite(false);
      } else {
        await addFavorite(bookData);
        setIsBookFavorite(true);
      }
    }
  };

  const handleConfirmRemove = async (e) => {
    e.stopPropagation();
    await removeFavorite(book_id);
    setIsBookFavorite(false);
    setShowConfirmModal(false);
  };

  const handleCancelRemove = (e) => {
    e.stopPropagation();
    setShowConfirmModal(false);
  };

  const handleBuyClick = (e) => {
    e.stopPropagation();
    navigate(`/book/${book_id}`);
  };

  return (
    <>
      <div className="book-card" onClick={() => navigate(`/book/${book_id}`)} style={{cursor: 'pointer'}}>
        <div className="book-image-container">
          {descuento && <div className="discount-badge">{descuento}</div>}
          {showFavorito && (
            <button 
              className="favorite-btn" 
              onClick={handleFavoriteClick}
              tabIndex={-1} 
              aria-label="Favorito"
            >
              {isBookFavorite ? <FaHeart color="#e74c3c" /> : <FaRegHeart />}
            </button>
          )}
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
          {showComprar && (
            <div className="book-actions">
              <button 
                className="buy-button"
                onClick={handleBuyClick}
              >
                <FaShoppingCart style={{ marginRight: '8px' }} />
                Ver detalles
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={handleCancelRemove}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>¿Quitar de favoritos?</h3>
            <p>¿Estás seguro de que deseas quitar "{titulo}" de tus favoritos?</p>
            <div className="modal-actions">
              <button className="modal-button cancel" onClick={handleCancelRemove}>
                Cancelar
              </button>
              <button className="modal-button confirm" onClick={handleConfirmRemove}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookCard;