import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/register.css';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    terminos: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar mensaje de error cuando el usuario empieza a escribir
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.terminos) {
      setError('Debes aceptar los términos y condiciones');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('Enviando datos de registro:', {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        username: formData.username,
        password: formData.password
      });

      const response = await axios.post('http://localhost:5000/api/users/registro', {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        username: formData.username,
        password: formData.password
      });

      console.log('Respuesta del servidor:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Error al registrar usuario. Por favor, intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main>
        <div className="register-container">
          <div className="form-header">
            <h2>Registrarse en BookLoop</h2>
            <p>Regístrate para empezar a descubrir y compartir libros.</p>
          </div>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input 
                id="nombre"
                type="text" 
                name="nombre" 
                placeholder="Escribe tu nombre"
                required
                value={formData.nombre}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input 
                id="apellido"
                type="text" 
                name="apellido" 
                placeholder="Escribe tu apellido"
                required
                value={formData.apellido}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input 
                id="email"
                type="email" 
                name="email" 
                placeholder="ejemplo@correo.com"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              <p className="info-text">Tu correo se usará para iniciar sesión y recibir notificaciones.</p>
            </div>
            <div className="form-group">
              <label htmlFor="username">Nombre de usuario</label>
              <input 
                id="username"
                type="text" 
                name="username" 
                placeholder="Elige un nombre de usuario"
                required
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input 
                id="password"
                type="password" 
                name="password" 
                placeholder="Crea una contraseña segura"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              <p className="info-text">Debe tener al menos 8 caracteres.</p>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input 
                id="confirmPassword"
                type="password" 
                name="confirmPassword" 
                placeholder="Vuelve a escribir la contraseña"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="terms">
              <input 
                type="checkbox" 
                id="terminos"
                name="terminos" 
                required
                checked={formData.terminos}
                onChange={handleChange}
                disabled={loading}
              /> 
              <label htmlFor="terminos">Acepto los términos y condiciones</label>
            </div>

            <button 
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse →'}
            </button>

            <div className="switch-form-link">
              <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Register;