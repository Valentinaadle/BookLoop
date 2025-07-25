import { Link } from 'react-router-dom';
import { Book, Facebook, Twitter, Instagram, BookOpen } from 'lucide-react'; // Usando lucide-react para íconos

export default function Footer() {
  return (
    <footer className="dark-minimalist-footer">
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* Columna de la marca */}
          <div className="footer-brand">
            <div>
              <Link to="/" className="brand-logo">
                <BookOpen />
                <h3>Bookloop</h3>
              </Link>
              <p className="brand-description">
                Conectando lectores en Argentina. Compra, vende y descubre tu próximo libro favorito.
              </p>
            </div>
            <div className="social-links">
              <a href="#" aria-label="Facebook" className="social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" aria-label="Twitter" className="social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
          </div>

          {/* Columna de Explorar */}
          <div className="footer-section">
            <h4>Explorar</h4>
            <div className="footer-links">
              <Link to="/comprar">Buscar Libros</Link>
              <Link to="/vender-page">Vender Libro</Link>
              <Link to="/favoritos">Mis Favoritos</Link>
              <Link to="/profile">Mi Perfil</Link>
            </div>
          </div>

          {/* Columna de Categorías */}
          <div className="footer-section">
            <h4>Categorías Destacadas</h4>
            <div className="footer-links">
              <Link to="/comprar?genero=Terror">Terror</Link>
              <Link to="/comprar?genero=Romance">Romance</Link>
              <Link to="/comprar?genero=Drama">Drama</Link>
              <Link to="/comprar?genero=Salud">Salud</Link>
            </div>
          </div>
          
          {/* Columna de Ayuda */}
          <div className="footer-section">
            <h4>Ayuda</h4>
            <div className="footer-links">
              <Link to="/preguntas">Preguntas Frecuentes</Link>
              <Link to="/nosotros">Sobre Nosotros</Link>
              <a href="mailto:itsbookloop@gmail.com">Contacto</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 BookLoop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
