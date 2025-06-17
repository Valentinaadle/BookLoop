import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="footer-section">

        <div className="footer-box">
          <div className="footer-title">
            <img src="/icons/libroa.png" className="iconf" alt="Bookshop icon" />
            <h4>BOOKLOOP</h4>
          </div>
          <p>Tu plataforma confiable para comprar y vender libros usados. Conectamos lectores de todo el país.</p>
          
        </div>

        <div className="footer-box">
          <div className="footer-title">
            <img src="/icons/brujula.png" className="iconf" alt="Compass icon" />
            <h4>Contacto</h4>
          </div>
          <p>📍 Tucumán, Argentina</p>
          <p>Telefono: (+54) 3815699499</p>
          <p>Mail: itsbookloop@gmail.com</p>
        </div>

        <div className="footer-box">
          <div className="footer-title">
            <img src="/icons/lupa.png" className="iconf" alt="Social media icon" />
            <h4>Seguinos!</h4>
          </div>
          <Link to="#">Facebook</Link>
          <Link to="#">Twitter</Link>
          <Link to="#">Instagram</Link>
        </div>

        <div className="footer-box">
          <div className="footer-title">
            <img src="/icons/i.png" className="iconf" alt="Information icon" />
            <h4>Informacion</h4>
          </div>
          <div className="info-columns">
            <div className="links-column">
              <Link to="/nosotros">Acerca de Nosotros</Link>
              <Link to="/nosotros">Contactanos</Link>
              <Link to="/preguntas">Preguntas frecuentes</Link>
            </div>
            <div className="links-column">
              <Link to="#">Terminos y Condiciones</Link>
              <Link to="/profile">Mi Cuenta</Link>
              <Link to="#">Redes Sociales</Link>
            </div>
          </div>
        </div>

      </div>

      <p className="copyright">
        © 2025 BOOKLOOP - Todos los derechos reservados.
      </p>
    </footer>
  );
}
