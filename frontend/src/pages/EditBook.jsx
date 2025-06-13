import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';

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
          pageCount: data.pageCount || '',
          publication_date: data.publication_date || '',
          publisher: data.publisher || '',
          category_id: data.category_id || data.Category?.category_id || ''
        });
        // Gather all images
        let imgs = [];
        if (Array.isArray(data.Images)) {
          imgs = data.Images.map(img => ({ image_id: img.image_id, image_url: img.image_url }));
        }
        // Also add imageUrl if not in Images array
        if (data.imageUrl && !imgs.some(i => i.image_url === data.imageUrl)) {
          imgs.push({ image_id: null, image_url: data.imageUrl });
        }
        setBookImages(imgs);
        // Set cover image
        let cover = data.coverImageUrl || data.imageUrl || (imgs.length > 0 ? imgs[imgs.length-1].image_url : null);
        setCoverPreview(cover);
        // Por defecto, la portada es la última imagen
        setCoverIndex(imgs.length > 0 ? imgs.length - 1 : 0);
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
        const newImgs = [...prev, ...files];
        // Solo si no hay imágenes, la portada será la nueva
        setTimeout(() => {
          const allImgs = [
            ...bookImages.filter(img => !deletedImageIds.includes(img.image_id)),
            ...newImgs.map(file => ({ type: 'new', image_url: URL.createObjectURL(file), file }))
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
        const filtered = prev.filter(f => f.name !== (img.file?.name || img.image_url));
        setTimeout(() => {
          const allImgs = [
            ...bookImages.filter(img => !deletedImageIds.includes(img.image_id)),
            ...filtered.map(file => ({ type: 'new', image_url: URL.createObjectURL(file), file }))
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
    } else if (img.image_id) {
      setDeletedImageIds(prev => {
        const updated = [...prev, img.image_id];
        setTimeout(() => {
          const allImgs = [
            ...bookImages.filter(img => !updated.includes(img.image_id)),
            ...newImages.map(file => ({ type: 'new', image_url: URL.createObjectURL(file), file }))
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
      setBookImages(prev => prev.filter(i => i.image_id !== img.image_id));
    } else if (img.image_url) {
      setNewImages(prev => {
        const filtered = prev.filter(f => f.name !== img.image_url);
        setTimeout(() => {
          const allImgs = [
            ...bookImages.filter(img => !deletedImageIds.includes(img.image_id)),
            ...filtered.map(file => ({ type: 'new', image_url: URL.createObjectURL(file), file }))
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
      let autoresArray = form.authors;
      if (typeof autoresArray === 'string') {
        try {
          const parsed = JSON.parse(autoresArray);
          if (Array.isArray(parsed)) {
            autoresArray = parsed;
          } else {
            autoresArray = [autoresArray];
          }
        } catch {
          autoresArray = autoresArray.split(',').map(a => a.trim());
        }
      }
      if (Array.isArray(autoresArray)) {
        autoresArray = autoresArray.flat(Infinity).map(a => typeof a === 'string' ? a.trim() : a).filter(Boolean);
      }

      // Upload new images and get URLs
      let uploadedUrls = [];
      for (const file of newImages) {
        const formDataImg = new FormData();
        formDataImg.append('image', file);
        const res = await fetch(`${API_URL}/api/books/upload-image`, {
          method: 'POST',
          body: formDataImg
        });
        if (!res.ok) throw new Error('Error al subir la imagen');
        const imgData = await res.json();
        uploadedUrls.push(imgData.imageUrl);
      }
      // Prepare all image URLs to keep
      const existingUrls = bookImages.filter(img => !deletedImageIds.includes(img.image_id)).map(img => img.image_url);
      const allImages = [...existingUrls, ...uploadedUrls];
      // Determinar la portada por índice
      let coverUrl = allImages[coverIndex] || null;
      const payload = {
        ...form,
        authors: autoresArray,
        images: allImages,
        deletedImageIds,
        coverImageUrl: coverUrl,
        category_id: form.category_id
      };
      console.log('Payload a enviar:', payload);
      const response = await fetch(`${API_URL}/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el libro');
      }
      setSuccess('¡Libro actualizado exitosamente!');
      // Limpiar estados relacionados
      setNewImages([]);
      setDeletedImageIds([]);
      // Redirigir a /comprar tras breve delay
      setTimeout(() => {
        navigate('/comprar');
      }, 800);
    } catch (err) {
      setError('Error al actualizar el libro: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  return (
    <>
      <Header />
      <main className="edit-book-container">
        <div className="edit-book-card">
          <h2>Editar Libro</h2>
          <div style={{textAlign:'center',marginBottom:16}}>
            <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center'}}>
              {[...bookImages.filter(img => !deletedImageIds.includes(img.image_id)).map(img => ({
                type: 'existing',
                ...img,
                image_url: img.image_url && !img.image_url.startsWith('http') ? `${API_URL}${img.image_url}` : img.image_url
              })),
              ...newImages.map(file => ({ type: 'new', image_url: URL.createObjectURL(file), file }))
              ].map((img, idx) => (
                <div key={img.image_id || img.image_url || img.file?.name} style={{position:'relative',display:'inline-block'}}>
                  <img src={img.image_url} alt={`Imagen ${idx+1}`} style={{width:80,height:110,objectFit:'cover',border:coverIndex===idx?'2px solid #007bff':'1px solid #ccc',borderRadius:6,cursor:'pointer'}} onClick={() => {
  handleSetCover(idx, img.image_url);
}} />
                  <button type="button" title="Eliminar" style={{position:'absolute',top:2,right:2,background:'#fff',border:'none',borderRadius:'50%',padding:'2px 6px',cursor:'pointer',fontWeight:'bold',fontSize:16,color:'#c00',lineHeight:1}} onClick={()=> handleDeleteImage(img)}>
                    ✖
                  </button>
                  {coverIndex===idx && <span style={{position:'absolute',bottom:2,left:2,background:'#007bff',color:'#fff',fontSize:10,padding:'2px 5px',borderRadius:3}}>Portada</span>}
                </div>
              ))}
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit} className="edit-book-form" encType="multipart/form-data">
            <div className="form-group">
              <label>
                <i className="fas fa-image"></i> Portada
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleAddImages}
                  className="form-input"
                  style={{marginBottom:8}}
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-book"></i> Título
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Título del libro"
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-user"></i> Autores
                <input
                  type="text"
                  name="authors"
                  value={form.authors}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Autores (separados por comas)"
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-align-left"></i> Descripción
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Descripción del libro"
                  rows="4"
                />
              </label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <i className="fas fa-dollar-sign"></i> Precio
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Precio del libro"
                    min="0"
                    step="0.01"
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  <i className="fas fa-bookmark"></i> Estado
                  <select
                    name="condition"
                    value={form.condition}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">Seleccionar estado</option>
                    <option value="Nuevo">Nuevo</option>
                    <option value="Como nuevo">Como nuevo</option>
                    <option value="Bueno">Bueno</option>
                    <option value="Aceptable">Aceptable</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <i className="fas fa-language"></i> Idioma
                  <input
                    type="text"
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Idioma del libro"
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  <i className="fas fa-file-alt"></i> Número de páginas
                  <input
                    type="number"
                    name="pageCount"
                    value={form.pageCount}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Número de páginas"
                    min="0"
                  />
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <i className="fas fa-calendar"></i> Fecha de publicación
                  <input
                    type="date"
                    name="publication_date"
                    value={form.publication_date}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  <i className="fas fa-building"></i> Editorial
                  <input
                    type="text"
                    name="publisher"
                    value={form.publisher}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Editorial"
                  />
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-layer-group"></i> Categoría
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-button" disabled={loading}>
                <i className="fas fa-save"></i> Guardar cambios
              </button>
              <button type="button" className="cancel-button" onClick={() => navigate('/profile')}>
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