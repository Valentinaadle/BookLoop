import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import '../Assets/css/login.css';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Enviando datos de login:', formData);
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      console.log('Respuesta del servidor:', response.data);
      
      if (response.data.user) {
        // Usar el contexto de autenticación para guardar el usuario
        login(response.data.user);
        navigate('/');
      } else {
        setError('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Error al iniciar sesión. Por favor, intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main>
        <div className="login-container">
          <div className="form-header">
            <h2>Bienvenido de nuevo</h2>
            <p>Inicia sesión para continuar explorando BookLoop.</p>
          </div>
          {error && <div className="error-message">{error}</div>}
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="ejemplo@correo.com"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Introduce tu contraseña"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Ingresar →'}
              </button>
              <div className="switch-form-link">
              <Link to="/register">¿No tienes una cuenta? Regístrate</Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Login;