import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';
import '../Assets/css/BookDetails.css';

function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching book with ID:', id); // Para debugging
        const response = await fetch(`${API_URL}/api/books/${id}`);
        
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
  }, [id, API_URL]);

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

  const handleContactSeller = async () => {
    if (!user) {
      setEmailStatus('Error: Debes iniciar sesión para contactar al vendedor');
      return;
    }

    const email = book.seller?.email;
    if (!email) {
      setEmailStatus('Error: El email del vendedor no está disponible');
      return;
    }

    setSending(true);
    setEmailStatus(null);

    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        setEmailStatus('Error: No hay sesión activa. Por favor, inicia sesión nuevamente.');
        return;
      }

      console.log('Enviando solicitud con datos:', {
        to: email,
        bookTitle: book.title,
        userData: {
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email
        }
      });

      const response = await fetch(`${API_URL}/api/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          to: email,
          bookTitle: book.title,
          userData: {
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error del servidor:', data);
        throw new Error(data.details || data.error || 'Error al enviar el email');
      }

      setEmailStatus('¡Email enviado correctamente!');
      setTimeout(() => {
        setShowModal(false);
        setEmailStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Error completo:', error);
      setEmailStatus(`Error: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

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
                <button 
                  className="contact-button-detail"
                  onClick={() => setShowModal(true)}
                >
                  Contactar vendedor
                </button>
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Contactar al vendedor</h3>
            <p>¿Quieres enviar un mensaje al vendedor?</p>
            {emailStatus && (
              <p className={emailStatus.includes('Error') ? 'error-message' : 'success-message'}>
                {emailStatus}
              </p>
            )}
            <div className="modal-buttons">
              <button 
                className="modal-button close"
                onClick={() => setShowModal(false)}
                disabled={sending}
              >
                Cancelar
              </button>
              <button 
                className="modal-button email"
                onClick={handleContactSeller}
                disabled={sending}
              >
                {sending ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BookDetails;
