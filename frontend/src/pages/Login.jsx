import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/login.css';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      console.log('Login exitoso:', response.data);
      
      // Guardar el usuario en localStorage o en un estado global
      localStorage.setItem('user', JSON.stringify(response.data.usuario));
      
      // Redirigir al usuario a su perfil o página principal
      navigate('/profile');
    } catch (error) {
      setError(error.response?.data?.error || 'Error al iniciar sesión');
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
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn-login">Ingresar</button>
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