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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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
      // --- COVER LOGIC FIX: Ensure cover is always first and no duplicates ---
      let images = [];
      // 1. Get all image URLs (imageUrl, Images[])
      if (Array.isArray(data.Images) && data.Images.length > 0) {
        images = data.Images.map(img => img.image_url.startsWith('http') ? img.image_url : `${API_URL}${img.image_url}`);
      }
      if (data.imageUrl) {
        const imgUrl = data.imageUrl.startsWith('http') ? data.imageUrl : (data.imageUrl.startsWith('/Assets') ? data.imageUrl : `${API_URL}${data.imageUrl}`);
        if (!images.includes(imgUrl)) images.push(imgUrl);
      }
      // 2. If coverImageUrl exists, ensure it is first
      let coverUrl = data.coverImageUrl || data.imageUrl || (images.length > 0 ? images[0] : null);
      if (coverUrl) {
        coverUrl = coverUrl.startsWith('http') ? coverUrl : (coverUrl.startsWith('/Assets') ? coverUrl : `${API_URL}${coverUrl}`);
        images = [coverUrl, ...images.filter(url => url !== coverUrl)];
      }
      setBookImages(images);
      setActiveImage(0); // Always show the cover first
      setEditForm({
        title: data.title || '',
        authors: Array.isArray(data.authors) ? data.authors.join(', ') : data.authors || '',
        description: data.description || '',
        price: data.price || '',
        stock: data.stock || ''
      });
      // --- END COVER LOGIC FIX ---
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

    setShowConfirmModal(true);
  };

  const handleConfirmContact = async () => {
    setShowConfirmModal(false);
    setSending(true);
    setEmailStatus(null);

    try {
      const response = await fetch(`${API_URL}/api/books/notify-seller`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: book.book_id || book.id,
          buyerName: `${user.nombre} ${user.apellido}`,
          buyerEmail: user.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Error al enviar el email');
      }

      setEmailStatus('¡Email enviado correctamente!');
      setTimeout(() => {
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
  const isAdmin = user && user.role === 'admin';

  const handleDeleteBook = async () => {
  const bookId = book && book.book_id ? book.book_id : id;
  if (!bookId) {
    setError('No se encontró el ID del libro.');
    console.error('ID de libro no encontrado', { book, id });
    return;
  }
  if (window.confirm('¿Estás seguro que deseas eliminar este libro?')) {
    try {
      console.log('Intentando borrar libro con ID:', bookId);
      const response = await fetch(`${API_URL}/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        let backendError = '';
        try {
          const data = await response.json();
          backendError = data.message || data.error || JSON.stringify(data);
        } catch (e) {
          backendError = response.statusText;
        }
        console.error('Error backend al borrar:', backendError);
        throw new Error(backendError || 'Error al eliminar el libro');
      }
      setSuccess('Libro eliminado correctamente');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setError('Error al eliminar el libro: ' + err.message);
      console.error('Error al eliminar el libro:', err);
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
            <div className="book-header-text">
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
            <div className="book-action-top">
              {(isOwner || isAdmin) ? (
                <div className="owner-actions">
                  <button 
                    className="edit-button"
                    onClick={() => navigate(`/edit-book/${book.book_id}`)}
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
                <>
                  {user && (
                    <button 
                      className="contact-button-detail"
                      onClick={handleContactSeller}
                      disabled={sending}
                    >
                      <i className="fas fa-envelope"></i> {sending ? 'Enviando...' : 'Contactar Vendedor'}
                    </button>
                  )}
                </>
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

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar contacto con vendedor</h3>
            <p>¿Estás seguro que deseas contactar al vendedor de "{book.title}"?</p>
            <p>Se enviará un email al vendedor con tus datos de contacto.</p>
            <div className="modal-buttons">
              <button 
                className="modal-button email"
                onClick={handleConfirmContact}
                disabled={sending}
              >
                {sending ? 'Enviando...' : 'Sí, contactar vendedor'}
              </button>
              <button 
                className="modal-button close"
                onClick={() => setShowConfirmModal(false)}
                disabled={sending}
              >
                Cancelar
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

      {emailStatus && (
        <div className={emailStatus.includes('Error') ? 'error-message' : 'success-message'} style={{maxWidth: 500, margin: '20px auto'}}>
          {emailStatus}
        </div>
      )}
      <Footer />
    </>
  );
}

export default BookDetails;
