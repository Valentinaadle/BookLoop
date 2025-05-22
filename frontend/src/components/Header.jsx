import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Assets/css/SearchModal.css';

export default function Header() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    const value = e.target.value;
    setQuery(value);
    setShowModal(value.length > 0);
    searchBooks(value);
  };

  const handleBookClick = (book) => {
    // Aquí puedes manejar la navegación al detalle del libro
    setShowModal(false);
    setQuery('');
    navigate('/bookdetails', { state: { book } });
  };

  return (
    <header>
      <div className="header-top">
        <div className="logo">
          <Link to="/"><img src="/icons/icono.png" className="icon" alt="icon" /></Link>

          <Link to="/"><h1>BOOKLOOP</h1></Link>
        </div>
        <div className="search-bar">
          <i className="fa fa-search">
            <img src="/icons/lupa.png" className="icon" alt="Buscar" />
          </i>
          <input 
            type="text" 
            placeholder="Buscar libros..." 
            value={query}
            onChange={handleInputChange}
          />
          {showModal && (
            <div className="search-modal">
              {loading ? (
                <div className="loading">Buscando...</div>
              ) : books.length > 0 ? (
                <div className="search-results">
                  {books.map((book) => (
                    <div 
                      key={book.id} 
                      className="search-result-item"
                      onClick={() => handleBookClick(book)}
                    >
                      <img 
                        src={book.volumeInfo?.imageLinks?.thumbnail || '/placeholder-book.png'} 
                        alt={book.volumeInfo?.title}
                        className="result-book-cover"
                      />
                      <div className="result-book-info">
                        <h4>{book.volumeInfo?.title}</h4>
                        <p>{book.volumeInfo?.authors?.join(', ') || 'Autor desconocido'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  {query ? 'No se encontraron libros' : 'Ingresa un término de búsqueda'}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="header-actions">
          <div className="user-actions">
            <Link to="favoritos"><img src="/icons/favorito.png" className="icon" alt="favorito"/></Link>
            <Link to="/profile"><img src="/icons/usuario.png" className="icon" alt="usuario" /></Link>
            <Link to="#"><img src="/icons/carrito.png" className="icon" alt="Cart" /></Link>
          </div>
        </div>
      </div>
      <div className="header-bottom">
        <nav>
          <ul className="nav-links">
            <li><Link to="/home">Inicio</Link></li>
            <li><Link to="/vender-page">Quiero vender</Link></li>
            <li><Link to="/">Quiero comprar</Link></li>
            <li><Link to="/register">Registrarse</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
