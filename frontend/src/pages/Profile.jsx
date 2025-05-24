import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/profile.css';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';
import { useAuth } from '../context/AuthContext';

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
  const publishedBooks = 1; // Valor estático temporal
  const [nuevoInteres, setNuevoInteres] = useState('');

  useEffect(() => {
    if (user && user.id) {
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

      // fetch(`${API_URL}/api/books/user/${user.id}`)
      //   .then(res => res.json())
      //   .then(data => {
      //     setPublishedBooks(Array.isArray(data) ? data.length : 0);
      //   })
      //   .catch(err => console.error('Error al cargar libros:', err));
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
                  <i className="fas fa-book"></i> {publishedBooks} libros publicados
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
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;