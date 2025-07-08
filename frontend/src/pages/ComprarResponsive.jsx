import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ResponsiveFilters from '../components/ResponsiveFilters';
import BookCard from '../components/BookCard';
import { getBookImage, getBookAuthor } from '../utils/bookUtils';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ComprarResponsive = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('default');

  // Mapeo de códigos de idioma a nombres completos
  const languageMap = {
    'en': 'Inglés',
    'es': 'Español',
    'fr': 'Francés',
  };

  const conditions = ["Nuevo", "Como Nuevo", "Buen Estado", "Usado", "Aceptable", "Muy bueno"];

  // Leer el query param 'genero' al cargar la página
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genero = params.get('genero');
    if (genero) {
      setSelectedGenres([genero]);
    }
  }, [location.search]);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/books`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      const filtered = Array.isArray(data) ? data.filter(book => book.status !== 'vendido') : [];
      setBooks(filtered);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Error al cargar los libros. Por favor, intenta de nuevo más tarde.');
      setBooks([]);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  // Handlers para los filtros
  const handleGenreChange = (genre) => {
    setSelectedGenres((prevSelectedGenres) => {
      if (prevSelectedGenres.includes(genre)) {
        return prevSelectedGenres.filter((g) => g !== genre);
      } else {
        return [...prevSelectedGenres, genre];
      }
    });
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguages((prevSelectedLanguages) => {
      if (prevSelectedLanguages.includes(language)) {
        return prevSelectedLanguages.filter((l) => l !== language);
      } else {
        return [...prevSelectedLanguages, language];
      }
    });
  };

  const handleConditionChange = (condition) => {
    setSelectedConditions((prevSelectedConditions) => {
      if (prevSelectedConditions.includes(condition)) {
        return prevSelectedConditions.filter((c) => c !== condition);
      } else {
        return [...prevSelectedConditions, condition];
      }
    });
  };

  const handlePriceChange = (newPriceRange) => {
    setPriceRange(newPriceRange);
  };

  const handleSort = (books) => {
    switch (sortBy) {
      case 'price-asc':
        return [...books].sort((a, b) => (a.precio || a.price) - (b.precio || b.price));
      case 'price-desc':
        return [...books].sort((a, b) => (b.precio || b.price) - (a.precio || a.price));
      case 'most-sold':
        return [...books].sort((a, b) => (b.id || b.book_id) - (a.id || a.book_id));
      default:
        return books;
    }
  };

  // Admin handlers
  const [deleting, setDeleting] = useState(false);
  const [adminError, setAdminError] = useState(null);

  const handleEditBook = (id) => {
    navigate(`/edit-book/${id}`);
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('¿Seguro que quieres borrar este libro?')) return;
    setDeleting(true);
    setAdminError(null);
    try {
      const res = await fetch(`${API_URL}/api/books/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al borrar libro');
      fetchBooks();
    } catch (err) {
      setAdminError('Error al borrar libro');
    }
    setDeleting(false);
  };

  // Lógica de filtrado
  const filteredBooks = books.filter(book => {
    const price = book.precio || book.price;
    if (priceRange.min && price < parseFloat(priceRange.min)) return false;
    if (priceRange.max && price > parseFloat(priceRange.max)) return false;

    if (selectedGenres.length > 0) {
      let bookCategory = '';
      if (book.categoria) {
        bookCategory = book.categoria;
      } else if (book.category && typeof book.category === 'object' && book.category.category_name) {
        bookCategory = book.category.category_name;
      } else if (book.category && typeof book.category === 'string') {
        bookCategory = book.category;
      } else if (book.genero) {
        bookCategory = book.genero;
      }
      const normalizedBookCategory = (bookCategory || '').toLowerCase().trim();
      const matchesGenre = selectedGenres.some(selectedGenre =>
        normalizedBookCategory === selectedGenre.toLowerCase().trim()
      );
      if (!matchesGenre) return false;
    }

    if (selectedLanguages.length > 0) {
      const bookLanguage = book.language || '';
      const fullLanguageName = languageMap[bookLanguage] || '';
      if (!selectedLanguages.includes(fullLanguageName)) return false;
    }

    if (selectedConditions.length > 0) {
      let bookCondition = book.estado || book.condition || book.state || '';
      bookCondition = bookCondition.trim().toLowerCase();
      const matchesCondition = selectedConditions.some(selectedCond =>
        bookCondition === selectedCond.trim().toLowerCase()
      );
      if (!matchesCondition) return false;
    }

    return true;
  });

  const sortedBooks = handleSort(filteredBooks);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando libros...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      {/* Container principal */}
      <div className="min-h-screen bg-gray-50">
        {/* Componente de filtros responsive */}
        <ResponsiveFilters
          categories={categories}
          selectedGenres={selectedGenres}
          selectedLanguages={selectedLanguages}
          selectedConditions={selectedConditions}
          priceRange={priceRange}
          onGenreChange={handleGenreChange}
          onLanguageChange={handleLanguageChange}
          onConditionChange={handleConditionChange}
          onPriceChange={handlePriceChange}
          languageMap={languageMap}
          conditions={conditions}
        />

        {/* Contenido principal */}
        <div className="flex">
          {/* Spacer para desktop - mantiene espacio para el panel de filtros */}
          <div className="hidden lg:block w-64 flex-shrink-0"></div>
          
          {/* Área de contenido */}
          <div className="flex-1 p-4 lg:p-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Libros Disponibles</h1>
                  <p className="text-gray-600 text-sm">
                    {sortedBooks.length} {sortedBooks.length === 1 ? 'libro encontrado' : 'libros encontrados'}
                  </p>
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="default">Ordenar por</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="most-sold">Más populares</option>
                </select>
              </div>
            </div>

            {/* Error messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {adminError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-700">{adminError}</p>
              </div>
            )}

            {/* Grid de libros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {sortedBooks.length > 0 ? (
                sortedBooks.map((book) => (
                  <BookCard
                    key={book.book_id || book.id}
                    img={getBookImage(book, API_URL)}
                    titulo={book.title || book.titulo || 'Sin título'}
                    autor={getBookAuthor(book)}
                    precio={book.price || book.precio}
                    book_id={book.book_id || book.id}
                    onBuy={() => navigate(`/book/${book.book_id || book.id}`)}
                    showFavorito={true}
                    showComprar={true}
                    isAdmin={user?.role === 'admin'}
                    onEdit={() => handleEditBook(book.book_id || book.id)}
                    onDelete={() => handleDeleteBook(book.book_id || book.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay libros disponibles</h3>
                  <p className="text-gray-500 mb-4">
                    No se encontraron libros que coincidan con los filtros seleccionados.
                  </p>
                  <Link
                    to="/search"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Explorar más libros
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default ComprarResponsive; 