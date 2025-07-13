import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeButton from './ThemeButton';
import '../Assets/css/SearchModal.css';
import '../Assets/css/header.css';
import { FaSignOutAlt, FaHeart, FaSearch } from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";

export default function Header() {
  const [logoSrc, setLogoSrc] = useState(window.innerWidth <= 700 ? '/logo-solo.png' : '/4.png');
  React.useEffect(() => {
    const handleResize = () => {
      setLogoSrc(window.innerWidth <= 480 ? '/logo-solo.png' : '/4.png');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isAdmin = user && user.role === 'admin';

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

  const renderProfilePicture = () => {
    if (user && user.profile && user.profile.profileImage) {
      return <img src={`${process.env.REACT_APP_API_URL}/${user.profile.profileImage}`} alt="Perfil" className="profile-pic" />;
    }
    return <CgProfile className="icon action-icon" />;
  };

  return (
    <header className="modern-header">
      <div className="header-content">
        <div className="logo-and-nav">
          <div className="logo">
            <Link to="/">
              <img src={logoSrc} className="icon logo-icon" alt="icon" />
            </Link>
          </div>
          <nav className="header-nav">
            <ul className="nav-links">
                <li><Link to="/vender-page">Quiero vender</Link></li>
                <li><Link to="/comprar">Quiero comprar</Link></li>
                <li><Link to="/nosotros">Sobre Nosotros</Link></li>
            </ul>
          </nav>
        </div>

        <div className="search-container">
          <form className="search-bar" onSubmit={handleSearch} style={{position:'relative', width:'100%'}}>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar libros..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="search-icon-btn"
            style={{position:'absolute', right:'8px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', padding:0, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}
            aria-label="Buscar"
          >
            <FaSearch style={{fontSize:'18px', color:'#888'}} />
          </button>
        </form>
        </div>

        <div className="header-actions">
          <div className="user-actions">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <Link to="/favoritos" title="Favoritos" className="action-link">
                    <FaHeart className="icon action-icon" />
                  </Link>
                )}
                <Link to="/profile" title="Perfil" className="action-link profile-link">
                   {renderProfilePicture()}
                </Link>
                <button onClick={logout} className="logout-btn" title="Cerrar Sesión">
                  <FaSignOutAlt className="icon action-icon" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="login-button">Iniciar sesión</Link>
                <Link to="/register" className="register-button">Registrarse</Link>
              </>
            )}
             <ThemeButton />
          </div>
        </div>
      </div>
    </header>
  );
}
