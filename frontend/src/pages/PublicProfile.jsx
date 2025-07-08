import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { getBookImage } from '../utils/bookUtils';
import '../Assets/css/profile.css';
import { BookOpen } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function PublicProfile() {
  const [activeTab, setActiveTab] = useState('publicados');
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.nombre || user.username || 'avatar'}
                  onError={e => { e.target.src = '/Assets/images/default-avatar.png'; e.target.onerror = null; }}
                />
              ) : (
                <span>{user.nombre ? user.nombre[0] : (user.username ? user.username[0] : '?')}</span>
              )}
            </div>
            <h2 className="profile-sidebar-name">{user.nombre} {user.apellido}</h2>
            {user.username && <p className="profile-sidebar-username">@{user.username}</p>}
            {user.bio && <p className="profile-sidebar-bio">{user.bio}</p>}
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
                    showVerDetalles={true}
                    showFavorito={false}
                    showComprar={false}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'resenas' && (
            <div className="profile-main-empty-card">
              <h3>Aún no tiene reseñas públicas</h3>
              <p className="profile-main-empty-desc">Cuando reciba una reseña, aparecerá aquí.</p>
            </div>
          )}

        </main>
      </div>
      <Footer />
    </>
  );
}
