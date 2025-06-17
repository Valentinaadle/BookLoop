import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';
import '../Assets/css/BookDetails.css';

function BookDetails() {
  // Detecta admin robustamente
  const { id } = useParams();
  const { user } = useAuth();
  const isAdmin = user && (user.isAdmin || user.admin === true || user.role === 'admin' || user.rol === 'admin');
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const [bookImages, setBookImages] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', authors: '', description: '', price: '', stock: '' });
  const [success, setSuccess] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchBookDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/books/${id}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setBook(data);
      // Procesar las imágenes del libro
      // --- COVER LOGIC FIX: Ensure cover is always first and no duplicates ---
      let images = [];
      // 1. Get all image URLs (imageUrl, Images[])
      if (Array.isArray(data.Images) && data.Images.length > 0) {
        images = data.Images.map(img => img.image_url.startsWith('http') ? img.image_url : `${API_URL}${img.image_url}`);
      }
      if (data.imageUrl) {
        const imgUrl = data.imageUrl.startsWith('http') ? data.imageUrl : (data.imageUrl.startsWith('/Assets') ? data.imageUrl : `${API_URL}${data.imageUrl}`);
        if (!images.includes(imgUrl)) images.push(imgUrl);
      }
      // 2. If coverImageUrl exists, ensure it is first
      let coverUrl = data.coverImageUrl || data.imageUrl || (images.length > 0 ? images[0] : null);
      if (coverUrl) {
        coverUrl = coverUrl.startsWith('http') ? coverUrl : (coverUrl.startsWith('/Assets') ? coverUrl : `${API_URL}${coverUrl}`);
        images = [coverUrl, ...images.filter(url => url !== coverUrl)];
      }
      setBookImages(images);
      setActiveImage(0); // Always show the cover first
      setEditForm({
        title: data.title || '',
        authors: Array.isArray(data.authors) ? data.authors.join(', ') : data.authors || '',
        description: data.description || '',
        price: data.price || '',
        stock: data.stock || ''
      });
      // --- END COVER LOGIC FIX ---
    } catch (err) {
      setError('No se pudo cargar el libro. ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [id, API_URL]);

  useEffect(() => {
    if (id) {
      fetchBookDetails();
    }
  }, [id, fetchBookDetails]);

  const handleContactSeller = async () => {
    if (!user) {
      setEmailStatus('Error: Debes iniciar sesión para contactar al vendedor');
      return;
    }

    const email = book.seller?.email;
    if (!email) {
      setEmailStatus('Error: El email del vendedor no está disponible');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmContact = async () => {
    setShowConfirmModal(false);
    setSending(true);
    setEmailStatus(null);

    try {
      const response = await fetch(`${API_URL}/api/books/notify-seller`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: book.book_id || book.id,
          buyerName: `${user.nombre} ${user.apellido}`,
          buyerEmail: user.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Error al enviar el email');
      }

      setEmailStatus('¡Email enviado correctamente!');
      setTimeout(() => {
        setEmailStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Error completo:', error);
      setEmailStatus(`Error: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/books/${book.book_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (!response.ok) throw new Error('Error al actualizar el libro');
      
      const updatedBook = await response.json();
      setBook(updatedBook); // Actualizar el estado del libro directamente
      setSuccess('Libro actualizado correctamente');
      setShowEditModal(false);
    } catch (err) {
      setError('Error al actualizar el libro');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isOwner = user && book && book.seller_id === user.id;
  

  const handleDeleteBook = async () => {
    const bookId = book && book.book_id ? book.book_id : id;
    if (!bookId) {
      setError('No se encontró el ID del libro.');
      console.error('ID de libro no encontrado', { book, id });
      return;
    }
    if (window.confirm('¿Estás seguro que deseas eliminar este libro?')) {
      try {
        console.log('Intentando borrar libro con ID:', bookId);
        const response = await fetch(`${API_URL}/api/books/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          let backendError = '';
          try {
            const data = await response.json();
            backendError = data.message || data.error || JSON.stringify(data);
          } catch (e) {
            backendError = response.statusText;
          }
          console.error('Error backend al borrar:', backendError);
          throw new Error(backendError || 'Error al eliminar el libro');
        }
        setSuccess('Libro eliminado correctamente');
        setTimeout(() => navigate('/profile'), 1500);
      } catch (err) {
        setError('Error al eliminar el libro: ' + err.message);
        console.error('Error al eliminar el libro:', err);
      }
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading">Cargando detalles del libro...</div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="error">{error}</div>
        <Footer />
      </>
    );
  }

  if (!book) {
    return (
      <>
        <Header />
        <div className="error">No se encontró el libro</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-slate-500">
          <ol className="list-none p-0 inline-flex space-x-2">
            <li className="flex items-center">
              <a href="/" className="hover:text-slate-700">Inicio</a>
            </li>
            <li className="flex items-center">
              <span className="material-icons text-xs">chevron_right</span>
              <a href="/books" className="hover:text-slate-700">Libros</a>
            </li>
            <li className="flex items-center">
              <span className="material-icons text-xs">chevron_right</span>
              <span className="text-slate-700">{book.Category?.category_name || 'Categoría'}</span>
            </li>
          </ol>
        </nav>

        <header className="mb-6">
          <h1 className="text-4xl">{book.title}</h1>
          {(isAdmin || isOwner) && book && (
            <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: '8px', zIndex: 10 }}>
              <button
                title="Editar libro"
                onClick={() => navigate(`/edit-book/${book.book_id || book.id}`)}
                aria-label="Editar libro"
                style={{
                  background: 'none',
                  color: '#2c3e50',
                  border: 'none',
                  padding: 0,
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2c3e50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"></path></svg>
              </button>
              <button
                title="Borrar libro"
                onClick={() => setShowEditModal(true)}
                aria-label="Borrar libro"
                style={{
                  background: 'none',
                  color: '#2c3e50',
                  border: 'none',
                  padding: 0,
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2c3e50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <div className="book-cover-detail">
                <img
                  src={bookImages.length > 0 ? bookImages[activeImage] : '/icono2.png'}
                  alt={`Portada ${book.title}`}
                  onError={(e) => {
                    e.target.src = '/icono2.png';
                    e.target.onerror = null;
                  }}
                />
              </div>
              <div className="space-y-2">
                <p className="text-slate-700 font-inter text-sm">
                  <span className="font-semibold text-slate-800">Autor:</span> {
  Array.isArray(book.authors)
    ? book.authors.join(', ')
    : (typeof book.authors === 'string' && book.authors.trim().startsWith('['))
      ? JSON.parse(book.authors).join(', ')
      : (book.authors ? book.authors : (book.author || 'No especificado'))
}
                </p>
                <p className="text-slate-700 font-inter text-sm">
                  <span className="font-semibold text-slate-800">Vendido por:</span>{' '}
                  {book.seller ? `${book.seller.nombre} ${book.seller.apellido || ''}` : 'No especificado'}
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  {book.price ? `$${parseFloat(book.price).toFixed(2)}` : 'No especificado'}
                </p>
              </div>
              {!isOwner && !isAdmin && (
                <button
                  onClick={handleContactSeller}
                  className="mt-4 w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-md shadow-sm hover:shadow transition-all duration-300 ease-in-out flex items-center justify-center text-sm"
                >
                  <i className="fas fa-envelope mr-2"></i>
                  Contactar Vendedor
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4 font-playfair">Detalles del libro:</h2>
              <div className="details-grid grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-xs text-slate-500">Editorial</p>
                  <p className="text-sm text-slate-800">{book.publisher || 'No especificado'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Categoría</p>
                  <p className="text-sm text-slate-800">{book.Category?.category_name || 'No especificado'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Número de páginas</p>
                  <p className="text-sm text-slate-800">{book.pageCount || 'No especificado'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Año de publicación</p>
                  <p className="text-sm text-slate-800">{book.publication_date || 'No especificado'}</p>
                </div>
                <div>
                   <p className="text-xs text-slate-500">ISBN</p>
                   <p className="text-sm text-slate-800">{book.isbn || book.isbn_code || 'No especificado'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Idioma</p>
                  <p className="text-sm text-slate-800">{book.language || book.idioma || 'No especificado'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Estado</p>
                  <p className="text-sm text-slate-800">{book.estado || book.condition || 'No especificado'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4 font-playfair">Sinopsis:</h2>
               <div className="prose prose-sm prose-slate max-w-none" style={{color: '#111'}}>
                 <p className="text-sm" style={{color: '#111'}}>{book.description || 'Sin descripción disponible'}</p>
                </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {showConfirmModal && !isOwner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full">
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Contactar al vendedor</h3>
            <p className="text-slate-600 text-sm mb-4">¿Estás seguro de que deseas contactar al vendedor?</p>
            <div className="flex gap-3">
              <button
                className="flex-1 bg-sky-600 text-white py-2 px-3 rounded-md hover:bg-sky-700 transition-colors text-sm"
                onClick={handleConfirmContact}
                disabled={sending}
              >
                {sending ? 'Enviando...' : 'Sí, contactar'}
              </button>
              <button
                className="flex-1 bg-slate-100 text-slate-800 py-2 px-3 rounded-md hover:bg-slate-200 transition-colors text-sm"
                onClick={() => setShowConfirmModal(false)}
                disabled={sending}
              >
                Cancelar
              </button>
            </div>
            {emailStatus && (
              <p className={`mt-3 p-2 rounded-md text-center text-sm ${
                emailStatus.includes('Error') 
                  ? 'bg-red-50 text-red-700' 
                  : 'bg-green-50 text-green-700'
              }`}>
                {emailStatus}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default BookDetails;
