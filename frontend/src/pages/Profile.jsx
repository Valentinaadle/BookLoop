import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/profile.css';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getBookImage, getBookAuthor } from '../utils/bookUtils';
import BookCard from '../components/BookCard';

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

  // Admin user management state
  const [allUsers, setAllUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false); // Modal de usuario, solo usado en admin

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAllUsers();
    }
  }, [user]);

  const fetchAllUsers = async () => {
    setUserLoading(true);
    setUserError(null);
    try {
      const res = await fetch(`${API_URL}/api/users`);
      if (!res.ok) throw new Error('Error al cargar usuarios');
      const data = await res.json();
      setAllUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setUserError('Error al cargar usuarios');
    }
    setUserLoading(false);
  };

  

  const handleDeleteUser = async (id) => {
    setUserError(null);
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al desactivar usuario');
      setAllUsers(prev => prev.filter(u => (u.user_id || u.id) !== id));
      setShowDeleteUserModal(false);
    } catch (err) {
      setUserError('Error al desactivar usuario');
    } finally {
      setDeletingUserId(null);
    }
  };

  // Función para cancelar el modal de usuario
  const handleCancelDeleteUser = () => {
    setShowDeleteUserModal(false);
    setDeletingUserId(null);
  };

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

  if (user && user.role === 'admin') {
    return (
      <>
        <Header />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '60vh', paddingTop: '40px' }}>
          <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '32px', minWidth: '700px', maxWidth: '95vw' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#394B60', fontSize: '2.2rem', fontWeight: 700 }}>Gestión de usuarios</h2>
            {userError && <div className="error-message">{userError}</div>}
            {userLoading ? (
              <div className="loading">Cargando usuarios...</div>
            ) : (
              <>
                <table className="users-table" style={{ width: '100%', borderCollapse: 'collapse', margin: '0 auto' }}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th className="actions-column">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.filter(u => u.role === 'user').map(u => (
                      <tr key={u.user_id || u.id}>
                        <td>{u.user_id || u.id}</td>
                        <td>{u.nombre || u.first_name || '-'}</td>
                        <td>{u.apellido || u.last_name || '-'}</td>
                        <td>{u.email}</td>
                        <td>{u.role || 'usuario'}</td>
                        <td className="actions-column">
                          <div className="user-action-buttons">
                            <button
                               onClick={() => {
                                 setDeletingUserId(u.user_id || u.id);
                                 setShowDeleteUserModal(true);
                               }}
                               className="delete-button"
                               disabled={deletingUserId === (u.user_id || u.id)}
                             >
                              Desactivar
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {showDeleteUserModal && (
                  <div className="modal-overlay" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.4)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <div className="modal-content" style={{background:'#fff',padding:32,borderRadius:8,minWidth:320,boxShadow:'0 2px 12px rgba(0,0,0,0.15)'}}>
                      <h3 style={{marginBottom:24}}>¿Estás seguro que quieres desactivar este usuario?</h3>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: 24 }}>
                        <button onClick={handleCancelDeleteUser} className="cancel-button" style={{background:'#eee',border:'none',padding:'8px 18px',borderRadius:4,cursor:'pointer'}}>Cancelar</button>
                        <button onClick={() => handleDeleteUser(deletingUserId)} className="delete-button" style={{background:'#d32f2f',color:'#fff',border:'none',padding:'8px 18px',borderRadius:4,cursor:'pointer'}} autoFocus>Desactivar</button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-card">
          <div className="header-background"></div>
          <div className="profile-top">
            <div className="avatar-circle">{(form.nombre?.[0]) || 'U'}</div>
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
              {(!user || (user.role !== 'admin')) && (
                <button onClick={() => setEditMode(true)} className="edit-button">
                  <i className="fas fa-edit"></i>
                </button>
              )}
              <button onClick={handleLogout} className="logout-button" title="Cerrar sesión">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Sección de Libros Publicados */}
        <div className="published-books-section">
          <h2>Mis Libros Publicados</h2>
          {publishedBooks.length > 0 ? (
            <div className="books-grid">
              {publishedBooks.map(book => (
                <div key={book.book_id} style={{ position: 'relative' }}>
                  <BookCard
                    descuento={null}
                    img={getBookImage(book, API_URL)}
                    titulo={book.title || book.titulo || 'Sin título'}
                    autor={getBookAuthor(book)}
                    precio={book.price || book.precio}
                    book_id={book.book_id}
                    showFavorito={false}
                    showComprar={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-books">
              <p>No has publicado ningún libro todavía.</p>
              <Link to="/search" className="add-book-link">
                Publicar un libro
              </Link>
            </div>
          )}
        </div>

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
                      if (book.Images[0].image_url.startsWith('/Assets')) {
                        imageUrl = book.Images[0].image_url;
                      } else if (book.Images[0].image_url.startsWith('http')) {
                        imageUrl = book.Images[0].image_url;
                      } else {
                        imageUrl = `${API_URL}${book.Images[0].image_url}`;
                      }
                    } else if (book.imageUrl) {
                      if (book.imageUrl.startsWith('/Assets')) {
                        imageUrl = book.imageUrl;
                      } else if (book.imageUrl.startsWith('http')) {
                        imageUrl = book.imageUrl;
                      } else {
                        imageUrl = `${API_URL}${book.imageUrl}`;
                      }
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
                            <Link to={`/edit-book-user/${book.book_id}`} className="edit-button">
                              <i className="fas fa-edit"></i> Editar
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