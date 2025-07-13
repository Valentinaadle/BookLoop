import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { getBookImage } from '../utils/bookUtils';
import '../Assets/css/profile.css';
import '../Assets/css/reviews-tailwind.css';
import { BookOpen } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper to get token from localStorage
function getToken() {
  return localStorage.getItem('userToken');
}

function PublicProfile() {
  const [activeTab, setActiveTab] = useState('publicados');
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- RESEÑAS ---
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [newReview, setNewReview] = useState({
    book_id: '',
    experience_rate: 0,
    seller_rate: 0,
    comment: ''
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitError, setReviewSubmitError] = useState(null);
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(null);
  // Modal para confirmación de borrado de reseña
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Cargar reseñas apenas se monta el perfil público (para mostrar rating siempre)
  useEffect(() => {
    if (!user) return;
    setReviewsLoading(true);
    setReviewsError(null);
    fetch(`${API_URL}/api/reviews/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setReviews(Array.isArray(data) ? data : []);
        setReviewsLoading(false);
      })
      .catch(err => {
        setReviewsError('No se pudieron cargar las reseñas');
        setReviewsLoading(false);
      });
  }, [user]);

  // Mantener lógica original para recarga manual al cambiar de pestaña
  useEffect(() => {
    if (activeTab !== 'resenas' || !user) return;
    setReviewsLoading(true);
    setReviewsError(null);
    fetch(`${API_URL}/api/reviews/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setReviews(Array.isArray(data) ? data : []);
        setReviewsLoading(false);
      })
      .catch(err => {
        setReviewsError('No se pudieron cargar las reseñas');
        setReviewsLoading(false);
      });
  }, [activeTab, user]);

  // Determinar si el usuario puede dejar reseña
  useEffect(() => {
    if (!currentUser || !user || currentUser.id === user.id) {
      setCanReview(false);
      return;
    }
    // Solo permitir si no ha dejado reseña antes
    const yaDejo = reviews.some(r => r.reviewer_id === currentUser.id);
    setCanReview(!yaDejo);
  }, [currentUser, user, reviews]);

  // Enviar reseña
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewSubmitError(null);
    setReviewSubmitSuccess(null);
    try {
      if (!newReview.book_id || !newReview.experience_rate || !newReview.seller_rate) {
        setReviewSubmitError('Completa todos los campos');
        setReviewSubmitting(false);
        return;
      }
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_id: currentUser.id,
          book_id: newReview.book_id,
          experience_rate: newReview.experience_rate,
          seller_rate: newReview.seller_rate,
          comment: newReview.comment
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al enviar reseña');
      }
      setReviewSubmitSuccess('¡Reseña enviada!');
      setShowReviewModal(false);
      setNewReview({ book_id: '', experience_rate: 0, seller_rate: 0, comment: '' });
      // Refrescar lista
      setReviewsLoading(true);
      const data = await fetch(`${API_URL}/api/reviews/${user.id}`).then(r => r.json());
      setReviews(Array.isArray(data) ? data : []);
      setReviewsLoading(false);
      setCanReview(false);
    } catch (err) {
      setReviewSubmitError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  useEffect(() => {
    // Redirigir si no está loggeado
    if (!currentUser) {
      navigate('/login');
      return;
    }
    async function fetchUserAndBooks() {
      setLoading(true);
      try {
        const userRes = await fetch(`${API_URL}/api/users/${id}`);
        if (!userRes.ok) throw new Error('No se pudo cargar el usuario');
        const userData = await userRes.json();
        setUser(userData);
        const booksRes = await fetch(`${API_URL}/api/books/user/${id}`);
        const booksData = await booksRes.json();
        setBooks(Array.isArray(booksData) ? booksData : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUserAndBooks();
  }, [id, currentUser, navigate]);

  if (loading) return <div className="profile-main"><p>Cargando...</p></div>;
  if (error) return <div className="profile-main"><p>{error}</p></div>;
  if (!user) return <div className="profile-main"><p>Usuario no encontrado</p></div>;

  return (
    <>
      <Header />
      <div className="profile-dashboard-layout">
        <aside className="profile-sidebar">
          <div className="profile-sidebar-card">
            <div className="profile-sidebar-avatar">
              {user.photo_url || user.photoUrl ? (
  <img
    src={(user.photo_url ? `${API_URL}${user.photo_url}` : user.photoUrl)}
    alt={user.nombre || user.username || 'avatar'}
    onError={e => { e.target.src = '/Assets/images/default-avatar.png'; e.target.onerror = null; }}
    style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '50%' }}
  />
) : (
  <span>{user.nombre ? user.nombre[0] : (user.username ? user.username[0] : '?')}</span>
)}
            </div>
            <h2 className="profile-sidebar-name">{user.nombre} {user.apellido}</h2>
            {user.username && <p className="profile-sidebar-username">@{user.username}</p>}
            {user.bio && <p className="profile-sidebar-bio">{user.bio}</p>}
            {/* Calificación promedio vendedor */}
            <div style={{margin: '8px 0 4px 0', textAlign: 'center'}}>
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
                    </span>
                  );
                })()
              ) : (
                <span style={{fontSize:'14px',color:'#888'}}>Sin reseñas</span>
              )}
              <div style={{fontSize:'12px',color:'#888',marginTop:'-2px'}}>Calificación como vendedor</div>
            </div>
            <div className="profile-sidebar-stats">
              <div className="profile-sidebar-stat">
                <span className="profile-sidebar-stat-value">{books.filter(book => book.status === 'activo' || !book.status).length}</span>
                <span className="profile-sidebar-stat-label">Libros en venta</span>
              </div>
              <div className="profile-sidebar-stat">
                <span className="profile-sidebar-stat-value">{books.filter(book => book.status === 'vendido').length}</span>
                <span className="profile-sidebar-stat-label">Vendidos</span>
              </div>
            </div>
          </div>
        </aside>
        <main className="profile-main">
          <div className="profile-tabs">
            <div
              className={`profile-tab${activeTab === 'publicados' ? ' profile-tab-active' : ''}`}
              onClick={() => setActiveTab('publicados')}
              style={{cursor:'pointer'}}
            >
              Libros Publicados
            </div>
            <div
              className={`profile-tab${activeTab === 'vendidos' ? ' profile-tab-active' : ''}`}
              onClick={() => setActiveTab('vendidos')}
              style={{cursor:'pointer'}}
            >
              Libros Vendidos
            </div>
            <div
              className={`profile-tab${activeTab === 'resenas' ? ' profile-tab-active' : ''}`}
              onClick={() => setActiveTab('resenas')}
              style={{cursor:'pointer'}}
            >
              Reseñas
            </div>
          </div>

          {activeTab === 'publicados' && (
            <div className="profile-main-books-grid">
              {books.filter(book => book.status === 'activo' || !book.status).length === 0 ? (
                <div className="profile-main-empty-card">
                  <BookOpen size={48} color="#000" style={{marginBottom:12}} />
                  <h3>Este usuario no tiene libros publicados.</h3>
                  <p className="profile-main-empty-desc">Cuando publique un libro, aparecerá aquí.</p>
                </div>
              ) : (
                books.filter(book => book.status === 'activo' || !book.status).map(book => (
                  <BookCard
                    key={book.book_id}
                    img={getBookImage(book, API_URL)}
                    titulo={book.titulo || book.title || 'Sin título'}
                    autor={book.autor || book.author || (book.authors ? book.authors[0] : '') || ''}
                    precio={book.precio || book.price || ''}
                    book_id={book.book_id}
                    status={book.status}
                    showVerDetalles={true}
                    showFavorito={false}
                    showComprar={false}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'vendidos' && (
            <div className="profile-main-books-grid">
              {books.filter(book => book.status === 'vendido').length === 0 ? (
                <div className="profile-main-empty-card">
                  <BookOpen size={48} color="#000" style={{marginBottom:12}} />
                  <h3>Aún no ha vendido ningún libro.</h3>
                  <p className="profile-main-empty-desc">Cuando venda un libro, aparecerá aquí.</p>
                </div>
              ) : (
                books.filter(book => book.status === 'vendido').map(book => (
                  <BookCard
                    key={book.book_id}
                    img={getBookImage(book, API_URL)}
                    titulo={book.titulo || book.title || 'Sin título'}
                    autor={book.autor || book.author || (book.authors ? book.authors[0] : '') || ''}
                    precio={book.precio || book.price || ''}
                    book_id={book.book_id}
                    status={book.status}
                    showVerDetalles={false}
                    showFavorito={false}
                    showComprar={false}
                    onCardClick={() => {}}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'resenas' && (
            <div className="reviews-tailwind-root">
              {reviewsLoading ? (
                <p>Cargando reseñas...</p>
              ) : (
                <>
                  {reviews.length === 0 ? (
                    <div className="profile-main-empty-card">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square profile-icon" aria-hidden="true" style={{marginBottom: 12}}>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
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
                        // Admin check
                        const isAdmin = currentUser && currentUser.role === 'admin';
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
                              {/* Delete button only for admin */}
                              {isAdmin && (
                                <button
                                  className="reviews-tailwind-delete-btn"
                                  style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#e11d48', cursor: 'pointer', fontSize: 18 }}
                                  title="Eliminar reseña"
                                  onClick={() => {
                                    setReviewToDelete(review);
                                    setShowDeleteModal(true);
                                  }}
                                >
                                  🗑️
                                </button>
                              )}
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
        // Buscar el libro por id
        const b = books.find(bk => bk.book_id === review.book_id);
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
                  {canReview && (
  <>
    <button
      className="submit-btn"
      onClick={() => setShowReviewModal(true)}
      style={{
        backgroundColor: '#000',
        color: '#fff',
        fontSize: '17px',
        border: 'none',
        borderRadius: '8px',
        padding: '14px 32px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400,
        letterSpacing: '0.5px',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        marginTop: '16px',
        alignSelf: 'center',
      }}
    >
      + Agregar reseña
    </button>
    {showReviewModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" style={{fontFamily: 'Inter, sans-serif'}}>
        <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 relative animate-fade-in" style={{fontFamily: 'Inter, sans-serif'}}>
          <button
            className="absolute top-3 right-3 text-[#6b7580] text-2xl font-bold hover:text-[#131416]"
            onClick={() => setShowReviewModal(false)}
            aria-label="Cerrar"
          >
            ×
          </button>
          <h2 className="text-lg font-bold text-center mb-2" style={{fontFamily: 'Inter, sans-serif'}}>Nueva Reseña</h2>
          <form className="flex flex-col gap-2" onSubmit={handleSubmitReview} style={{width: '100%'}}>
            <div className="form-group-minimal">
              <label className="block text-[#22223b] text-sm mb-1 font-semibold">Libro:</label>
              <select
                className="form-input-minimal"
                name="book_id"
                value={newReview.book_id}
                onChange={e => setNewReview(r => ({ ...r, book_id: e.target.value }))}
                required
              >
                <option value="">Seleccionar</option>
                {books
  .filter(book => {
    // Solo mostrar libros vendidos
    const vendido = book.status === 'vendido' || book.estado === 'vendido';
    // No mostrar si ya existe reseña para ese libro y ese comprador
    const yaResenado = reviews.some(r => r.book_id === book.book_id && r.reviewer_id === currentUser.id);
    return vendido && !yaResenado;
  })
  .map(book => (
    <option key={book.book_id} value={book.book_id}>{book.titulo || book.title || 'Sin título'}</option>
  ))}
              </select>
            </div>
            <div className="form-group-minimal">
              <label className="block text-[#22223b] text-sm mb-1 font-semibold">Calificación experiencia:</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(n => (
                  <span
                    key={n}
                    onClick={() => setNewReview(r => ({ ...r, experience_rate: n }))}
                    className={`cursor-pointer text-2xl ${newReview.experience_rate >= n ? 'text-[#131416]' : 'text-[#dee0e3]'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="form-group-minimal">
              <label className="block text-[#22223b] text-sm mb-1 font-semibold">Calificación vendedor:</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(n => (
                  <span
                    key={n}
                    onClick={() => setNewReview(r => ({ ...r, seller_rate: n }))}
                    className={`cursor-pointer text-2xl ${newReview.seller_rate >= n ? 'text-[#131416]' : 'text-[#dee0e3]'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="form-group-minimal">
              <label className="block text-[#22223b] text-sm mb-1 font-semibold">Comentario:</label>
              <textarea
                name="comment"
                value={newReview.comment}
                onChange={e => setNewReview(r => ({ ...r, comment: e.target.value }))}
                required
                maxLength={500}
                placeholder="Escribe tu reseña"
                className="form-input-minimal min-h-[90px] text-base"
              />
            </div>
            <button
              type="submit"
              disabled={reviewSubmitting}
              className="save-btn-minimal mt-2"
              style={{width: '100%'}}
            >
              {reviewSubmitting ? 'Enviando...' : 'Enviar reseña'}
            </button>
            {reviewSubmitError && <div className="review-error text-red-600 text-sm mt-2">{reviewSubmitError}</div>}
          </form>
        </div>
      </div>
    )}
  </>
)}
                </> 
              )}
            </div>
          )}
        </main>
      </div>
      <Footer />
      {/* Modal de confirmación para eliminar reseña */}
      <ConfirmModal
        open={showDeleteModal}
        title="Eliminar reseña"
        message="¿Estás seguro que quieres eliminar esta reseña? Esta acción no se puede deshacer."
        onCancel={() => {
          setShowDeleteModal(false);
          setReviewToDelete(null);
          setDeleteError(null);
        }}
        onConfirm={async () => {
          if (!reviewToDelete) return;
          setDeleteLoading(true);
          setDeleteError(null);
          try {
            const token = getToken();
            const res = await fetch(`${API_URL}/api/reviews/${reviewToDelete.id || reviewToDelete.review_id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
              }
            });
            if (!res.ok) {
              const errData = await res.json();
              throw new Error(errData.message || 'Error al eliminar reseña');
            }
            setReviews(reviews => reviews.filter(r => (r.id || r.review_id) !== (reviewToDelete.id || reviewToDelete.review_id)));
            setShowDeleteModal(false);
            setReviewToDelete(null);
          } catch (err) {
            setDeleteError('No se pudo eliminar la reseña: ' + (err.message || err));
          } finally {
            setDeleteLoading(false);
          }
        }}
      />
      {deleteError && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow z-50">
          {deleteError}
        </div>
      )}
    </>
  );
}

export default PublicProfile;
                        
