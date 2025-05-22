import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/quierovender.css';

const pasos = [
  {
    titulo: 'Registrate',
    descripcion: 'Crea tu cuenta en BookLoop para poder iniciar la venta de tu libro.',
    icono: '/icons/register.jpg'
  },
  {
    titulo: 'Ingresa el codigo ISBN',
    descripcion: 'Para encontrar el codigo, busca en la tapa del libro, junto al codigo de barras',
    icono: '/icons/images.png'
  },
  {
    titulo: 'Selecciona un estado',
    descripcion: 'Selecciona el estado de tu libro, desplega la lista y elegi el estado indicado.',
    icono: '/icons/estado.png'
  },
  {
    titulo: 'Pone un precio',
    descripcion: 'Elegi un precio razonable para la venta de tu libro y publicalo!',
    icono: '/icons/precio.webp'
  }
];

export default function QuieroVender() {
  const [formData, setFormData] = useState({
    isbn: '',
    nombre: '',
    autor: '',
    idioma: '',
    estado: '',
    precio: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleISBNBlur = async () => {
    // Simular llamada a API con ISBN
    if (formData.isbn.length > 5) {
      // Aquí deberías hacer la llamada real
      setFormData(prev => ({
        ...prev,
        nombre: 'Libro de Ejemplo',
        autor: 'Autor de Prueba'
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Enviando datos del libro:', formData);
    // Aquí podrías enviar los datos al backend
  };

  return (
    <>
      <Header />
      <div className="vender-container">
        <h2>Vende tus libros de forma rápida y sencilla en BookLoop</h2>
        
        <div className="pasos-grid">
          {pasos.map((paso, index) => (
            <div key={index} className="paso-card">
              <img src={paso.icono} alt={paso.titulo} className="paso-icono" />
              <h3>{paso.titulo}</h3>
              <p>{paso.descripcion}</p>
            </div>
          ))}
        </div>

        <div className="form-container">
          <h2>Formulario de venta</h2>
          <form className="sell-form" onSubmit={handleSubmit}>
        {/* ISBN solo */}
        <div className="form-group">
            <label htmlFor="isbn">ISBN</label>
            <input
            type="text"
            id="isbn"
            name="isbn"
            placeholder="Ej: 978-950-07-1234-5"
            value={formData.isbn}
            onChange={handleChange}
            required
            />
        </div>

        {/* Autor y Título juntos */}
        <div className="form-row">
            <div className="form-group">
            <label htmlFor="autor">Autor</label>
            <input
                type="text"
                id="autor"
                name="autor"
                placeholder="Ej: Gabriel García Márquez"
                value={formData.autor}
                onChange={handleChange}
                required
            />
            </div>

            <div className="form-group">
            <label htmlFor="titulo">Título</label>
            <input
                type="text"
                id="titulo"
                name="titulo"
                placeholder="Ej: Cien años de soledad"
                value={formData.titulo}
                onChange={handleChange}
                required
            />
            </div>
        </div>

        {/* Idioma (select) y Precio */}
        <div className="form-row">
            <div className="form-group">
            <label htmlFor="idioma">Idioma</label>
            <select
                id="idioma"
                name="idioma"
                value={formData.idioma}
                onChange={handleChange}
                required
            >
                <option value="">Seleccionar idioma</option>
                <option value="Español">Español</option>
                <option value="Inglés">Inglés</option>
                <option value="Francés">Francés</option>
                <option value="Otro">Otro</option>
            </select>
            </div>

            <div className="form-group">
            <label htmlFor="precio">Precio</label>
            <input
                type="number"
                id="precio"
                name="precio"
                placeholder="Ej: 3500"
                value={formData.precio}
                onChange={handleChange}
                required
            />
            </div>
        </div>

        {/* Estado solo */}
        <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
            >
            <option value="">Seleccionar estado</option>
            <option value="Nuevo">Nuevo</option>
            <option value="Como nuevo">Como nuevo</option>
            <option value="Buen estado">Buen estado</option>
            <option value="Usado">Usado</option>
            <option value="Dañado">Dañado</option>
            </select>
        </div>

        <button className="submit-btn" type="submit">
            Publicar libro
        </button>
        </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
