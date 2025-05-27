import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/profile.css';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Lista predefinida de intereses
const INTERESES_PREDEFINIDOS = [
  "Novela", "Poesía", "Ciencia Ficción", "Fantasía", "Misterio", 
  "Romance", "Historia", "Biografía", "Ciencia", "Filosofía",
  "Arte", "Música", "Cine", "Teatro", "Cómic"
];

function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ 
    nombre: '', 
    apellido: '', 
    email: '', 
    username: '', 
    intereses: [] 
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [publishedBooks, setPublishedBooks] = useState([]);
  const [nuevoInteres, setNuevoInteres] = useState('');

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
            username: data.username || '',
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
          username: form.username
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

  const agregarInteres = () => {
    if (nuevoInteres && !form.intereses.includes(nuevoInteres)) {
      setForm(prev => ({
        ...prev,
        intereses: [...prev.intereses, nuevoInteres]
      }));
      setNuevoInteres('');
    }
  };

  const eliminarInteres = (interes) => {
    setForm(prev => ({
      ...prev,
      intereses: prev.intereses.filter(i => i !== interes)
    }));
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
              <p>{form.username}</p>
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
                    {editMode && (
                      <button 
                        onClick={() => eliminarInteres(interes)}
                        className="eliminar-interes"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="profile-actions">
            <button onClick={() => setEditMode(true)} className="edit-button">
              <i className="fas fa-edit"></i> Editar perfil
            </button>
          </div>
          {editMode && (
            <form className="edit-profile-form" onSubmit={handleSave}>
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
                  <i className="fas fa-at"></i> Username
                  <input 
                    type="text" 
                    name="username" 
                    value={form.username} 
                    onChange={handleChange} 
                    required 
                    className="form-input"
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  <i className="fas fa-heart"></i> Intereses
                  <div className="intereses-input">
                    <input 
                      type="text" 
                      value={nuevoInteres}
                      onChange={(e) => setNuevoInteres(e.target.value)}
                      placeholder="Agregar un interés"
                      className="form-input"
                      list="intereses-sugeridos"
                    />
                    <datalist id="intereses-sugeridos">
                      {INTERESES_PREDEFINIDOS.map((interes, index) => (
                        <option key={index} value={interes} />
                      ))}
                    </datalist>
                    <button 
                      type="button" 
                      onClick={agregarInteres}
                      className="agregar-interes"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </label>
              </div>
              <div className="edit-buttons">
                <button type="submit" className="save-button">
                  <i className="fas fa-save"></i> Guardar
                </button>
                <button type="button" onClick={() => setEditMode(false)} className="cancel-button">
                  <i className="fas fa-times"></i> Cancelar
                </button>
              </div>
            </form>
          )}
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          {/* Sección de libros publicados */}
          <div className="published-books-section">
            <h3>Mis Publicaciones Activas</h3>
            {publishedBooks.length === 0 ? (
              <p className="no-books">No tienes libros publicados</p>
            ) : (
              <div className="books-grid">
                {publishedBooks.map(book => {
                  // Lógica para obtener la imagen igual que en BookCard
                  let imageUrl = '/placeholder-book.png';
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
                    <div key={book.book_id} className="book-card" style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', padding: '0', margin: '10px', width: '250px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => window.location.href = `/book/${book.book_id}`}
                    >
                      <img 
                        src={imageUrl} 
                        alt={book.title}
                        className="book-cover"
                        style={{ width: '90%', height: '270px', objectFit: 'cover', borderRadius: '8px', marginTop: '32px' }}
                        onError={e => { e.target.src = '/placeholder-book.png'; }}
                      />
                      <div className="book-card-content" style={{ padding: '16px', textAlign: 'center', width: '100%' }}>
                        <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', margin: '10px 0 4px 0', color: '#333' }}>{book.title}</h4>
                        <p style={{ color: '#666', fontSize: '0.95rem', margin: 0 }}>
                          de {(() => {
                            if (Array.isArray(book.authors)) {
                              return book.authors.join(', ');
                            } else if (typeof book.authors === 'string') {
                              // Si es string y parece un array serializado
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
                              return '';
                            }
                          })()}
                        </p>
                        <p style={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#394B60', margin: '12px 0 8px 0' }}>{book.price ? `$${parseFloat(book.price).toFixed(2)}` : 'Precio no disponible'}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', width: '90%', marginBottom: '16px', justifyContent: 'center' }}
                        onClick={e => e.stopPropagation()} // Evita que el click en los botones navegue
                      >
                        <Link to={`/edit-book/${book.book_id}`} className="edit-button" style={{ background: '#394B60', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '0.9rem', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <i className="fas fa-edit"></i> Editar
                        </Link>
                        <button 
                          onClick={() => handleDeleteBook(book.book_id)}
                          className="delete-button"
                          style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                        >
                          <i className="fas fa-trash"></i> Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;