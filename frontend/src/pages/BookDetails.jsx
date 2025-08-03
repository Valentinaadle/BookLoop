import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaHeart, FaEdit, FaTrash } from 'react-icons/fa';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';
import '../Assets/css/BookDetails.css';
import '../Assets/css/breadcrumb.css';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', authors: '', description: '', price: '', stock: '', pagecount: '' });
  const [success, setSuccess] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [isBookFavorite, setIsBookFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

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
      // Prefer backend's images array (lowercase) and coverimageurl
      if (Array.isArray(data.images) && data.images.length > 0) {
        images = data.images.map(img => img.startsWith('http') ? img : `${API_URL}${img}`);
      } else if (Array.isArray(data.Images) && data.Images.length > 0) {
        images = data.Images.map(img => img.image_url.startsWith('http') ? img.image_url : `${API_URL}${img.image_url}`);
      }
      if (data.imageUrl) {
        const imgUrl = data.imageUrl.startsWith('http') ? data.imageUrl : (data.imageUrl.startsWith('/Assets') ? data.imageUrl : `${API_URL}${data.imageUrl}`);
        if (!images.includes(imgUrl)) images.push(imgUrl);
      }
      // 2. If coverimageurl exists, ensure it is first
      let coverUrl = data.coverimageurl || data.coverImageUrl || data.imageUrl || (images.length > 0 ? images[0] : null);
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
        stock: data.stock || '',
        pagecount: data.pagecount || data.pageCount || data.num_pages || data.numpages || '',
        images: Array.isArray(data.images) ? [...data.images] : []
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

  useEffect(() => {
    const checkFavorite = async () => {
      if (user && book && book.book_id) {
        const result = await isFavorite(book.book_id);
        setIsBookFavorite(result);
      }
    };
    checkFavorite();
  }, [user, book, isFavorite]);

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
    setSending(true);
    setEmailStatus(null);
    setContactSuccess(false); // Estado inicial

    try {
      const response = await fetch(`${API_URL}/api/books/notify-seller`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: book.book_id || book.id,
          buyerId: user.id,
          buyerName: `${user.nombre} ${user.apellido}`,
          buyerEmail: user.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Error al enviar el email');
      }

      // Éxito - Actualiza ambos estados
      setEmailStatus('¡Email enviado correctamente!');
      setContactSuccess(true); // <-- Nuevo estado de éxito
      
     

    } catch (error) {
      console.error('Error completo:', error);
      setEmailStatus(`Error: ${error.message}`);
      setContactSuccess(false); // <-- Asegura que no quede en true
      
      // Limpia el error después de 3 segundos
      setTimeout(() => {
        setEmailStatus(null);
      }, 3000);
      
    } finally {
      setSending(false);
    }
};

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    setSending(true);
    setSuccess(null);
    setError(null);
    try {
      const formToSend = {
        ...editForm,
        pagecount: editForm.pagecount ? Number(editForm.pagecount) : null
      };
      const response = await fetch(`${API_URL}/api/books/${book.book_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formToSend)
      });
      if (!response.ok) throw new Error('Error al actualizar el libro');
      
      const updatedBook = await response.json();
      if (!response.ok) throw new Error('Error al actualizar libro: ' + response.statusText);
      setSuccess('Libro actualizado correctamente');
      setShowEditModal(false);
      // Refresca los datos del libro en la UI para mostrar el nuevo estado
      await fetchBookDetails();
    } catch (err) {
      setError('Error al actualizar el libro');
    } finally {
      setSending(false);
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
      setTimeout(() => navigate('/comprar'), 1500);
    } catch (err) {
      setError('Error al eliminar el libro: ' + err.message);
      console.error('Error al eliminar el libro:', err);
    }
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!book || !book.book_id) return;
    setFavLoading(true);
    if (isBookFavorite) {
      console.log('Intentando eliminar de favoritos:', book.book_id);
      await removeFavorite(book.book_id);
      setIsBookFavorite(false);
      console.log('Eliminado de favoritos:', book.book_id);
    } else {
      const favObj = {
        book_id: book.book_id,
        title: book.title,
        authors: book.authors,
        price: book.price,
        imageUrl: book.imageUrl || book.coverimageurl || book.coverImageUrl || book.imageurl || book.imageUrl
      };
      console.log('Intentando agregar a favoritos:', favObj);
      const resp = await addFavorite(favObj);
      setIsBookFavorite(true);
      console.log('Respuesta de addFavorite:', resp);
    }
    setFavLoading(false);
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
        <nav aria-label="Breadcrumb" className="breadcrumb-nav mb-4 text-sm">
          <ol className="list-none p-0 inline-flex items-center space-x-2">
            <li className="flex items-center">
              <Link to="/" className="breadcrumb-link">Inicio</Link>
            </li>
            <li className="flex items-center">
              <span className="material-icons text-slate-400 text-xs">chevron_right</span>
              <Link to="/comprar" className="breadcrumb-link">Libros</Link>
            </li>
            <li className="flex items-center">
              <span className="material-icons text-slate-400 text-xs">chevron_right</span>
              <span className="breadcrumb-current">{book.Category?.category_name || 'Categoría'}</span>
            </li>
          </ol>
        </nav>

        <header className="mb-6 book-details-header-row">
          <div className="book-details-title-row" style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12}}>
            <h1 className="text-4xl book-details-title">{book.title}</h1>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              {!isOwner && !isAdmin && (
                <button
                  className={`favorite-btn${isBookFavorite ? ' filled' : ''}`}
                  aria-label={isBookFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  onClick={handleFavoriteClick}
                  disabled={favLoading}
                >
                  <FaHeart className={`heart-icon${isBookFavorite ? ' filled' : ''}`} />
                </button>
              )}
              {(isOwner || isAdmin) && (
                <>
                  <button
                    onClick={() => navigate(`/edit-book/${book.book_id || book.id}`)}
                    className="text-white font-semibold py-2 px-4 rounded-md shadow text-sm"
                    style={{background:'#2c3e50', border:'none', height: '36.5px', boxSizing: 'border-box'}}
                    onMouseOver={e => e.currentTarget.style.background='#1a232b'}
                    onMouseOut={e => e.currentTarget.style.background='#2c3e50'}
                  >
                    <span style={{display:'flex', alignItems:'center', gap:6}}><FaEdit /> Editar</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-white font-semibold py-2 px-4 rounded-md shadow text-sm"
                    style={{background:'#2c3e50', border:'none', height: '36.5px', boxSizing: 'border-box'}}
                    onMouseOver={e => e.currentTarget.style.background='#1a232b'}
                    onMouseOut={e => e.currentTarget.style.background='#2c3e50'}
                  >
                    <span style={{display:'flex', alignItems:'center', gap:6}}><FaTrash /> Borrar</span>
                  </button>
                </>
              )}
              {isOwner && (
                  <div className="status-dropdown-container" style={{ position: 'relative', marginLeft: '8px' }}>
                    <button
                      onClick={() => setShowStatusDropdown(v => !v)}
                      style={{
                        background: book.status === 'vendido' ? '#e53e3e' : '#38a169',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 18px 8px 12px',
                        borderRadius: '6px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '0.9em',
                        transition: 'background 0.2s',
                        minWidth: 90,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                      title="Cambiar estado"
                      type="button"
                    >
                      {book.status === 'vendido' ? 'Vendido' : 'Activo'}
                      <svg width="18" height="18" style={{marginLeft:4}} viewBox="0 0 20 20"><path fill="#fff" d="M5.25 7.25a.75.75 0 0 1 1.06 0L10 10.94l3.69-3.69a.75.75 0 1 1 1.06 1.06l-4.22 4.22a.75.75 0 0 1-1.06 0L5.25 8.31a.75.75 0 0 1 0-1.06z"></path></svg>
                    </button>
                    {showStatusDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: '110%',
                        right: 0,
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        zIndex: 1000,
                        minWidth: 110
                      }}>
                        {['activo', 'vendido'].map(option => (
                          <button
                            key={option}
                            style={{
                              display: 'block',
                              width: '100%',
                              padding: '8px 12px',
                              background: option === book.status ? (option === 'vendido' ? '#fee2e2' : '#d1fae5') : 'transparent',
                              color: option === 'vendido' ? '#b91c1c' : '#166534',
                              border: 'none',
                              textAlign: 'left',
                              cursor: option === book.status ? 'default' : 'pointer',
                              fontWeight: option === book.status ? 700 : 400
                            }}
                            disabled={option === book.status}
                            onClick={async () => {
                              setShowStatusDropdown(false);
                              if (option === book.status) return;
                              try {
                                const response = await fetch(`${API_URL}/api/books/${book.book_id || book.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ status: option })
                                });
                                if (!response.ok) throw new Error('Error al actualizar el estado');
                                await fetchBookDetails(); // Refresca el estado completo del libro
                              } catch (err) {
                                alert('Error al actualizar el estado del libro.');
                              }
                            }}
                          >
                            {option === 'vendido' ? 'Vendido' : 'Activo'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        </header>

        <div className="book-details-container grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="book-main-info lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <div className="book-cover-detail flex flex-col items-center">
  <div className="relative w-full flex items-center justify-center">
    {bookImages.length > 1 && (
      <button
        onClick={() => setActiveImage((activeImage - 1 + bookImages.length) % bookImages.length)}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full shadow p-2 hover:bg-sky-100 transition z-10"
        aria-label="Anterior"
        style={{ left: -16 }}
      >
        <svg width="24" height="24" fill="none" stroke="#2c3e50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
    )}
    <img
      src={bookImages.length > 0 ? bookImages[activeImage] : '/icono2.png'}
      alt={`Imagen ${activeImage + 1} de ${book.title}`}
      onError={e => { e.target.src = '/icono2.png'; e.target.onerror = null; }}
      className="w-full h-64 object-contain rounded mb-2 select-none"
      style={{ maxWidth: 320 }}
    />
    {bookImages.length > 1 && (
      <button
        onClick={() => setActiveImage((activeImage + 1) % bookImages.length)}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full shadow p-2 hover:bg-sky-100 transition z-10"
        aria-label="Siguiente"
        style={{ right: -16 }}
      >
        <svg width="24" height="24" fill="none" stroke="#2c3e50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    )}
  </div>

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
                  {book.seller && book.seller.id ? (
                    <Link to={`/usuario/${book.seller.id}`} className="seller-link">
                      {`${book.seller.nombre} ${book.seller.apellido || ''}`}
                    </Link>
                  ) : (
                    book.seller ? `${book.seller.nombre} ${book.seller.apellido || ''}` : 'No especificado'
                  )}
                </p>
                <p className="text-slate-700 font-inter text-sm">
                  <span className="font-semibold text-slate-800">Estado:</span>{' '}
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    (book.estado || book.condition) === 'Nuevo' 
                      ? 'bg-blue-100 text-blue-800' 
                      : (book.estado || book.condition) === 'Usado' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {book.estado || book.condition || 'No especificado'}
                  </span>
                </p>
                <p className="text-2xl font-bold text-slate-800">
  {book.price && !isNaN(parseFloat(book.price))
    ? `$${Number(book.price).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    : 'No especificado'}
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

          <div className="book-secondary-info lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6" style={{position: 'relative'}}>
              <div className="details-header">
                <h2 className="text-2xl font-semibold text-slate-800 font-playfair">Detalles del libro:</h2>
              </div>
              <div className="details-grid grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-xs text-slate-500">Editorial</p>
                  <p className="text-sm text-slate-800">{book.publisher || 'No especificado'}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p className="text-xs text-slate-500">Categoría</p>
                    <p className="text-sm text-slate-800">{book.Category?.category_name || book.category?.category_name || book.categoria || book.category || 'No especificado'}</p>
                  </div>

                </div>
                <div>
                  <p className="text-xs text-slate-500">Número de páginas</p>
                  <p className="text-sm text-slate-800">{(book.pagecount && book.pagecount > 0) ? book.pagecount : 'No especificado'}</p>
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
      <div className="modal-overlay">
        <div className="modal-content">
          {!contactSuccess ? (
            <>
              <h3>Contactar al vendedor</h3>
              <p>¿Estás seguro de que deseas contactar al vendedor?</p>
              <div className="modal-buttons">
                <button 
                  onClick={handleConfirmContact}
                  disabled={sending}
                >
                  {sending ? 'Enviando...' : 'Sí, contactar'}
                </button>
                <button onClick={() => setShowConfirmModal(false)}>Cancelar</button>
              </div>
            </>
          ) : (
            <>
              <h3>¡Solicitud enviada!</h3>
              <p>Se ha enviado la solicitud correctamente. Pronto el vendedor se comunicará contigo.</p>
              <button onClick={() => {
                setShowConfirmModal(false);
                setContactSuccess(false);
              }}>
                Cerrar
              </button>
            </>
          )}
        </div>
      </div>
    )}

      {/* Delete Warning Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6" style={{ border: '1px solid rgb(19, 20, 22)', color: 'rgb(19, 20, 22)' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(19, 20, 22)', textAlign: 'center' }}>Confirmar eliminación</h3>
            <p className="mb-5" style={{ color: 'rgb(19, 20, 22)', textAlign: 'center' }}>¿Estás seguro que deseas eliminar este libro? Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                className="flex-1"
                style={{ color: '#fff', background: 'rgb(19, 20, 22)', border: '1px solid rgb(19, 20, 22)', padding: '8px 20px', borderRadius: '6px', fontWeight: 600, transition: 'background 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.background = '#23262a')}
                onMouseOut={e => (e.currentTarget.style.background = 'rgb(19, 20, 22)')}
                onClick={() => { setShowDeleteModal(false); handleDeleteBook(); }}
              >
                Sí, eliminar
              </button>
              <button
                className="flex-1"
                style={{ color: 'rgb(19, 20, 22)', border: '1px solid rgb(19, 20, 22)', background: 'transparent', padding: '8px 20px', borderRadius: '6px', fontWeight: 500, transition: 'background 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.background = '#f2f2f2')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BookDetails;
