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
          <div className="login-form">
            <h2>Iniciar Sesión</h2>
            {error && <div className="error-message">{error}</div>}
            <form id="loginForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
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
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <button 
                  type="submit" 
                  className="btn-login"
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Ingresar'}
                </button>
              </div>
              <div className="form-links">
                <Link to="/register">¿No tienes una cuenta? Regístrate</Link>
                <Link to="/recover-password">¿Olvidaste tu contraseña?</Link>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Login;