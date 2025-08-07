import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/quierovender.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const pasos = [
  {
    titulo: 'Registrate en BookLoop.',
    descripcion: 'Crea tu cuenta y luego inicia sesión para poder iniciar la venta de tu libro.',
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
    titulo: 'Elegi un precio razonable',
    descripcion: 'Por ultimo, pone un precio adecuado a tu libro y publicalo!',
    icono: '/icons/precio.webp'
  }
];
const genresToExclude = ['Ciencias', 'Filosofía', 'Fantasía', 'Escolar'];


export default function QuieroVender() {
  const [formData, setFormData] = useState({
    isbn: '',
    titulo: '',
    autor: '',
    idioma: '',
    estado: '',
    categoria: '',
    precio: '',
    descripcion: '',
    imagen: '',
    paginas: '',
    publicacion: '',
    editorial: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Concatenar nuevas imágenes con las ya existentes
    setImages(prev => [...prev, ...files]);
    // Concatenar previsualizaciones nuevas con las anteriores
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  // Buscar datos del libro por ISBN en Google Books
  const handleISBNBlur = async () => {
    if (formData.isbn.length > 5) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/search-isbn?isbn=${formData.isbn}`);
        if (!response.ok) {
          const data = await response.json();
          setError(data.error || 'No se encontró información para ese ISBN.');
          setLoading(false);
          return;
        }
        const info = await response.json();
        console.log('Respuesta de Google Books desde endpoint:', info);
        setFormData(prev => ({
          ...prev,
          titulo: info.titulo || '',
          autor: info.autor || '',
          idioma: info.idioma || '',
          descripcion: info.descripcion || '',
          imagen: info.imagen || '',
          paginas: info.paginas || '',
          publicacion: info.publicacion || ''
        }));
      } catch (err) {
        setError('Error al buscar el libro por ISBN.');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Cargar categorías desde la API
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Enviar datos al backend para crear el libro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Validación: debe haber al menos una imagen o una URL de portada
      if ((!images || images.length === 0) && !formData.imagen) {
        setError('Debes agregar al menos una imagen o una URL de portada');
        setLoading(false);
        return;
      }
      // Subir imágenes al backend y obtener las URLs
      let imageUrls = [];
      if (images && images.length > 0) {
        for (const file of images) {
          const formDataImg = new FormData();
          formDataImg.append('image', file);
          const res = await fetch(`${process.env.REACT_APP_API_URL}/api/books/upload-image`, {
            method: 'POST',
            body: formDataImg
          });
          if (!res.ok) throw new Error('Error al subir la imagen');
          const data = await res.json();
          const url = data.url || data.imageurl;
          if (!url) throw new Error('No se pudo obtener la URL pública de la imagen');
          imageUrls.push(url);
        }
      }
      // Si no hay imágenes subidas pero sí URL, usar la URL como imagen principal
      if (imageUrls.length === 0 && formData.imagen) {
        imageUrls = [formData.imagen];
      }
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.titulo,
          authors: formData.autor.split(',').map(a => a.trim()),
          description: formData.descripcion,
          imageUrl: imageUrls[coverIndex] || imageUrls[0] || '', // portada
          images: imageUrls,
          isbn_code: formData.isbn,
          language: formData.idioma,
          pagecount: formData.paginas,
          publication_date: formData.publicacion,
          price: formData.precio,
          condition: formData.estado,
          category_id: formData.categoria,
          seller_id: user?.id,
          publisher: formData.editorial,
          coverimageurl: imageUrls[coverIndex] || imageUrls[0] || '' // <- para backend
        })
      });
      if (!response.ok) throw new Error('Error al crear el libro');
      const newBook = await response.json();
      setSuccess('¡Libro publicado correctamente!');
      // Redirigir a la vista de compra del libro
      navigate(`/book/${newBook.book_id}`);
    } catch (err) {
      setError('Error al publicar el libro.');
    } finally {
      setLoading(false);
    }
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

        <div className="quierovender-form-container">
          <h2>Formulario de venta</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <form className="sell-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="isbn">ISBN</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                placeholder="Ej: 978-950-07-1234-5"
                value={formData.isbn}
                onChange={handleChange}
                onBlur={handleISBNBlur}
                required
              />
            </div>
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
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="idioma">Idioma</label>
                <input
                  type="text"
                  id="idioma"
                  name="idioma"
                  placeholder="Ej: Español"
                  value={formData.idioma}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="editorial">Editorial</label>
                <input
                  type="text"
                  id="editorial"
                  name="editorial"
                  placeholder="Ej: Planeta"
                  value={formData.editorial}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="estado">Estado</label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona el estado</option>
                  <option value="Nuevo">Nuevo</option>
                  <option value="Como nuevo">Como nuevo</option>
                  <option value="Buen estado">Buen estado</option>
                  <option value="Aceptable">Aceptable</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="precio">Precio</label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  placeholder="Ej: 1500"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="paginas">Páginas</label>
                <input
                  type="number"
                  id="paginas"
                  name="paginas"
                  placeholder="Ej: 350"
                  value={formData.paginas}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="publicacion">Año de publicación</label>
                <input
                  type="text"
                  id="publicacion"
                  name="publicacion"
                  placeholder="Ej: 1967"
                  value={formData.publicacion}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="categoria">Categoría</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una categoría</option>
                {categories
                  .filter(cat => !genresToExclude.includes(cat.category_name))
                  .map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                ))}
                
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="descripcion">Descripción del libro</label>
              <textarea
                id="descripcion"
                name="descripcion"
                placeholder="Escribe una breve sinopsis del libro."
                value={formData.descripcion}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="imagen">URL de la portada</label>
              <input
                type="text"
                id="imagen"
                name="imagen"
                placeholder="URL de la portada"
                value={formData.imagen}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="images">Imágenes del libro</label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                onChange={handleImageChange}
              />
              <div className="image-previews" style={{display:'flex',gap:10,flexWrap:'wrap',justifyContent:'center',marginTop:10}}>
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} style={{position:'relative',display:'inline-block'}}>
                    <img
                      src={preview}
                      alt={`Previsualización ${idx+1}`}
                      style={{width:70,height:90,objectFit:'cover',border:coverIndex===idx?'2px solid #305681':'2px solid #e9ecef',borderRadius:8,boxShadow:coverIndex===idx?'0 0 8px #305681':'none'}}
                      onClick={()=>setCoverIndex(idx)}
                    />
                    {coverIndex===idx ? (
                      <span style={{position:'absolute',bottom:2,left:2,background:'#305681',color:'#fff',padding:'2px 6px',borderRadius:4,fontSize:11}}>Portada</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Publicando...' : 'Publicar libro'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
