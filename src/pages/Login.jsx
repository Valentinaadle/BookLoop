import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/login.css';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de login aquí
    console.log({ email, password });
  };

  return (
    <>
      <Header />
      <main>
        <div className="login-container">
          <div className="login-form">
            <h2>Iniciar Sesión</h2>
            <form id="loginForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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