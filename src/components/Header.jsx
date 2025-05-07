import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <div className="header-top">
        <div className="logo">
          
          <Link to="/"><img src="/icons/libro.png" className="icon" alt="icon" /></Link>
          <Link to="/"><h1>BOOKLOOP</h1></Link>
        </div>
        <div className="search-bar">
          <i className="fa fa-search">
            <img src="/icons/lupa.png" className="icon" alt="Buscar" />
          </i>
          <input type="text" placeholder="Buscar libros..." />
        </div>
        <div className="header-actions">
          <div className="user-actions">
            <Link to="/profile"><img src="/icons/usuario.png" className="icon" alt="usuario" /></Link>
            <Link to="#"><img src="/icons/carrito.png" className="icon" alt="Cart" /></Link>
          </div>
        </div>
      </div>
      <div className="header-bottom">
        <nav>
          <ul className="nav-links">
            <li><Link to="#">Categorias</Link></li>
            <li><Link to="#">Recomendados</Link></li>
            <li><Link to="#">Como vender</Link></li>
            <li><Link to="/bookDetails">Código ISBN</Link></li>
            <li><Link to="/register">Registrarse</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
