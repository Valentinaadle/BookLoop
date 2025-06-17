import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import '../Assets/css/bookcard.css';
import { FaShoppingCart, FaEdit, FaTrash } from 'react-icons/fa';
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
  book_id,
  isAdmin = false,
  onDelete
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    const bookData = {
      book_id,
      title: titulo,
      authors: autor,
      price: precio,
      imageUrl: img
    };

    try {
      if (isBookFavorite) {
        setShowConfirmModal(true);
        setIsLoading(false);
        return;
      } else {
        const success = await addFavorite(bookData);
        if (success) {
          setIsBookFavorite(true);
        }
      }
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRemove = async (e) => {
    e.stopPropagation();
    try {
      await removeFavorite(book_id);
      setIsBookFavorite(false);
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
    }
  };

  const handleCancelRemove = (e) => {
    e.stopPropagation();
    setShowConfirmModal(false);
  };

  const handleBookClick = () => {
    navigate(`/book/${book_id}`);
  };

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <>
      <div 
        className="book-card" 
        onClick={handleBookClick} 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: 'pointer',
          transition: 'transform 0.3s ease'
        }}
      >
        <div className="book-image-container">
          {descuento && <div className="discount-badge">{`-${descuento}%`}</div>}
<<<<<<< HEAD
          
          {showFavorito && !isAdmin && (
            <button
              className={`favorite-btn ${isBookFavorite ? 'filled' : ''}`}
              onClick={handleFavoriteClick}
              disabled={isLoading}
              aria-label={isBookFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              {isBookFavorite ? <AiFillHeart className="heart-icon filled" /> : <AiOutlineHeart className="heart-icon" />}
            </button>
          )}
=======
          {/* Wishlist solo para usuarios no admin */}
{!isAdmin && showFavorito && (
  <button
    className="wishlist-button"
    title={isBookFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    onClick={handleFavoriteClick}
    aria-label={isBookFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    style={{
      background: '#fff',
      border: 'none',
      position: 'absolute',
      top: 8,
      right: 0,
      zIndex: 2,
      cursor: 'pointer',
      fontSize: 26,
      color: isBookFavorite ? '#e63946' : '#2c3e50',
      padding: 4,
      borderRadius: '50%',
      boxShadow: '0 2px 6px rgba(0,0,0,0.13)',
      outline: 'none',
      transition: 'color 0.2s, background 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: 1
    }}
    disabled={isLoading}
  >
    {isBookFavorite ? <AiFillHeart style={{ fontSize: 21 }} /> : <AiOutlineHeart style={{ fontSize: 21 }} />}
  </button>
)}
>>>>>>> 291fd177541118c3da05db8d3c6897d791a869e7

          {/* Icono de admin en la esquina superior derecha */}
          {isAdmin && book_id && (
  <div className="admin-icon-top-right" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button
        title="Editar libro"
        onClick={() => window.location.href = `http://localhost:3000/edit-book/${book_id}`}
        aria-label="Editar libro"
        style={{
          background: '#fff',
          color: '#2c3e50',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.13)',
          padding: 0,
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2c3e50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"></path></svg>
    </button>
      <button
        title="Borrar libro"
        onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }}
        aria-label="Borrar libro"
        style={{
          background: '#fff',
          color: '#2c3e50',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.13)',
          padding: 0,
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2c3e50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
    </button>
    {showDeleteModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>¿Seguro que deseas borrar este libro?</h3>
          <div className="modal-actions">
            <button className="modal-button cancel" onClick={(e) => { e.stopPropagation(); setShowDeleteModal(false); }}>Cancelar</button>
            <button className="modal-button confirm" onClick={(e) => { e.stopPropagation(); setShowDeleteModal(false); onDelete && onDelete(e); }}>Borrar</button>
          </div>
        </div>
      </div>
    )}
  </div>
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
          <p className="book-author">de {Array.isArray(autor) ? autor.join(', ') : (typeof autor === 'string' ? autor.replace(/^[\[\]"]+|[\[\]"]+$/g, '') : autor)}</p>
          <div className="book-price-container">
            <span className="book-price">{precio && !isNaN(parseFloat(precio)) ? `$${parseFloat(precio).toFixed(2)}` : 'Precio no disponible'}</span>
          </div>
          {showComprar && (
            <div className="book-actions">
              <button 
                className="buy-button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/book/${book_id}`);
                }}
              >
                {isAdmin ? 'Ver detalles' : (<><FaShoppingCart style={{ marginRight: '8px' }} />Comprar</>)}
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