import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/profile.css';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Lista predefinida de intereses
const INTERESES_PREDEFINIDOS = [
  "Novela", "Poesía", "Ciencia Ficción", "Fantasía", "Misterio", 
  "Romance", "Historia", "Biografía", "Ciencia", "Filosofía",
  "Arte", "Música", "Cine", "Teatro", "Cómic"
];

const BOOKS_PER_PAGE = 9; // 3x3 grid

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    nombre: '', 
    apellido: '', 
    email: '', 
    intereses: [] 
  });
  const [editMode, setEditMode] = useState(false);
  const [showInteresesModal, setShowInteresesModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [tempIntereses, setTempIntereses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [publishedBooks, setPublishedBooks] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBooksModal, setShowBooksModal] = useState(false);
  const DEFAULT_BOOK_IMAGE = '/icono2.png';

  useEffect(() => {
    if (user && user.id) {
      // Cargar datos del perfil
      fetch(`${API_URL}/api/users/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setForm({
            nombre: data.nombre || '',
            apellido: data.apellido || '',
            email: data.email || '',
            intereses: data.intereses || []
          });
          setLoading(false);
        })
        .catch(() => {
          setError('No se pudo cargar el perfil');
          setLoading(false);
        });

      // Cargar libros publicados
      fetch(`${API_URL}/api/books/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setPublishedBooks(Array.isArray(data) ? data : []);
        })
        .catch(err => {
          console.error('Error al cargar libros:', err);
          setError('Error al cargar los libros publicados');
        });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
        })
      });
      if (!res.ok) throw new Error('Error al actualizar el perfil');
      setSuccess('Perfil actualizado correctamente');
      setEditMode(false);
    } catch (err) {
      setError('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este libro?')) {
      try {
        const res = await fetch(`${API_URL}/api/books/${bookId}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error('Error al eliminar el libro');
        setPublishedBooks(prev => prev.filter(book => book.book_id !== bookId));
        setSuccess('Libro eliminado correctamente');
      } catch (err) {
        setError('Error al eliminar el libro');
      }
    }
  };

  const handleOpenIntereses = () => {
    setTempIntereses([...form.intereses]);
    setShowInteresesModal(true);
  };

  const handleSaveIntereses = () => {
    setForm(prev => ({
      ...prev,
      intereses: tempIntereses
    }));
    setShowInteresesModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (bookToDelete) {
      try {
        const res = await fetch(`${API_URL}/api/books/${bookToDelete}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error('Error al eliminar el libro');
        setPublishedBooks(prev => prev.filter(book => book.book_id !== bookToDelete));
        setSuccess('Libro eliminado correctamente');
      } catch (err) {
        setError('Error al eliminar el libro');
      }
      setShowDeleteModal(false);
      setBookToDelete(null);
    }
  };

  const openDeleteModal = (bookId) => {
    setBookToDelete(bookId);
    setShowDeleteModal(true);
  };

  // Calcular el número total de páginas
  const totalPages = Math.ceil(publishedBooks.length / BOOKS_PER_PAGE);

  // Obtener los libros para la página actual
  const getCurrentPageBooks = () => {
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    const endIndex = startIndex + BOOKS_PER_PAGE;
    return publishedBooks.slice(startIndex, endIndex);
  };

  // Función para cambiar de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div>Cargando perfil...</div>;

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-card">
          <div className="header-background"></div>
          <div className="profile-top">
            <div className="avatar-circle">{form.nombre?.[0] || 'U'}</div>
            <div className="info">
              <h2>
                {form.nombre} {form.apellido}
              </h2>
              <p>{form.email}</p>
              <div className="stats">
                <span className="stat-item">
                  <i className="fas fa-book"></i> {publishedBooks.length} libros publicados
                </span>
              </div>
              <div className="intereses-container">
                {form.intereses.map((interes, index) => (
                  <span key={index} className="interes-tag">
                    {interes}
                  </span>
                ))}
              </div>

            </div>
            <div className="profile-actions">
              <button onClick={() => setEditMode(true)} className="edit-button">
                <i className="fas fa-edit"></i>
              </button>
              <button onClick={handleLogout} className="logout-button" title="Cerrar sesión">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>

          {/* Libros Recientes */}
          {publishedBooks.length > 0 && (
            <div className="recent-books-section">
              <h3> Libros Recientes</h3>
              <button onClick={() => setShowBooksModal(true)} className="view-books-button">
                <i className="fas fa-books"></i> Mis libros
              </button>
              <br></br>
              <div className="recent-books-grid">
                {publishedBooks.slice(0, 3).map(book => {
                  let imageUrl = DEFAULT_BOOK_IMAGE;
                  if (book.Images && Array.isArray(book.Images) && book.Images.length > 0 && book.Images[0].image_url) {
                    imageUrl = book.Images[0].image_url.startsWith('http')
                      ? book.Images[0].image_url
                      : `${API_URL}${book.Images[0].image_url}`;
                  } else if (book.imageUrl) {
                    imageUrl = book.imageUrl.startsWith('http')
                      ? book.imageUrl
                      : `${API_URL}${book.imageUrl}`;
                  }
                  
                  return (
                    <div key={book.book_id} className="recent-book-card">
                      <div className="recent-book-image-container">
                        <img 
                          src={imageUrl} 
                          alt={book.title}
                          className="recent-book-cover"
                          onError={e => { e.target.src = DEFAULT_BOOK_IMAGE; }}
                        />
                      </div>
                      <div className="recent-book-info">
                        <h4>{book.title}</h4>
                        <p className="recent-book-author">
                          {(() => {
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
                            } else {
                              return 'Autor no especificado';
                            }
                          })()}
                        </p>
                        <p className="recent-book-price">
                          ${parseFloat(book.price).toFixed(2)}
                        </p>
                        <Link to={`/book/${book.book_id}`} className="view-details-link">
                          Ver detalles <i className="fas fa-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {editMode && (
            <div className="modal-overlay">
              <div className="modal-content edit-profile-modal">
                <form onSubmit={handleSave}>
                  <div className="form-group">
                    <label>
                      <i className="fas fa-user"></i> Nombre
                      <input 
                        type="text" 
                        name="nombre" 
                        value={form.nombre} 
                        onChange={handleChange} 
                        required 
                        className="form-input"
                      />
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <i className="fas fa-user"></i> Apellido
                      <input 
                        type="text" 
                        name="apellido" 
                        value={form.apellido} 
                        onChange={handleChange} 
                        required 
                        className="form-input"
                      />
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <i className="fas fa-envelope"></i> Email
                      <input 
                        type="email" 
                        name="email" 
                        value={form.email} 
                        onChange={handleChange} 
                        required 
                        className="form-input"
                      />
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <i className="fas fa-heart"></i> Intereses
                    </label>
                    <button 
                      type="button" 
                      onClick={handleOpenIntereses}
                      className="select-intereses-button"
                    >
                      Seleccionar Intereses
                    </button>
                  </div>
                  <div className="modal-buttons">
                    <button type="submit" className="save-button">
                      <i className="fas fa-save"></i> Guardar
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setEditMode(false)} 
                      className="cancel-button"
                    >
                      <i className="fas fa-times"></i> Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showInteresesModal && (
            <div className="modal-overlay">
              <div className="modal-content intereses-modal">
                <h3>Seleccionar Intereses</h3>
                <div className="intereses-list">
                  {INTERESES_PREDEFINIDOS.map((interes) => (
                    <div key={interes} className="interes-item">
                      <label className="interes-checkbox">
                        <input
                          type="checkbox"
                          checked={tempIntereses.includes(interes)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTempIntereses(prev => [...prev, interes]);
                            } else {
                              setTempIntereses(prev => prev.filter(i => i !== interes));
                            }
                          }}
                        />
                        <span className="checkbox-custom"></span>
                        <span className="interes-text">{interes}</span>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="modal-buttons">
                  <button 
                    onClick={handleSaveIntereses} 
                    className="save-button"
                  >
                    <i className="fas fa-check"></i> Confirmar
                  </button>
                  <button 
                    onClick={() => setShowInteresesModal(false)} 
                    className="cancel-button"
                  >
                    <i className="fas fa-times"></i> Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>

      {/* Modal de Libros */}
      {showBooksModal && (
        <div className="modal-overlay">
          <div className="modal-content books-modal">
            <div className="books-modal-header">
              <h2>Mis Libros Publicados</h2>
              <button onClick={() => setShowBooksModal(false)} className="close-modal" aria-label="Cerrar">
                &times;
              </button>
            </div>
            
            {publishedBooks.length === 0 ? (
              <p className="no-books">No tienes libros publicados</p>
            ) : (
              <>
                <div className="books-grid-modal">
                  {getCurrentPageBooks().map(book => {
                    let imageUrl = DEFAULT_BOOK_IMAGE;
                    if (book.Images && Array.isArray(book.Images) && book.Images.length > 0 && book.Images[0].image_url) {
                      imageUrl = book.Images[0].image_url.startsWith('http')
                        ? book.Images[0].image_url
                        : `${API_URL}${book.Images[0].image_url}`;
                    } else if (book.imageUrl) {
                      imageUrl = book.imageUrl.startsWith('http')
                        ? book.imageUrl
                        : `${API_URL}${book.imageUrl}`;
                    }
                    
                    return (
                      <div key={book.book_id} className="book-card-modal">
                        <img 
                          src={imageUrl} 
                          alt={book.title}
                          className="book-cover-modal"
                          onError={e => { e.target.src = DEFAULT_BOOK_IMAGE; }}
                        />
                        <div className="book-info-modal">
                          <h4>{book.title}</h4>
                          <p className="book-author-modal">
                            {(() => {
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
                              } else {
                                return 'Autor no especificado';
                              }
                            })()}
                          </p>
                          <p className="book-price-modal">
                            ${parseFloat(book.price).toFixed(2)}
                          </p>
                          <div className="book-actions-modal">
                            <Link to={`/book/${book.book_id}`} className="view-button">
                              <i className="fas fa-eye"></i> Ver
                            </Link>
                            <button 
                              className="delete-button"
                              onClick={() => openDeleteModal(book.book_id)}
                            >
                              <i className="fas fa-trash"></i> Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Paginación */}
                <div className="pagination">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirm-modal">
            <h2>Confirmar Eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar este libro? Esta acción no se puede deshacer.</p>
            <div className="modal-buttons">
              <button onClick={handleDeleteConfirm} className="delete-button">
                <i className="fas fa-trash"></i> Sí, Eliminar
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="cancel-button">
                <i className="fas fa-times"></i> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content logout-confirm-modal">
            <h2>Confirmar cierre de sesión</h2>
            <p>¿Estás seguro de que deseas cerrar sesión?</p>
            <div className="modal-buttons">
              <button onClick={confirmLogout} className="confirm-button">
                <i className="fas fa-sign-out-alt"></i> Sí, cerrar sesión
              </button>
              <button onClick={() => setShowLogoutModal(false)} className="cancel-button">
                <i className="fas fa-times"></i> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default Profile;