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
    intereses: [],
    photoUrl: ''
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
            intereses: data.intereses || [],
            photoUrl: data.photoUrl || ''
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
        .catch(() => {
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
          photoUrl: form.photoUrl,
          intereses: form.intereses
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
      <div className="profile-modern-container">
        <div className="profile-modern-header">
          <div className="profile-modern-avatar">
            {form.photoUrl ? (
              <img src={form.photoUrl} alt="Foto de perfil" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
            ) : (
              (form.nombre?.[0]) || 'U'
            )}
          </div>
          <h2 className="profile-modern-name">{form.nombre} {form.apellido}</h2>
          <div className="profile-modern-role">Vendedor/a de libros</div>
          <div className="profile-modern-actions">
            <button onClick={() => setEditMode(true)} className="profile-modern-edit-btn" title="Editar perfil">
              <i className="fas fa-edit"></i>
            </button>
            <button onClick={() => { logout(); navigate('/'); }} className="profile-modern-logout-btn" title="Cerrar sesión">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
        <div className="profile-modern-tabs">
          <button className="profile-modern-tab active">Libros Publicados</button>
          <button className="profile-modern-tab" disabled>Libros Vendidos</button>
          <button className="profile-modern-tab" disabled>Solicitudes de Compra</button>
          <button className="profile-modern-tab" disabled>Reseñas</button>
        </div>
        {publishedBooks.length === 0 && (
          <div className="profile-modern-no-books">
            <p className="profile-modern-no-books-text">Aún no has publicado ningún libro.</p>
            <Link to="/search" className="profile-modern-add-book-btn">
              <i className="fas fa-plus"></i> Publicar un libro
            </Link>
          </div>
        )}
        {publishedBooks.length > 0 && (
          <div className="profile-books-list-minimal">
            <Link to="/search" className="profile-book-card-minimal add-new-book">
              <div className="profile-book-add-icon"><i className="fas fa-plus"></i></div>
              <div className="profile-book-add-text">Publicar nuevo libro</div>
            </Link>
            {publishedBooks.map(book => (
              <div key={book.book_id} className="profile-book-card-minimal">
                <div className="profile-book-img-minimal">
                  <img src={getBookImage(book, API_URL)} alt={book.title} onError={e => { e.target.src = '/icono2.png'; }} />
                </div>
                <div className="profile-book-info-minimal">
                  <div className="profile-book-title-minimal">{book.title || book.titulo || 'Sin título'}</div>
                  <div className="profile-book-author-minimal">{book.author || book.autor || 'Autor desconocido'}</div>
                  <div className="profile-book-price-minimal">${parseFloat(book.price || book.precio).toFixed(2)}</div>
                  <Link to={`/book/${book.book_id}`} className="profile-book-details-btn-minimal">
                    <i className="fas fa-eye"></i> Ver detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        {editMode && (
          <div className="modal-overlay">
            <div className="modal-content edit-profile-modal-minimal">
              <form onSubmit={handleSave}>
                <div className="edit-profile-avatar-section">
                  <label htmlFor="profile-photo-upload" className="edit-profile-avatar-label">
                    {form.photoUrl ? (
                      <img src={form.photoUrl} alt="Foto de perfil" className="edit-profile-avatar-img" />
                    ) : (
                      <span className="edit-profile-avatar-initial">{(form.nombre?.[0]) || 'U'}</span>
                    )}
                    <input
                      id="profile-photo-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = ev => setForm(prev => ({ ...prev, photoUrl: ev.target.result }));
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <span className="edit-profile-avatar-upload-icon"><i className="fas fa-camera"></i></span>
                  </label>
                </div>
                <div className="form-group-minimal">
                  <input 
                    type="text" 
                    name="nombre" 
                    value={form.nombre} 
                    onChange={handleChange} 
                    required 
                    className="form-input-minimal"
                    placeholder="Nombre"
                  />
                </div>
                <div className="form-group-minimal">
                  <input 
                    type="text" 
                    name="apellido" 
                    value={form.apellido} 
                    onChange={handleChange} 
                    required 
                    className="form-input-minimal"
                    placeholder="Apellido"
                  />
                </div>
                <div className="form-group-minimal">
                  <input 
                    type="email" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    required 
                    className="form-input-minimal"
                    placeholder="Email"
                  />
                </div>
                <div className="form-group-minimal">
                  <button 
                    type="button" 
                    onClick={handleOpenIntereses}
                    className="select-intereses-button-minimal"
                  >
                    <i className="fas fa-tags"></i> Seleccionar intereses
                  </button>
                  <div className="edit-profile-intereses-tags">
                    {form.intereses.map((interes, idx) => (
                      <span key={idx} className="edit-profile-interes-tag">{interes}</span>
                    ))}
                  </div>
                </div>
                <div className="edit-buttons-minimal">
                  <button type="submit" className="save-btn-minimal">
                    <i className="fas fa-save"></i> Guardar
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditMode(false)} 
                    className="cancel-btn-minimal"
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
                  className="save-btn-minimal"
                >
                  <i className="fas fa-check"></i> Confirmar
                </button>
                <button 
                  onClick={() => setShowInteresesModal(false)} 
                  className="cancel-btn-minimal"
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
      <Footer />
    </>
  );
}

export default Profile;