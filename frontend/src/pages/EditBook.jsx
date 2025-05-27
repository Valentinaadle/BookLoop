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
    publisher: ''
  });

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
          publisher: data.publisher || ''
        });
      } catch (err) {
        setError('Error al cargar el libro: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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

      const response = await fetch(`${API_URL}/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          authors: autoresArray
        })
      });

      if (!response.ok) throw new Error('Error al actualizar el libro');
      
      setSuccess('Libro actualizado correctamente');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
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
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit} className="edit-book-form">
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