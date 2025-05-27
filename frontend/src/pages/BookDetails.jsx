import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching book with ID:', id); // Para debugging
        const response = await fetch(`http://localhost:5000/api/books/${id}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Book data received:', data); // Para debugging
        setBook(data);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('No se pudo cargar el libro. ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading">Cargando detalles del libro...</div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="error">{error}</div>
        <Footer />
      </>
    );
  }

  if (!book) {
    return (
      <>
        <Header />
        <div className="error">No se encontró el libro</div>
        <Footer />
      </>
    );
  }

  // Obtener las imágenes del libro (de la relación Images)
  const bookImages = [];
  
  // Agregar la imagen de Google Books si existe
  if (book.imageUrl) {
    bookImages.push(book.imageUrl.startsWith('http') ? book.imageUrl : `${API_URL}${book.imageUrl}`);
  }
  
  // Agregar las imágenes subidas por el usuario
  if (Array.isArray(book.Images) && book.Images.length > 0) {
    book.Images.forEach(img => {
      const imgUrl = img.image_url.startsWith('http') ? img.image_url : `${API_URL}${img.image_url}`;
      // Evitar duplicados
      if (!bookImages.includes(imgUrl)) {
        bookImages.push(imgUrl);
      }
    });
  }

  return (
    <>
      <Header />
      <main className="main">
        <div className="breadcrumb">
          <span>Inicio / Libros / {book.category || 'Categoría'}</span>
        </div>
        
        <section className="book-info">
          <div className="book-header">
            {book.isNew && <span className="new-badge">Novedad</span>}
            <h1 className="book-title">{book.title}</h1>
            <p className="book-author">
              <b>Autor:</b> {(() => {
                if (Array.isArray(book.authors)) {
                  return book.authors.join(', ');
                } else if (typeof book.authors === 'string') {
                  try {
                    const parsed = JSON.parse(book.authors);
                    if (Array.isArray(parsed)) {
                      return parsed.join(', ');
                    }
                    return parsed;
                  } catch {
                    return book.authors;
                  }
                } else if (book.author) {
                  return book.author;
                } else {
                  return 'No especificado';
                }
              })()}
            </p>
            <p className="book-seller">
              <b>Vendido por:</b> {book.seller ? `${book.seller.nombre} ${book.seller.apellido || ''}` : 'No especificado'}
            </p>
          </div>

          <div className="book-content">
            <div className="book-left-column">
              <div className="book-cover">
                {bookImages.length > 0 ? (
                  <div className="carousel">
                    <button
                      className="carousel-arrow left"
                      onClick={() => setActiveImage((prev) => (prev === 0 ? bookImages.length - 1 : prev - 1))}
                      aria-label="Anterior"
                    >&#8592;</button>
                    <img
                      src={bookImages[activeImage]}
                      alt={`Imagen ${activeImage + 1} de ${book.title}`}
                      className="carousel-image"
                      onError={(e) => {
                        e.target.src = '/placeholder-book.png';
                        e.target.onerror = null;
                      }}
                    />
                    <button
                      className="carousel-arrow right"
                      onClick={() => setActiveImage((prev) => (prev === bookImages.length - 1 ? 0 : prev + 1))}
                      aria-label="Siguiente"
                    >&#8594;</button>
                    <div className="carousel-indicators">
                      {bookImages.map((img, idx) => (
                        <span
                          key={idx}
                          className={`indicator-dot${activeImage === idx ? ' active' : ''}`}
                          onClick={() => setActiveImage(idx)}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <img
                    src="/placeholder-book.png"
                    alt={`Portada ${book.title}`}
                    className="book-cover-image"
                  />
                )}
              </div>
              <div className="book-actions">
                <button className="buy-button-detail">Comprar</button>
                <button className="contact-button-detail">Contactar vendedor</button>
              </div>
            </div>

            <div className="book-right-column">
              <div className="book-details">
                <h3>Detalles del libro:</h3>
                <div className="details-grid">
                  <div className="detail-item"><span>Editorial:</span><span>{book.publisher || 'No especificado'}</span></div>
                  <div className="detail-item"><span>Temática:</span><span>{book.Category?.category_name || 'No especificado'}</span></div>
                  <div className="detail-item"><span>Número de páginas:</span><span>{book.pageCount || 'No especificado'}</span></div>
                  <div className="detail-item"><span>Año de publicación:</span><span>{book.publication_date || 'No especificado'}</span></div>
                  <div className="detail-item"><span>Idioma:</span><span>{book.language || book.idioma || 'No especificado'}</span></div>
                  <div className="detail-item"><span>Estado:</span><span>{book.estado || book.condition || 'No especificado'}</span></div>
                  <div className="detail-item"><span>Precio:</span><span>{book.price ? `$${book.price}` : 'No especificado'}</span></div>
                </div>
              </div>

              <div className="book-synopsis">
                <h3>Sinopsis de {book.title}:</h3>
                <p className="book-description">{book.description || 'Sin descripción disponible'}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .breadcrumb {
          color: #666;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .book-header {
          margin-bottom: 30px;
          padding: 0 40px;
        }

        .new-badge {
          background: #4CAF50;
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 14px;
          display: inline-block;
          margin-bottom: 10px;
        }

        .book-title {
          font-size: 32px;
          color: #333;
          margin: 0 0 10px 0;
        }

        .book-author, .book-seller {
          font-size: 18px;
          color: #394B60;
          margin: 0 0 5px 0;
        }

        .book-content {
          display: flex;
          gap: 40px;
          padding: 0 40px;
        }

        .book-left-column {
          width: 300px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .book-cover {
          background: white;
          width: 250px;
          height: 350px;
          margin-bottom: 20px;
        }

        .book-cover img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          object-fit: cover;
          border-bottom: 1px solid #eee;
          transition: transform 0.2s;
        }

        .book-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .buy-button-detail, .contact-button-detail {
          width: 100%;
          padding: 12px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: background 0.2s, color 0.2s;
        }

        .buy-button-detail {
          background: #2a8ef2;
          color: white;
          margin-bottom: 4px;
        }

        .buy-button-detail:hover {
          background: #2477ca;
        }

        .contact-button-detail {
          background: #f5f6fa;
          color: #394B60;
          border: 1px solid #ccc;
        }

        .contact-button-detail:hover {
          background: #e6eaf1;
          color: #2a8ef2;
          border: 1px solid #2a8ef2;
        }

        .book-right-column {
          flex-grow: 1;
        }

        .book-details {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .book-details h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .details-grid {
          display: grid;
          gap: 10px;
        }

        .detail-item {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 10px;
        }

        .detail-item span:first-child {
          color: #666;
        }

        .book-synopsis {
          background: white;
          border-radius: 8px;
          padding: 20px;
        }

        .book-synopsis h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .book-description {
          color: #444;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        @media (max-width: 768px) {
          .book-content {
            flex-direction: column;
            padding: 0 20px;
          }

          .book-header {
            padding: 0 20px;
          }

          .book-left-column {
            width: 100%;
          }

          .book-cover img {
            max-height: 500px;
            object-position: top;
          }
        }

        .carousel {
          position: relative;
          width: 250px;
          height: 350px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
          border-bottom: 1px solid #eee;
        }
        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.7);
          border: none;
          font-size: 24px;
          cursor: pointer;
          z-index: 2;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .carousel-arrow.left {
          left: -18px;
        }
        .carousel-arrow.right {
          right: -18px;
        }
        .carousel-indicators {
          position: absolute;
          bottom: 10px;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 6px;
        }
        .indicator-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ccc;
          display: inline-block;
          cursor: pointer;
        }
        .indicator-dot.active {
          background: #2a8ef2;
        }
      `}</style>
    </>
  );
}

export default BookDetails;