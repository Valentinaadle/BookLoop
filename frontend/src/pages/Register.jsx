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
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    username: '',
    password: '',
    terminos: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.terminos) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/registro', {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        username: formData.email, // Usando el email como username por defecto
        password: formData.password
      });

      console.log('Registro exitoso:', response.data);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.error || 'Error al registrar usuario');
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
            />
            <input 
              type="text" 
              name="apellido" 
              placeholder="Apellido" 
              required
              value={formData.apellido}
              onChange={handleChange}
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Correo electrónico" 
              required
              value={formData.email}
              onChange={handleChange}
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Contraseña (8 dígitos)" 
              pattern=".{8,}"
              title="La contraseña debe tener al menos 8 caracteres"
              required
              value={formData.password}
              onChange={handleChange}
            />

            <div className="terms">
              <input 
                type="checkbox" 
                name="terminos" 
                required
                checked={formData.terminos}
                onChange={handleChange}
              /> 
              <span>Acepto los términos y condiciones</span>
            </div>

            <button type="submit">Registrarse</button>

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