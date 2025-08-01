import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';
import '../Assets/css/register.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    title: '',
    authors: '',
    description: '',
    price: '',
    condition: '',
    language: '',
    pageCount: '',
    publication_date: '',
    publisher: '',
    category_id: ''
  });
  const [categories, setCategories] = useState([]);
  const [bookImages, setBookImages] = useState([]); // { image_id, image_url }
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [newImages, setNewImages] = useState([]); // File objects
  const [coverIndex, setCoverIndex] = useState(0); // índice de la portada (en la lista combinada)
  const [coverPreview, setCoverPreview] = useState(null); // preview para la portada

  useEffect(() => {
    // Limpieza defensiva de residuos de hot reload o estados corruptos
    setNewImages(prev => Array.isArray(prev) ? prev.filter(obj => obj && obj.file && obj.blobUrl) : []);
    const fetchBook = async () => {
      try {
        const response = await fetch(`${API_URL}/api/books/${id}`);
        if (!response.ok) throw new Error('Error al cargar el libro');
        const data = await response.json();
        setBook(data);
        setForm({
          title: data.title || '',
          authors: Array.isArray(data.authors) ? data.authors.join(', ') : data.authors || '',
          description: data.description || '',
          price: data.price || '',
          condition: data.condition || '',
          language: data.language || '',
          pageCount: data.pageCount || data.paginas || data.pages || '',
          publication_date: data.publication_date || '',
          publisher: data.publisher || '',
          category_id: data.category_id || data.Category?.category_id || ''
        });
        // Usar los campos images (array de URLs) y coverimageurl del backend
        let imgs = [];
        if (Array.isArray(data.images)) {
          imgs = data.images.map((url, idx) => ({ image_id: idx, image_url: url }));
        }
        setBookImages(imgs);
        // Determinar el índice de la portada actual
        let coverIdx = 0;
        if (data.coverimageurl && imgs.length > 0) {
          const found = imgs.findIndex(img => img.image_url === data.coverimageurl);
          coverIdx = found !== -1 ? found : 0;
        }
        setCoverIndex(coverIdx);
        setCoverPreview(imgs[coverIdx]?.image_url || null);
      } catch (err) {
        setError('Error al cargar el libro: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categories`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchBook();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewImages(prev => {
        // Guardar file y blobUrl para cada imagen nueva
        const newImgs = [...prev, ...files.map(file => ({ file, blobUrl: URL.createObjectURL(file) }))];
        setTimeout(() => {
          const allImgs = [
            ...bookImages.filter(img => !deletedImageIds.includes(img.image_id)),
            ...newImgs.map(obj => ({ type: 'new', image_url: obj.blobUrl, file: obj.file }))
          ];
          if (allImgs.length === files.length) {
            setCoverIndex(allImgs.length - 1);
            setCoverPreview(allImgs[allImgs.length - 1].image_url);
          }
        }, 0);
        return newImgs;
      });
    }
  };

  const handleDeleteImage = (img) => {
    // Si es imagen nueva (no subida aún)
    if (img.type === 'new' || img.file) {
      setNewImages(prev => {
        const filtered = prev.filter(obj => obj.blobUrl !== img.image_url);
        setTimeout(() => {
          const allImgs = [
            ...bookImages.filter(img => !deletedImageIds.includes(img.image_id)),
            ...filtered.map(obj => ({ type: 'new', image_url: obj.blobUrl, file: obj.file }))
          ];
          if (allImgs.length === 0) {
            setCoverIndex(0);
            setCoverPreview(null);
          } else if (coverIndex >= allImgs.length) {
            setCoverIndex(allImgs.length - 1);
            setCoverPreview(allImgs[allImgs.length - 1].image_url);
          }
        }, 0);
        return filtered;
      });
    } else if (img.image_id !== undefined) {
      // Imagen existente subida previamente
      setDeletedImageIds(prev => {
        const updated = [...prev, img.image_id];
        setTimeout(() => {
          const allImgs = [
            ...bookImages.filter(img => !updated.includes(img.image_id)),
            ...newImages.map(obj => ({ type: 'new', image_url: obj.blobUrl, file: obj.file }))
          ];
          if (allImgs.length === 0) {
            setCoverIndex(0);
            setCoverPreview(null);
          } else if (coverIndex >= allImgs.length) {
            setCoverIndex(allImgs.length - 1);
            setCoverPreview(allImgs[allImgs.length - 1].image_url);
          }
        }, 0);
        return updated;
      });
    }
  };

  const handleSetCover = (idx, previewUrl) => {
    setCoverIndex(idx);
    setCoverPreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Subir imágenes nuevas a Supabase y obtener URLs públicas
      const supabaseImageUrls = [];
      for (const imgObj of newImages) {
        if (imgObj.file) {
          const formDataImg = new FormData();
          formDataImg.append('image', imgObj.file);
          const res = await fetch(`${API_URL}/api/books/upload-image`, {
            method: 'POST',
            body: formDataImg
          });
          if (!res.ok) throw new Error('Error al subir la imagen');
          const data = await res.json();
          supabaseImageUrls.push(data.imageurl); // <- usar la clave correcta del backend
        }
      }
      // DEBUG: Loggear imágenes antes de validar
      console.log('bookImages:', bookImages);
      console.log('deletedImageIds:', deletedImageIds);
      console.log('supabaseImageUrls:', supabaseImageUrls);
      const finalImages = [
        ...bookImages.filter(img => !deletedImageIds.includes(img.image_id)).map(img => img.image_url),
        ...supabaseImageUrls
      ];
      console.log('finalImages:', finalImages);
      if (finalImages.length === 0) {
        setError('Debes agregar por lo menos una imagen');
        setLoading(false);
        return;
      }
      // Validación de URLs públicas de imágenes (removida)
      // const allSupabase = finalImages.every(url =>
      //   typeof url === 'string' && url.includes('.supabase.co/storage/v1/object/public/book-images/')
      // );
      // if (!allSupabase) {
      //   setError('Todas las imágenes deben ser URLs públicas de Supabase.');
      //   setLoading(false);
      //   return;
      // }
      // Construir payload usando finalImages
      const payload = {
        ...form,
        images: finalImages,
        deletedImageIds,
        coverIndex,
        coverimageurl: finalImages[coverIndex] || finalImages[0] || null,
        // pageCount debe ir como pageCount (camelCase) para el backend
        pageCount: form.pageCount,
      };
      const response = await fetch(`${API_URL}/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el libro');
      }
      setSuccess('¡Libro actualizado exitosamente!');
      setNewImages([]);
      setDeletedImageIds([]);
      setTimeout(() => {
        navigate(`/book/${id}`); // Redirige al detalle del libro editado
      }, 800);
    } catch (err) {
      setError('Error al actualizar el libro: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar el formulario solo cuando los datos estén cargados o si hay error
  if (!form.title && !error) return null;
  return (
    <>
      <Header />
      <main className="edit-book-container">
        <div className="quierovender-form-container">
          
            <h3>Editar Libro</h3>
          
          {error && <div className="error-message-refined">{error}</div>}
          {success && <div className="error-message-refined" style={{color:'#27ae60',background:'#eafaf1',border:'1px solid #b2f2bb'}}>{success}</div>}
          <form className="sell-form" onSubmit={handleSubmit}>
            <div style={{textAlign:'center',marginBottom:16}}>
              <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center'}}>
                {[...bookImages.filter(img => !deletedImageIds.includes(img.image_id)).map(img => ({
                  type: 'existing',
                  ...img,
                  image_url: img.image_url && !img.image_url.startsWith('http') ? `${API_URL}${img.image_url}` : img.image_url
                })),
                ...Array.isArray(newImages) ? newImages.filter(obj => obj && obj.file && obj.blobUrl).map(obj => ({ type: 'new', image_url: obj.blobUrl, file: obj.file })) : []
                ].map((img, idx) => (
                  <div key={img.image_id || img.image_url || img.file?.name} style={{position:'relative',display:'inline-block'}}>
                    <img src={img.image_url} alt={`Imagen ${idx+1}`} style={{width:80,height:110,objectFit:'cover',border:coverIndex===idx?'2px solid #007bff':'1px solid #ccc',borderRadius:6,cursor:'pointer'}} onClick={() => {
                      handleSetCover(idx, img.image_url);
                    }} />
                    <button type="button" title="Eliminar" style={{position:'absolute',top:2,right:2,background:'#fff',border:'none',borderRadius:'50%',padding:'2px 6px',cursor:'pointer',fontWeight:'bold',fontSize:16,color:'#c00',lineHeight:1}} onClick={()=> handleDeleteImage(img)}>✖</button>
                    {coverIndex===idx && <span style={{position:'absolute',bottom:2,left:2,background:'#007bff',color:'#fff',fontSize:10,padding:'2px 5px',borderRadius:3}}>Portada</span>}
                  </div>
                ))}
              </div>
              <label style={{display:'block',marginTop:12}}>
                <span style={{fontWeight:600,marginRight:8}}><i className="fas fa-image"></i> Portada</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAddImages}
                  className="form-group"
                  style={{marginBottom:8,maxWidth:220}}
                />
              </label>
            </div>
            <div className="form-group">
              <label className="form-group label">
                Título </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Título del libro"
                />
             
            </div>
            <div className="form-group">
              <label className='form-group label'>
                 Autores</label>
                <input
                  type="text"
                  name="authors"
                  value={form.authors}
                  onChange={handleChange}
                  placeholder="Autores (separados por comas)"
                />
              
            </div>
            <div className="form-group">
              <label className='form-group label'>
                Descripción</label> 
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Descripción del libro"
                  rows="4"
                />
              
            </div>
            <div className="form-row">
              <div className="form-group">
                  <label className='form-group label'>
                  Precio</label>
                  <input
                    type="number"   
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Precio del libro"
                    min="0"
                    step="0.01"
                  />
                
              </div>

              <div className="form-group">
                <label className='form-group label'>
                Estado </label>
                  <select
                    name="condition"
                    value={form.condition}
                    onChange={handleChange}
                    required
                    className="form-group"
                  >
                    <option value="">Seleccionar estado</option>
                    <option value="Nuevo">Nuevo</option>
                    <option value="Como nuevo">Como nuevo</option>
                    <option value="Buen estado">Buen estado</option>
                    <option value="Aceptable">Aceptable</option>
                  </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className='form-group label'>
                   Idioma</label>
                  <input
                    type="text"
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    placeholder="Idioma del libro"
                  />
              </div>

              <div className="form-group">
              <label className='form-group label'> Número de páginas</label>
                  <input
                    type="number"
                    name="pageCount"
                    value={form.pageCount}
                    onChange={handleChange}
                    className="form-group"
                    placeholder="Número de páginas"
                    min="0"
                  />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
              <label className='form-group label'>
                  Fecha de publicación</label>
                  <input
                    type="text"
                    name="publication_date"
                    value={form.publication_date}
                    onChange={handleChange}
                    className="form-group"
                  />
              </div>

              <div className="form-group">
              <label className='form-group label'>
                   Editorial</label>
                  <input
                    type="text"
                    name="publisher"
                    value={form.publisher}
                    onChange={handleChange}
                    className="form-group"
                    placeholder="Editorial"
                  />
              </div>
            </div>

            <div className="form-group">
              <label className='form-group label'>
                Categoría</label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                  className="form-group"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                  ))}
                </select>
              
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn-refined" disabled={loading}>
                <i className="fas fa-save"></i> Guardar cambios
              </button>
              <button type="button" className="submit-btn-refined cancel-btn-refined" onClick={() => navigate('/profile')}>
                <i className="fas fa-times"></i> Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default EditBook; 