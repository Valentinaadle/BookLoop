import React, { useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import '../Assets/css/bookcard.css';
import { FaShoppingCart, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

const DEFAULT_BOOK_IMAGE = '/Assets/images/default-book.png';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BookCard = ({
  descuento,
  img,
  titulo,
  autor,
  precio,
  showFavorito = true,
  showComprar = true,
  showVerDetalles = false,
  book_id,
  isAdmin = false,
  onDelete,
  status,
  onMarkAsSold,
  markAsSoldLoading,
  onCardClick // <- nueva prop opcional
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'add' | 'remove'
  const [isBookFavorite, setIsBookFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (user && book_id) {
        const result = await isFavorite(book_id);
        setIsBookFavorite(result);
      }
    };
    checkFavorite();
  }, [user, book_id, isFavorite]);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (isLoading) return;
    setConfirmAction(isBookFavorite ? 'remove' : 'add');
    setShowConfirmModal(true);
  };

  const handleConfirmFavorite = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    const bookData = {
      book_id,
      title: titulo,
      authors: autor,
      price: precio,
      imageUrl: img
    };
    try {
      if (confirmAction === 'remove') {
        await removeFavorite(book_id);
        setIsBookFavorite(false);
      } else if (confirmAction === 'add') {
        const success = await addFavorite(bookData);
        if (success) {
          setIsBookFavorite(true);
        }
      }
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
    } finally {
      setIsLoading(false);
      setConfirmAction(null);
    }
  };

  const handleBookClick = () => {
    navigate(`/book/${book_id}`);
  };

  return (
    <>
      <div 
        className="book-card" 
        onClick={typeof onCardClick === 'function' ? onCardClick : handleBookClick} 
      >
        <div className="book-image-container modern">
          {/* Ícono de favorito flotante en la esquina superior derecha */}
          {showFavorito && !isAdmin && (
            <button
              className={`favorite-btn-modern ${isBookFavorite ? 'filled' : ''}`}
              onClick={handleFavoriteClick}
              disabled={isLoading}
              aria-label={isBookFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
              style={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}
            >
              {isBookFavorite ? <AiFillHeart className="heart-icon filled" /> : <AiOutlineHeart className="heart-icon" />}
            </button>
          )}

          <img 
            src={img || DEFAULT_BOOK_IMAGE} 
            alt={titulo}
            onError={(e) => {
              e.target.src = DEFAULT_BOOK_IMAGE;
              e.target.onerror = null;
            }}
            className="book-image-modern"
          />
        </div>
        <div className="book-info-modern">
          <h3 className="book-title-modern">{titulo}</h3>
          {autor && autor !== 'Autor desconocido' ? (
            <p className="book-author-modern">de {autor}</p>
          ) : null}
          <div className="book-price-container-modern">
            <span className="book-price-modern">{precio && !isNaN(parseFloat(precio)) ? `$${Number(precio).toLocaleString('es-AR')}` : 'Precio no disponible'}</span>
          </div>
          {showComprar && !showVerDetalles && (
            <div className="book-actions-modern">
              <button 
                className="buy-button-modern"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/book/${book_id}`);
                }}
              >
                <FaShoppingCart style={{ marginRight: '8px' }} />Comprar
              </button>
            </div>
          )}
          {showVerDetalles && (
            <div className="book-actions-modern">
              <button
                className="buy-button-modern ver-detalles-button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/book/${book_id}`);
                }}
              >
                <FaEye style={{ marginRight: '8px' }} />Ver Detalles
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Modal de confirmación para favoritos */}
      <ConfirmModal
        open={showConfirmModal}
        title={confirmAction === 'remove' ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        message={confirmAction === 'remove'
          ? '¿Seguro que quieres quitar este libro de tus favoritos?'
          : '¿Seguro que quieres agregar este libro a tus favoritos?'}
        onCancel={() => { setShowConfirmModal(false); setConfirmAction(null); }}
        onConfirm={handleConfirmFavorite}
        confirmButtonText={confirmAction === 'remove' ? 'Sí, quitar' : 'Sí, agregar'}
      />
    </>
  );
};

export default BookCard;