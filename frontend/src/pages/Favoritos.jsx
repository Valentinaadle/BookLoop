import React from 'react';
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
      <main className="favoritos-container">
        <h1>Mis Libros Favoritos</h1>
        {favorites.length === 0 ? (
          <div className="no-favorites">
            <p>No tienes libros favoritos aún.</p>
            <button onClick={() => navigate('/comprar')} className="explore-button">
              Explorar libros
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
      <Footer />
    </>
  );
} 