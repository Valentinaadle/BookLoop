import React, { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import '../Assets/css/favoritos.css';

export default function Favoritos() {
  const { favorites } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab] = useState('libros');

  // Redirigir si no hay usuario autenticado
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="favoritos-bg">
        <main className="favoritos-container">
          <div className="favoritos-header">
            <div className="favoritos-header-text">
              <h1 className="favoritos-title">Tus Favoritos</h1>
              <p className="favoritos-subtitle">Tu colección personal de libros. Volve a visitarlos cuando quieras.</p>
            </div>
            {favorites.length > 0 && (
              <button className="agregar-favorito-btn" onClick={() => navigate('/comprar')}>
                Agregar más libros
              </button>
            )}
          </div>
          {favorites.length === 0 ? (
            <div className="favoritos-empty">
              <div className="favoritos-empty-text">No tienes libros favoritos aún.</div>
              <button className="agregar-favorito-btn" onClick={()=>navigate('/comprar')}>
                Agregar libro 
              </button>
            </div>
          ) : (
            <div className="favorites-grid">
              {favorites.map((book) => (
                <BookCard
                  key={book.book_id}
                  book_id={book.book_id}
                  titulo={book.title || book.titulo}
                  autor={book.autor}
                  precio={book.price || book.precio}
                  img={book.img}
                  favorito={true}
                />
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
} 