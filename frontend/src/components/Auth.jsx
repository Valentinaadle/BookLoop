import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/registro';
      const response = await axios.post(endpoint, formData);
      
      if (response.data.usuario) {
        // Guardar el token o información del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(response.data.usuario));
        navigate('/'); // Redirigir al home
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Error al procesar la solicitud');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-2">
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <input type="checkbox" id="terms" required style={{accentColor:'#6366f1'}} />
                <label htmlFor="terms" style={{fontSize:'0.95rem',color:'#222'}}>
                  Acepto los <button type="button" style={{color:'#6366f1',textDecoration:'underline',background:'none',border:'none',cursor:'pointer',padding:0}} onClick={()=>setShowTerms(s=>!s)}>Términos y Condiciones</button>
                </label>
              </div>
              {showTerms && (
                <div style={{background:'#f3f4f6',borderRadius:8,padding:'1rem',marginTop:8,fontSize:'0.92rem',color:'#222',boxShadow:'0 2px 8px #0001'}}>
                  <strong>Términos y Condiciones de BookLoop</strong>
                  <ul style={{margin:'0.5rem 0 0 1.2rem',padding:0}}>
                    <li>BookLoop es solo una plataforma de contacto entre compradores y vendedores de libros usados.</li>
                    <li>No intervenimos ni garantizamos el pago, la entrega ni la calidad de los libros.</li>
                    <li>El dinero de la compra/venta se acuerda y transfiere directamente entre las partes.</li>
                    <li>BookLoop no se hace responsable por fraudes, pérdidas, daños o cualquier inconveniente derivado de la transacción.</li>
                    <li>Al registrarte, aceptas que eres responsable de verificar la identidad de la otra parte y de actuar con precaución.</li>
                    <li>El uso de la plataforma implica la aceptación de estos términos.</li>
                  </ul>
                </div>
              )}
            </div>
          )}
          {!isLogin && (
            <>
              <div>
                <label htmlFor="nombre" className="sr-only">Nombre</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="apellido" className="sr-only">Apellido</label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="username" className="sr-only">Nombre de usuario</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:text-indigo-500"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth; 