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
      const response = await axios.post('http://localhost:5000/api/auth/registro', {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        username: formData.username,
        password: formData.password
      });

      console.log('Registro exitoso:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Error en registro:', error);
      setError(error.response?.data?.error || 'Error al registrar usuario. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main>
        <div className="form-container">
          <h2>Registrarse en BookLoop</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="nombre" 
              placeholder="Nombre" 
              required
              value={formData.nombre}
              onChange={handleChange}
              disabled={loading}
            />
            <input 
              type="text" 
              name="apellido" 
              placeholder="Apellido" 
              required
              value={formData.apellido}
              onChange={handleChange}
              disabled={loading}
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Correo electrónico" 
              required
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <input 
              type="text" 
              name="username" 
              placeholder="Nombre de usuario" 
              required
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Contraseña (mínimo 8 caracteres)" 
              required
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <input 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirmar contraseña" 
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />

            <div className="terms">
              <input 
                type="checkbox" 
                name="terminos" 
                required
                checked={formData.terminos}
                onChange={handleChange}
                disabled={loading}
              /> 
              <span>Acepto los términos y condiciones</span>
            </div>

            <button 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>

            <div className="small-text">
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