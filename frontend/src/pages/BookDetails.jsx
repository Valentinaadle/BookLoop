import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';

function BookDetails() {
  const [showDetails, setShowDetails] = useState(false);

  const mostrarDetalles = () => {
    setShowDetails(true);
    alert("Aquí se mostrarán los detalles del ISBN ingresado (cuando lo conectemos a la base de datos).");
  };

  return (
    <>
      <Header />
      
      {/* Header separado solo para botones */}
      <header className="header">
        <nav className="nav">
          <button className="isbn-btn" onClick={mostrarDetalles}>
            Código ISBN
          </button>
        </nav>
      </header>

      <main className="main">
        <h1 className="main-title">Detalle del Libro</h1>
        
        <section className="book-info">
          {/* Portada */}
          <div className="book-cover">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/0/05/Littleprince.JPG" 
              alt="Portada El Principito" 
            />
          </div>

          {/* Detalles del libro */}
          <div className="book-details">
            <h1 className="book-title">El Principito</h1>
            <p className="book-author">Antoine de Saint-Exupéry</p>
            <p className="book-description">
              Una obra clásica de la literatura mundial, "El Principito" es una reflexión sobre la amistad, 
              el amor y la esencia de lo verdaderamente importante en la vida.
            </p>
            <p className="book-price">€14.99</p>
            <p className="book-availability">Disponible</p>
            <button className="add-cart-btn">Agregar al carrito</button>
          </div>

          {/* Sección de extras */}
          <aside className="book-extra">
            <div className="extra-section">
              <h3>Detalles del Producto</h3>
              <p>Edición especial con ilustraciones originales. Tapa dura.</p>
            </div>
            <div className="extra-section">
              <h3>Sobre el Autor</h3>
              <p>Antoine de Saint-Exupéry fue un aviador y escritor francés, célebre por su estilo poético y filosófico.</p>
            </div>
            <div className="extra-section">
              <h3>Especificaciones</h3>
              <p>Idioma: Español<br />Páginas: 96</p>
            </div>
            <div className="extra-section">
              <h3>Publicación</h3>
              <p>Año: 1943</p>
            </div>
          </aside>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f9f9f9;
        }

        .main-title {
          text-align: left;
          font-size: 32px;
          font-weight: bold;
          color: #333;
          padding: 20px 40px 0px 40px;
        }

        .header {
          background: white;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 10px 40px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .nav {
          display: flex;
          gap: 20px;
        }

        .isbn-btn {
          background-color: #0052cc;
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .isbn-btn:hover {
          background-color: #003d99;
        }

        .main {
          max-width: 1200px;
          margin: 20px auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .book-info {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
          margin-top: 20px;
        }

        .book-cover {
          flex: 1;
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          min-width: 250px;
        }

        .book-cover img {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .book-details {
          flex: 2;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          min-width: 300px;
        }

        .book-title {
          margin: 0 0 10px;
          font-size: 28px;
          color: #222;
        }

        .book-author {
          margin: 0 0 20px;
          font-size: 18px;
          color: #666;
        }

        .book-description {
          font-size: 16px;
          color: #444;
          margin: 15px 0;
        }

        .book-price {
          font-size: 24px;
          color: #e60023;
          margin: 0 0 10px;
        }

        .book-availability {
          font-size: 16px;
          color: #4CAF50;
          margin: 0 0 20px;
        }

        .add-cart-btn {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
        }

        .add-cart-btn:hover {
          background-color: #3e8e41;
        }

        .book-extra {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
          min-width: 250px;
        }

        .extra-section {
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .extra-section h3 {
          margin-top: 0;
          font-size: 18px;
          color: #0052cc;
        }

        .extra-section p {
          margin: 10px 0 0;
          font-size: 14px;
          color: #555;
        }

        @media (max-width: 768px) {
          .book-info {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </>
  );
}

export default BookDetails;