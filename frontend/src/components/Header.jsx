import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeButton from './ThemeButton';
import '../Assets/css/SearchModal.css';
import '../Assets/css/header.css';

export default function Header() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const searchBooks = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setBooks([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error('Error searching books:', error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleBookClick = (book) => {
    setShowModal(false);
    setQuery('');
    navigate('/bookdetails', { state: { book } });
  };

  return (
    <header>
      <div className="header-top improved-header-top">
        <div className="logo">
          <Link to="/">
            <img src="/icons/icono.png" className="icon logo-icon" alt="icon" />
            <h1>BOOKLOOP</h1>
          </Link>
        </div>
        <form className="search-bar improved-search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar libros..."
            value={query}
            onChange={handleInputChange}
          />
          <button type="submit" className="search-btn">
            <img src="/icons/lupa.png" alt="Buscar" className="search-icon" />
          </button>
        </form>
        <div className="header-actions improved-header-actions">
          <div className="user-actions improved-user-actions">
            {isAuthenticated ? (
              <>
                <Link to="/favoritos" title="Favoritos"><img src="/icons/favorito.png" className="icon action-icon" alt="favorito"/></Link>
                <Link to="/profile" title="Perfil"><img src="/icons/usuario.png" className="icon action-icon" alt="usuario" /></Link>
                <ThemeButton />
              </>
            ) : (
              <>
                <ThemeButton />
                <Link to="/login" className="login-button">Iniciar sesión</Link>
                <Link to="/register" className="register-button">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="header-bottom improved-header-bottom">
        <nav>
          <ul className="nav-links">
            {/* <li><Link to="/home">Inicio</Link></li> */}
            {isAuthenticated && (
              <>
                <li><Link to="/vender-page">Quiero vender</Link></li>
                <li><Link to="/comprar">Quiero comprar</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
