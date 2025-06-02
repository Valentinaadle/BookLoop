import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';
import '../Assets/css/BookDetails.css';

function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    authors: '',
    description: '',
    price: '',
    stock: ''
  });
  const [success, setSuccess] = useState(null);
  const [bookImages, setBookImages] = useState([]);
  const DEFAULT_BOOK_IMAGE = '/icono2.png';
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchBookDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/books/${id}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setBook(data);
      // Procesar las imágenes del libro
      const images = [];
      if (data.imageUrl) {
        // Si la imagen es una ruta estática (comienza con /Assets)
        if (data.imageUrl.startsWith('/Assets')) {
          images.push(data.imageUrl);
        } else {
          // Si es una URL completa o una ruta del backend
          images.push(data.imageUrl.startsWith('http') ? data.imageUrl : `${API_URL}${data.imageUrl}`);
        }
      }
      if (Array.isArray(data.Images) && data.Images.length > 0) {
        data.Images.forEach(img => {
          const imgUrl = img.image_url.startsWith('http') ? img.image_url : `${API_URL}${img.image_url}`;
          if (!images.includes(imgUrl)) {
            images.push(imgUrl);
          }
        });
      }
      setBookImages(images);
      setEditForm({
        title: data.title || '',
        authors: Array.isArray(data.authors) ? data.authors.join(', ') : data.authors || '',
        description: data.description || '',
        price: data.price || '',
        stock: data.stock || ''
      });
    } catch (err) {
      setError('No se pudo cargar el libro. ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [id, API_URL]);

  useEffect(() => {
    if (id) {
      fetchBookDetails();
    }
  }, [id, fetchBookDetails]);

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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...editForm,
        authors: editForm.authors.split(',').map(author => author.trim()),
        description: editForm.description.trim()
      };

      const response = await fetch(`${API_URL}/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) throw new Error('Error al actualizar el libro');
      
      const updatedBook = await response.json();
      setBook(updatedBook); // Actualizar el estado del libro directamente
      setSuccess('Libro actualizado correctamente');
      setShowEditModal(false);
    } catch (err) {
      setError('Error al actualizar el libro');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isOwner = user && book.seller_id === user.id;

  const handleDeleteBook = async () => {
    if (window.confirm('¿Estás seguro que deseas eliminar este libro?')) {
      try {
        const response = await fetch(`${API_URL}/api/books/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al eliminar el libro');
        
        navigate('/profile');
      } catch (err) {
        setError('Error al eliminar el libro');
      }
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
            <div className="book-action-top">
              {isOwner ? (
                <div className="owner-actions">
                  <button 
                    className="contact-button-detail"
                    onClick={() => setShowEditModal(true)}
                  >
                    <i className="fas fa-edit"></i> Editar Libro
                  </button>
                  <button 
                    className="delete-button-detail"
                    onClick={handleDeleteBook}
                  >
                    <i className="fas fa-trash"></i> Eliminar Libro
                  </button>
                </div>
              ) : (
                <button 
                  className="contact-button-detail"
                  onClick={() => setShowModal(true)}
                >
                  <i className="fas fa-envelope"></i> Contactar Vendedor
                </button>
              )}
            </div>
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
                        e.target.src = DEFAULT_BOOK_IMAGE;
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
                    src={DEFAULT_BOOK_IMAGE}
                    alt={`Portada ${book.title}`}
                    className="book-cover-image"
                  />
                )}
              </div>
            </div>

            <div className="book-right-column">
              <div className="book-details">
                <h3>Detalles del libro:</h3>
                <div className="details-grid">
                  <div className="detail-item"><span>Editorial:</span><span>{book.publisher || 'No especificado'}</span></div>
                  <div className="detail-item"><span>Categoría:</span><span>{book.Category?.category_name || 'No especificado'}</span></div>
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

      {showEditModal && isOwner && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Libro</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>
                  <i className="fas fa-book"></i> Título
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  <i className="fas fa-user"></i> Autores
                  <input
                    type="text"
                    name="authors"
                    value={editForm.authors}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Separados por comas"
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  <i className="fas fa-align-left"></i> Descripción
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    rows="4"
                    maxLength="1000"
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  <i className="fas fa-tag"></i> Precio
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    step="0.01"
                    min="0"
                  />
                </label>
              </div>
              <div className="modal-buttons">
                <button type="submit" className="save-button">
                  <i className="fas fa-save"></i> Guardar Cambios
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)} 
                  className="cancel-button"
                >
                  <i className="fas fa-times"></i> Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {success && <div className="success-message">{success}</div>}
    </>
  );
}

export default BookDetails;
