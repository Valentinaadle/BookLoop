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
      const response = await axios.post('http://localhost:5000/api/users/registro', {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        username: formData.username,
        password: formData.password
      });

      navigate('/login');
    } catch (error) {
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
      <main className="register-main-container-refined">
        <div className="register-content-wrapper">
          <div className="register-text-content-refined">
            <div className="logo-custom">BOOKLOOP</div>
            <div className="blue-divider"></div>
            <h1 className="slogan-refined">Descubrí tu próxima lectura favorita</h1>
            <p className="subtitle-refined">Formá parte del cambio: vendé, comprá y reciclá libros.</p>
          </div>

          <div className="register-form-container-refined">
            <div className="form-header-refined">
              <h3>Registrate en BookLoop</h3>
              <p>Empezá a descubrir y compartir libros.</p>
            </div>
            
            {error && <div className="error-message-refined">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-row-refined">
                <div className="form-group-refined">
                  <label htmlFor="nombre">Nombre</label>
                  <input 
                    id="nombre"
                    type="text" 
                    name="nombre" 
                    className="input-refined"
                    placeholder="Escribe tu nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="form-group-refined">
                  <label htmlFor="apellido">Apellido</label>
                  <input 
                    id="apellido"
                    type="text" 
                    name="apellido" 
                    className="input-refined"
                    placeholder="Escribe tu apellido"
                    required
                    value={formData.apellido}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group-refined">
                <label htmlFor="email">Correo electrónico</label>
                <input 
                  id="email"
                  type="email" 
                  name="email" 
                  className="input-refined"
                  placeholder="ejemplo@correo.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                <p className="info-text-refined">Tu correo se usará para iniciar sesión y recibir notificaciones.</p>
              </div>

              <div className="form-group-refined">
                <label htmlFor="username">Nombre de usuario</label>
                <input 
                  id="username"
                  type="text" 
                  name="username" 
                  className="input-refined"
                  placeholder="Elige un nombre de usuario"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-row-refined">
                <div className="form-group-refined">
                  <label htmlFor="password">Contraseña</label>
                  <input 
                    id="password"
                    type="password" 
                    name="password" 
                    className="input-refined"
                    placeholder="Crea una contraseña segura"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <p className="info-text-refined">Debe tener al menos 8 caracteres.</p>
                </div>
                <div className="form-group-refined">
                  <label htmlFor="confirmPassword">Confirmar contraseña</label>
                  <input 
                    id="confirmPassword"
                    type="password" 
                    name="confirmPassword" 
                    className="input-refined"
                    placeholder="Vuelve a escribir la contraseña"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="terms-refined">
                <input 
                  type="checkbox" 
                  id="terminos"
                  name="terminos" 
                  className="checkbox-refined"
                  required
                  checked={formData.terminos}
                  onChange={handleChange}
                  disabled={loading}
                /> 
                <label htmlFor="terminos">Acepto los términos y condiciones</label>
              </div>

              <button 
                type="submit"
                className="submit-btn-refined"
                disabled={loading}
              >
                {loading ? 'Registrando...' : <>Registrarse <span className="arrow-animation">→</span></>}
              </button>

              <div className="switch-form-link-refined">
                ¿Ya tienes cuenta? <Link to="/login" className="login-link">Inicia sesión</Link>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Register;