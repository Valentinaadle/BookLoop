import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import '../Assets/css/login.css';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';
//import loginBg from '../Assets/login.png';

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
      <main className="login-main-container-refined">
        <div className="login-content-wrapper">
          <div className="login-text-content-refined">
            <h1 className="logo-custom">BOOKLOOP</h1>
            <div className="blue-divider"></div>
            <h2 className="slogan-refined">Accedé a tu cuenta y seguí impulsando la lectura circular.</h2>
            <p className="subtitle-refined">Donde los libros encuentran nuevos lectores</p>
          </div>
          
          <div className="login-form-container-refined">
            <div className="form-header-refined">
              <h3>Bienvenido de nuevo</h3>
              <p>Inicia sesión para continuar explorando BookLoop.</p>
            </div>
            {error && <div className="error-message-refined">{error}</div>}
            <form id="loginForm" onSubmit={handleSubmit}>
              <div className="form-group-refined">
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
                  className="input-refined"
                />
              </div>
              <div className="form-group-refined">
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
                  className="input-refined"
                />
              </div>
              <button 
                type="submit" 
                className="submit-btn-refined"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </span>
                ) : (
                  <>Ingresar <span className="arrow-animation">→</span></>
                )}
              </button>
              <div className="switch-form-link-refined">
                <span>¿No tienes una cuenta?</span>
                <Link to="/register" className="register-link-refined">Regístrate</Link>
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