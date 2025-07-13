import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/profile.css';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';
import '../Assets/css/reviews-tailwind.css';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getBookImage, getBookAuthor } from '../utils/bookUtils';
import BookCard from '../components/BookCard';
import { useFavorites } from '../context/FavoritesContext';
import { Heart, Star, Plus, Edit3, BookOpen, ShoppingBag, MessageSquare, Eye, Share2, Grid, List } from "lucide-react";

const API_URL = 'http://localhost:5000'; // Forzar URL absoluta para debugging

// Lista predefinida de intereses
const INTERESES_PREDEFINIDOS = [
  "Novela", "Poesía", "Ciencia Ficción", "Fantasía", "Misterio", 
  "Romance", "Historia", "Biografía", "Ciencia", "Filosofía",
  "Arte", "Música", "Cine", "Teatro", "Cómic"
];

const BOOKS_PER_PAGE = 9; // 3x3 grid

function Profile() {
  const { favorites } = useFavorites();
  // ... existing state
  const [markAsSoldLoadingId, setMarkAsSoldLoadingId] = useState(null);

  const handleMarkAsSold = async (bookId) => {
    setMarkAsSoldLoadingId(bookId);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/books/${bookId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'vendido' })
      });
      const updatedBook = await res.json();
      if (!res.ok) throw new Error('Error al actualizar el estado');
      setPublishedBooks(prev => prev.map(book =>
        book.book_id === bookId ? { ...book, ...updatedBook } : book
      ));
      setSuccess('Libro marcado como vendido');
    } catch (err) {
      setError('No se pudo cambiar el estado del libro');
    } finally {
      setMarkAsSoldLoadingId(null);
    }
  }
  const [activeTab, setActiveTab] = useState('publicados'); // 'publicados', 'vendidos', 'solicitudes', 'resenas', 'favoritos'
  const [solicitudes, setSolicitudes] = useState([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(false);
  // --- RESEÑAS ---
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  // --- hooks de estado principales ---
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    intereses: [],
    photoUrl: '',
    username: '',
    bio: '',
    stats: { publicados: 0, vendidos: 0, rating: 0 }
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
  const [selectedFile, setSelectedFile] = useState(null);
  const DEFAULT_BOOK_IMAGE = '/icono2.png';

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

  const filteredBooks = publishedBooks.filter(book => {
    if (activeTab === 'publicados') return (book.status === 'activo' || !book.status);
    if (activeTab === 'vendidos') return book.status === 'vendido';
    return true;
  });

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

  useEffect(() => {
    if (user && user.id && activeTab === 'solicitudes') {
      setLoadingSolicitudes(true);
      fetch(`${API_URL}/api/solicitudes/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setSolicitudes(Array.isArray(data) ? data : []);
          setLoadingSolicitudes(false);
        })
        .catch(() => {
          setSolicitudes([]);
          setLoadingSolicitudes(false);
        });
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (user && user.id) {
      // Cargar datos del usuario directamente
      fetch(`${API_URL}/api/users/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setForm({
            nombre: data.nombre || '',
            apellido: data.apellido || '',
            email: data.email || '',
            intereses: data.intereses || [],
            photoUrl: data.photo_url ? `${API_URL}${data.photo_url}` : '',
            username: data.username || '@usuario',
            bio: data.bio || 'Vendedor/a de libros apasionado/a.',
            stats: data.stats || { publicados: 0, vendidos: 0, rating: 0 }
          });
          setLoading(false);
        })
        .catch(() => {
          setError('No se pudo cargar el perfil');
          setLoading(false);
        });
      fetch(`${API_URL}/api/books/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setPublishedBooks(Array.isArray(data) ? data : []);
        })
        .catch(() => {
          setError('Error al cargar los libros publicados');
        });
      // Cargar reseñas del usuario
      setReviewsLoading(true);
      fetch(`${API_URL}/api/reviews/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setReviews(Array.isArray(data) ? data : []);
          setReviewsLoading(false);
        })
        .catch(() => {
          setReviews([]);
          setReviewsLoading(false);
          setReviewsError('No se pudieron cargar las reseñas');
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
      // 1. Actualizar datos de texto (sin foto)
      const userUpdates = {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        username: form.username,
        bio: form.bio,
        intereses: form.intereses
      };

      const userRes = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userUpdates)
      });
      
      if (!userRes.ok) {
        throw new Error('Error al actualizar datos de usuario');
      }

      // 2. Subir foto si hay una nueva
      if (selectedFile) {
        const formData = new FormData();
        formData.append('photo', selectedFile);

        const photoRes = await fetch(`${API_URL}/api/users/${user.id}/photo`, {
          method: 'POST',
          body: formData
        });
        
        if (!photoRes.ok) {
          throw new Error('Error al subir la foto de perfil');
        }
      }

      setSuccess('Perfil actualizado correctamente');
      setEditMode(false);
      
      // Recargar datos del usuario
      fetch(`${API_URL}/api/users/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setForm({
            nombre: data.nombre || '',
            apellido: data.apellido || '',
            email: data.email || '',
            intereses: data.intereses || [],
            photoUrl: data.photo_url ? `${API_URL}${data.photo_url}` : '',
            username: data.username || '@usuario',
            bio: data.bio || 'Vendedor/a de libros apasionado/a.',
            stats: data.stats || { publicados: 0, vendidos: 0, rating: 0 }
          });
          setSelectedFile(null);
        })
        .catch(() => {
          setError('Error al recargar datos del perfil');
        });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenIntereses = () => {
    setTempIntereses([...form.intereses]);
    setShowInteresesModal(true);
  };

  const handleSaveIntereses = async () => {
    try {
      setLoading(true);
      
      // Actualizar intereses en la base de datos
      const res = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intereses: tempIntereses })
      });
      
      if (!res.ok) {
        throw new Error('Error al actualizar intereses');
      }
      
      // Actualizar estado local
      setForm(prev => ({
        ...prev,
        intereses: tempIntereses
      }));
      
      setShowInteresesModal(false);
      setSuccess('Intereses actualizados correctamente');
    } catch (error) {
      setError('Error al actualizar intereses');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveInteres = async (interesAEliminar) => {
    try {
      setLoading(true);
      
      const nuevosIntereses = form.intereses.filter(interes => interes !== interesAEliminar);
      
      // Actualizar en la base de datos
      const res = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intereses: nuevosIntereses })
      });
      
      if (!res.ok) {
        throw new Error('Error al eliminar interés');
      }
      
      // Actualizar estado local
      setForm(prev => ({
        ...prev,
        intereses: nuevosIntereses
      }));
      
      setSuccess('Interés eliminado correctamente');
    } catch (error) {
      setError('Error al eliminar interés');
    } finally {
      setLoading(false);
    }
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

  const handleTabClick = (tab) => {
    if (tab === 'Favoritos') return navigate('/favoritos');
    if (tab === 'Publicar') return navigate('/vender-page');
    setActiveTab(tab);
  };

  if (loading) return <div>Cargando perfil...</div>;

  if (user && user.role === 'admin') {
    return (
      <>
        <Header />
        <div className="users-table-responsive">
          <div className="users-table-card">
            <h2 className="users-table-title">Gestión de usuarios</h2>
            {userError && <div className="error-message">{userError}</div>}
            {userLoading ? (
              <div className="loading">Cargando usuarios...</div>
            ) : (
              <>
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Username</th>
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
                        <td>
                          <Link to={`/usuario/${u.user_id || u.id}`} style={{color:'#394B60', textDecoration:'underline', cursor:'pointer'}}>
                            {u.username}
                          </Link>
                        </td>
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
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <h3>¿Estás seguro que quieres desactivar este usuario?</h3>
                      <div className="modal-actions">
                        <button onClick={handleCancelDeleteUser} className="cancel-button">Cancelar</button>
                        <button onClick={() => handleDeleteUser(deletingUserId)} className="delete-button" autoFocus>Desactivar</button>
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
      <div className="profile-dashboard-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-sidebar-card">
  <div className="profile-sidebar-avatar">
    {form.photoUrl ? (
      <img src={form.photoUrl} alt="Foto de perfil" />
    ) : (
      <span>{(form.nombre?.[0]) || 'U'}</span>
    )}
  </div>
  <h2 className="profile-sidebar-name">{form.nombre} {form.apellido}</h2>
  {/* Calificación promedio como vendedor */}
  <div className="profile-sidebar-rating" style={{margin: '8px 0 4px 0', textAlign: 'center'}}>
    {reviews.length > 0 && reviews.some(r => r.seller_rate) ? (
      (() => {
        const sellerRates = reviews.filter(r => typeof r.seller_rate === 'number' && !isNaN(r.seller_rate));
        if (!sellerRates.length) return <span style={{fontSize:'14px',color:'#888'}}>Sin reseñas</span>;
        const avg = sellerRates.reduce((acc, r) => acc + r.seller_rate, 0) / sellerRates.length;
        const rounded = Math.round(avg * 10) / 10;
        return (
          <span style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2}}>
            <span style={{fontWeight:700, fontSize:'1.25rem', color:'#222', lineHeight:1}}>{rounded}</span>
            <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:2, fontSize:'15px', fontWeight:500, marginTop:'1px'}}>
              {Array.from({length:5}).map((_,i) => (
                <span key={i} style={{color: i < Math.round(avg) ? '#fbbf24' : '#e5e7eb', fontSize:'18px',marginRight:1}}>&#9733;</span>
              ))}
            </span>
            <span style={{fontSize:'12px',color:'#888',marginTop:'2px',textAlign:'center'}}>Calificación como vendedor</span>
          </span>
        );
      })()
    ) : (
      <span style={{fontSize:'14px',color:'#888'}}>Sin reseñas</span>
    )}
  </div>
  <p className="profile-sidebar-username">@{form.username.replace(/^@/, '')}</p>
  <p className="profile-sidebar-bio">{form.bio}</p>
  <button className="profile-sidebar-edit-btn" onClick={() => setEditMode(true)}>
    <Edit3 size={18} style={{marginRight:6, marginBottom:-2}} className="profile-icon" /> Editar perfil
  </button>
</div>
          <div className="profile-sidebar-stats">
            <div className="profile-sidebar-stat">
              <span className="profile-sidebar-stat-value">{publishedBooks.filter(book => book.status === 'activo' || !book.status).length}</span>
              <span className="profile-sidebar-stat-label">Libros en venta</span>
            </div>
            <div className="profile-sidebar-stat">
              <span className="profile-sidebar-stat-value">{publishedBooks.filter(book => book.status === 'vendido').length}</span>
              <span className="profile-sidebar-stat-label">Vendidos</span>
            </div>
          </div>
          <div className="profile-sidebar-genres-card">
            <h3>Géneros favoritos</h3>
            {form.intereses && form.intereses.length > 0 ? (
              <div className="profile-sidebar-genres-container">
                <div className="profile-sidebar-genres-list">
                  {form.intereses.map((genero, idx) => (
                    <div key={idx} className="profile-sidebar-genre-tag">
                      <span>{genero}</span>
                      <button 
                        className="genre-remove-btn"
                        onClick={() => handleRemoveInteres(genero)}
                        title="Eliminar género"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button 
                    className="add-genre-btn" 
                    onClick={() => setShowInteresesModal(true)}
                    title="Agregar más géneros"
                  >
                    +
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="profile-sidebar-no-genres">Aún no seleccionaste tus géneros favoritos.</p>
                <button className="choose-genres-btn" onClick={() => setShowInteresesModal(true)}>Elegir géneros</button>
              </>
            )}
          </div>
        </aside>
        {/* Main */}
        <main className="profile-main">
          {/* Tabs for book status */}
          <div className="profile-main-tabs">
            <button
              className={`profile-main-tab${activeTab === 'publicados' ? ' active' : ''}`}
              onClick={() => setActiveTab('publicados')}
            >
              Libros Publicados
            </button>
            <button
              className={`profile-main-tab${activeTab === 'vendidos' ? ' active' : ''}`}
              onClick={() => handleTabClick('vendidos')}
            >
              Libros Vendidos
            </button>
            <button
              className={`profile-main-tab${activeTab === 'solicitudes' ? ' active' : ''}`}
              onClick={() => handleTabClick('solicitudes')}
            >
              Solicitudes
            </button>
            <button
              className={`profile-main-tab${activeTab === 'resenas' ? ' active' : ''}`}
              onClick={() => setActiveTab('resenas')}
            >
              Reseñas
            </button>
            <button
              className={`profile-main-tab${activeTab === 'favoritos' ? ' active' : ''}`}
              onClick={() => setActiveTab('favoritos')}
            >
              Wishlist
            </button>
          </div>
          <div className="profile-main-content">
            {activeTab === 'solicitudes' ? (
              loadingSolicitudes ? (
                <div className="profile-main-empty-card">
                  <MessageSquare size={48} className="profile-icon" style={{marginBottom:12}} />
                  <span>Cargando solicitudes...</span>
                </div>
              ) : solicitudes.length === 0 ? (
                <div className="profile-main-empty-card">
                  <MessageSquare size={48} className="profile-icon" style={{marginBottom:12}} />
                  <h3>No tienes solicitudes aún</h3>
                  <p className="profile-main-empty-desc">Aquí aparecerán los libros que te solicitaron otros usuarios.</p>
                </div>
              ) : (
                <div style={{padding: '0 0.5rem'}}>
                  <div className="solicitud-title">Solicitudes de Compra</div>
                  {solicitudes.map((sol) => (
                    <div className="solicitud-card" key={sol.id}>
                      <img
                        className="solicitud-img"
                        src={getBookImage(sol.books, API_URL) || '/Assets/book-empty.png'}
                        alt={sol.books?.title || 'Sin título'}
                        onError={e => e.target.src='/Assets/book-empty.png'}
                      />
                      <div className="solicitud-info">
                        <span className="solicitud-info-title">{sol.books?.title || 'Sin título'}</span>
                        <span className="solicitud-info-precio">Precio: <b>${sol.books?.price || '---'}</b></span>
                        <span className="solicitud-info-user">Solicitado por: <Link to={`/usuario/${sol.users?.id || sol.users?.user_id || ''}`} className="solicitud-link">{sol.users?.nombre || sol.users?.username || 'Usuario'}</Link></span>
                      </div>
                      <button className="solicitud-contact-btn" onClick={() => navigate(`/book/${sol.books?.book_id || sol.books?.id}`)}>Ver libro</button>
                    </div>
                  ))}
                </div>
              )
            ) : activeTab === 'resenas' ? (
              <div className="reviews-tailwind-root">
                <div className="solicitud-title">Reseñas</div>
                {reviewsLoading ? (
                  <p>Cargando reseñas...</p>
                ) : reviews.length === 0 ? (
                  <div className="profile-main-empty-card">
                    <h3>No hay reseñas.</h3>
                    <p className="profile-main-empty-desc">Cuando alguien deje una reseña, aparecerá aquí.</p>
                  </div>
                ) : (
                  <div className="reviews-tailwind-list">
                    {reviews.map((review) => {
                      const key = review.id || review.review_id || `${review.buyer_id}-${review.book_id}-${review.review_date}`;
                      const buyer = review.buyers || {};
                      const reviewerNombre = buyer.nombre || buyer.username || buyer.apellido || 'Usuario';
                      const reviewerFoto = buyer.photo_url || null;
                      let fecha = review.review_date || review.fecha;
                      let fechaStr = '';
                      if (fecha) {
                        try {
                          const d = new Date(fecha);
                          if (!isNaN(d.getTime())) fechaStr = d.toLocaleDateString();
                        } catch {}
                      }
                      return (
                        <div key={key} className="reviews-tailwind-card">
                          <div className="reviews-tailwind-header">
                            <div
                              className="reviews-tailwind-avatar"
                              style={reviewerFoto ? { backgroundImage: `url('${reviewerFoto}')` } : { background: '#f2f2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              {!reviewerFoto && (
                                <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#666' }}>{reviewerNombre[0]}</span>
                              )}
                            </div>
                            <div className="reviews-tailwind-user">
                              <p className="reviews-tailwind-username">{reviewerNombre}</p>
                              <p className="reviews-tailwind-date">{fechaStr || 'Sin fecha'}</p>
                            </div>
                          </div>
                          <div className="reviews-tailwind-stars">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < (review.experience_rate || 0) ? 'reviews-tailwind-star' : 'reviews-tailwind-star reviews-tailwind-star-empty'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                                  <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z" />
                                </svg>
                              </span>
                            ))}
                          </div>
                          <p className="reviews-tailwind-comment">{review.comment || review.texto || ''}</p>
                          {review.book_id && (
                            <div className="reviews-tailwind-bookinfo text-xs text-[#6b7580] mt-1">
                              <span>Libro: {(() => {
                                const b = publishedBooks.find(bk => bk.book_id === review.book_id);
                                return b ? (b.titulo || b.title || 'Sin título') : 'Libro eliminado';
                              })()}</span>
                            </div>
                          )}
                          <div className="reviews-tailwind-actions">
                            <button className="reviews-tailwind-action-btn" type="button" title="Me gusta">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z" />
                              </svg>
                            </button>
                            <button className="reviews-tailwind-action-btn" type="button" title="No me gusta">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z" />
                              </svg>
                            </button>
                          </div>
                          {review.respuesta && (
                            <div className="review-response">
                              <strong>Respuesta del usuario:</strong> {review.respuesta}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : activeTab === 'favoritos' ? (
              favorites.length === 0 ? (
                <div className="profile-main-empty-card">
                  <Heart size={48} className="profile-icon" style={{marginBottom:12}} />
                  <h3>No tienes favoritos aún</h3>
                  <p className="profile-main-empty-desc">Cuando marques libros como favoritos, aparecerán aquí.</p>
                </div>
              ) : (
                <>
                  <h3 className="profile-main-section-title">Wishlist</h3>
                  <div className="profile-main-books-grid">
                    {favorites.map(book => (
                      <BookCard
                        key={book.book_id}
                        img={book.img || getBookImage(book, API_URL)}
                        titulo={book.titulo || book.title || 'Sin título'}
                        autor={book.autor || book.author || (book.authors ? book.authors[0] : '') || ''}
                        precio={book.precio || book.price || ''}
                        book_id={book.book_id}
                        favorito={true}
                        showVerDetalles={true}
                      />
                    ))}
                  </div>
                </>
              )
            ) : filteredBooks.length === 0 ? (
              <div className="profile-main-empty-card">
                {activeTab === 'publicados' ? (
                  <BookOpen size={48} className="profile-icon" style={{marginBottom:12}} />
                ) : (
                  <ShoppingBag size={48} className="profile-icon" style={{marginBottom:12}} />
                )}
                <h3>{activeTab === 'publicados' ? 'Aún no has publicado ningún libro' : 'Aún no has vendido ningún libro'}</h3>
                <p className="profile-main-empty-desc">{activeTab === 'publicados' ? 'Es hora de compartir tus tesoros literarios con el mundo. Publica tu primer libro y conéctate con otros amantes de la lectura.' : 'Cuando vendas un libro, aparecerá aquí.'}</p>
                {activeTab === 'publicados' && (
                  <button className="profile-main-add-btn" onClick={() => handleTabClick('Publicar')}><Plus size={20} style={{marginRight:4}} /> Publicar un libro</button>
                )}
              </div>
            ) : (
              <>
                <h3 className="profile-main-section-title">{activeTab === 'publicados' ? 'Libros Activos' : 'Libros Vendidos'}</h3>
                <div className="profile-main-books-grid">
                  {filteredBooks.map(book => (
                    <BookCard
                      key={book.book_id}
                      img={getBookImage(book, API_URL)}
                      titulo={book.titulo || book.title || 'Sin título'}
                      autor={book.autor || book.author || (book.authors ? book.authors[0] : '') || ''}
                      precio={book.precio || book.price || ''}
                      book_id={book.book_id}
                      status={book.status}
                      showVerDetalles={true}
                      onMarkAsSold={book.status === 'activo' ? () => handleMarkAsSold(book.book_id) : undefined}
                      markAsSoldLoading={markAsSoldLoadingId === book.book_id}
                    />
                  ))}
                  {activeTab === 'publicados' && (
                    <div className="profile-main-book-card add-new-book" onClick={() => handleTabClick('Publicar')} style={{cursor:'pointer'}}>
                      <div className="profile-main-add-icon"><Plus size={20} style={{marginRight:4}} /></div>
                      <p className="profile-main-add-text">Publicar nuevo libro</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      {/* Modals condicionales envueltos en un fragmento para evitar error de JSX adyacente */}
      <>
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
                          // Guardar el archivo para subirlo después
                          setSelectedFile(file);
                          
                          // Mostrar preview inmediata
                          const reader = new FileReader();
                          reader.onload = ev => setForm(prev => ({ ...prev, photoUrl: ev.target.result }));
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="form-group-minimal">
                  <label htmlFor="nombre">Nombre</label>
                  <input 
                    id="nombre"
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
                  <label htmlFor="apellido">Apellido</label>
                  <input 
                    id="apellido"
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
                  <label htmlFor="email">Email</label>
                  <input 
                    id="email"
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
                  <label htmlFor="bio">Biografía</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    className="form-input-minimal"
                    placeholder="Biografía"
                    rows={3}
                  />
                </div>
                <div className="edit-buttons-minimal">
                  <button type="submit" className="save-btn-minimal">
                    Guardar
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditMode(false);
                      setSelectedFile(null);
                      // Recargar datos originales
                      fetch(`${API_URL}/api/users/${user.id}`)
                        .then(res => res.json())
                        .then(data => {
                          setForm({
                            nombre: data.nombre || '',
                            apellido: data.apellido || '',
                            email: data.email || '',
                            intereses: data.intereses || [],
                            photoUrl: data.photo_url ? `${API_URL}${data.photo_url}` : '',
                            username: data.username || '@usuario',
                            bio: data.bio || 'Vendedor/a de libros apasionado/a.',
                            stats: data.stats || { publicados: 0, vendidos: 0, rating: 0 }
                          });
                        });
                    }} 
                    className="cancel-btn-minimal"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Modal de intereses visual y funcional */}
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
                <button onClick={handleSaveIntereses} className="save-btn-minimal">Confirmar</button>
                <button 
                  onClick={() => setShowInteresesModal(false)} 
                  className="cancel-btn-minimal"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </>
      <Footer />
    </>
  );
}

export default Profile;