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
    username: '',
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
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      console.log('Login exitoso:', response.data);
      
      // Guardar el usuario en el contexto global y en localStorage
      login(response.data.usuario);
      
      // Redirigir al usuario a la página principal de compra
      navigate('/comprar');
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.response?.data?.error || 'Error al iniciar sesión. Por favor, intenta de nuevo.');
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
                <label htmlFor="username">Usuario o Correo electrónico</label>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  required
                  value={formData.username}
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