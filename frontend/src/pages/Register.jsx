import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/register.css';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';

function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de registro aquí
    console.log(formData);
  };

  return (
    <>
      <Header />
      <main>
        <div className="form-container">
          <h2>Registrarse en BookLoop</h2>
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