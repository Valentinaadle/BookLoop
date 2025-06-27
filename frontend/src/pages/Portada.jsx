import React, { useState, useEffect } from 'react';
import '../Assets/css/portada.css';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loader from '../components/Loader.jsx';
import '../Assets/css/loader.css';
import FAQQuestions from '../components/FAQQuestion.jsx';
import Newsletter from '../components/Newsletter.jsx';
import Recomendados from '../components/Recomendados';
import Cuestionario from '../components/Cuestionario';

import { FaShoppingCart, FaBookOpen, FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import book12 from '../Assets/book12.webp';
import book5 from "../Assets/book11.webp";
import book6 from "../Assets/book6.webp";
import book9 from "../Assets/book9.webp";
import book3 from "../Assets/book3.webp";
import book13 from "../Assets/book13.webp";
import book14 from "../Assets/book14.webp";
import BookCard from '../components/BookCard';
import { useAuth } from '../context/AuthContext';
import { getBookImage, getBookAuthor } from '../utils/bookUtils';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CarruselLibros = ({ libros, titulo, extraClass = "", isAdmin, onDelete }) => {
  const [startIdx, setStartIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4); // cambia dinámicamente
  const total = libros.length;
  const navigate = useNavigate();

  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setVisibleCount(2); // mostrar 2 en móviles
      } else {
        setVisibleCount(4); // mostrar 4 en pantallas grandes
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const handlePrev = () => setStartIdx((prev) => (prev - visibleCount + total) % total);
  const handleNext = () => setStartIdx((prev) => (prev + visibleCount) % total);

  const visibleBooks = Array.from({ length: visibleCount }, (_, i) => libros[(startIdx + i) % total])
    .filter(b => b && b.book_id);

  return (
    <section className={`ofertas ${extraClass}`}>
      <h2>{titulo}</h2>
      <div className="carousel-container">
        {total > visibleCount && (
          <button className="carousel-arrow left" onClick={handlePrev} aria-label="Anterior"><FaChevronLeft /></button>
        )}
        <div className="carousel-books">
          {visibleBooks.map((book, idx) => (
            <BookCard
              key={book.book_id || book.titulo + idx}
              descuento={book.descuento}
              img={getBookImage(book, API_URL)}
              titulo={book.title || book.titulo}
              autor={getBookAuthor(book)}
              precio={book.price || book.precio}
              book_id={book.book_id}
              onBuy={e => { e.stopPropagation(); navigate(`/book/${book.book_id}`); }}
              showFavorito={true}
              showComprar={true}
              isAdmin={isAdmin}
              onDelete={onDelete}
            />
          ))}
        </div>
        {total > visibleCount && (
          <button className="carousel-arrow right" onClick={handleNext} aria-label="Siguiente"><FaChevronRight /></button>
        )}
      </div>
    </section>
  );
};


const opciones = ['Realistas', 'Ciencia Ficción', 'Misterio', 'Drama', 'Romance', 'Terror'];

function PreferenciasUsuario({ generoSeleccionado, onSeleccionar, onVerRecomendaciones }) {
  return (
    <div className="preferencias-usuario">
      <h3>Selecciona tu género favorito:</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
        {opciones.map(opcion => (
          <button
            key={opcion}
            onClick={() => onSeleccionar(opcion)}
            style={{
              background: generoSeleccionado === opcion ? '#394B60' : '#CBd9E6',
              color: generoSeleccionado === opcion ? '#fff' : '#394B60',
              border: 'none',
              borderRadius: '8px',
              padding: '0.7rem 1.5rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {opcion}
          </button>
        ))}
      </div>
      <button
        onClick={onVerRecomendaciones}
        disabled={!generoSeleccionado}
        style={{
          marginTop: '1.2rem',
          background: '#394B60',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '0.9rem 2.2rem',
          fontWeight: 700,
          fontSize: '1.1rem',
          cursor: generoSeleccionado ? 'pointer' : 'not-allowed',
          opacity: generoSeleccionado ? 1 : 0.6,
          transition: 'all 0.2s',
        }}
      >
        Ver recomendaciones
      </button>
    </div>
  );
}

function Recomendaciones({ libros, preferencias }) {
  const librosRecomendados = libros.filter(libro => preferencias.includes(libro.genero));

  return (
    <div>
      <h3>Recomendaciones para ti:</h3>
      {librosRecomendados.map(libro => (
        <BookCard key={libro.book_id} {...libro} />
      ))}
    </div>
  );
}

export default function Portada() {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';
  const navigate = useNavigate();
  const [generoSeleccionado, setGeneroSeleccionado] = useState("");

  // Handler para eliminar libro (solo admin)
  const handleDeleteBook = async (bookId) => {
    try {
      const res = await fetch(`${API_URL}/api/books/${bookId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al borrar libro');
      setDestacados(prev => prev.filter(b => b.book_id !== bookId));
      setBooksDB(prev => prev.filter(b => b.book_id !== bookId));
    } catch (err) {
      alert('Error al borrar libro');
    }
  }
  const [loading, setLoading] = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [booksDB, setBooksDB] = useState([]);
  const [destacados, setDestacados] = useState([]);
  const [masVendidos, setMasVendidos] = useState([]);
  const [preferencias, setPreferencias] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);

  useEffect(() => {
    // Tiempo mínimo para el loader (3 segundos)
    const timer = setTimeout(() => setMinTimePassed(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/books`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched Books:', data); // Debugging
        const books = Array.isArray(data) ? data : [];
        setBooksDB(books);
        // Nuevos ingresos: últimos 5 libros
        const nuevos = [...books]
          .sort((a, b) => (b.book_id || b.id || 0) - (a.book_id || a.id || 0))
          .slice(0, 5)
          .map(book => ({ ...book, descuento: null }));
        setDestacados(nuevos);
        // Más vendidos: primeros 5 libros (puedes cambiar por aleatorio si prefieres)
        const masVend = [...books]
          .slice(0, 5)
          .map(book => ({ ...book, descuento: null }));
        setMasVendidos(masVend);
      })
      .finally(() => setLoading(false));
  }, []);

  // El loader solo desaparece cuando ambos son false
  const showLoader = loading || !minTimePassed;

  const manejarSeleccion = (opcion) => {
    setPreferencias(prev => {
      if (prev.includes(opcion)) {
        return prev.filter(pref => pref !== opcion);
      } else {
        return [...prev, opcion];
      }
    });
  };

  const manejarFinalizacionCuestionario = (respuestas) => {
    console.log('Selected Genre:', respuestas.genero); // Debugging
    if (respuestas.genero) {
      const librosRecomendados = booksDB.filter(libro => libro.genero === respuestas.genero);
      console.log('Filtered Books:', librosRecomendados); // Debugging
      setRecomendaciones(librosRecomendados);
    } else {
      setRecomendaciones([]); // Clear recommendations if no genre is selected
    }
  };

  const aplicarFiltros = (filtros) => {
    const librosFiltrados = booksDB.filter(libro => {
      const cumpleAutor = filtros.autor ? libro.autor.includes(filtros.autor) : true;
      const cumplePrecio = libro.precio >= filtros.precio.min && libro.precio <= filtros.precio.max;
      return cumpleAutor && cumplePrecio;
    });
    setRecomendaciones(librosFiltrados);
  };

  return (
    <>
      {showLoader && <Loader />}
      {!showLoader && (
        <>
          <Header />
          <div className="portada">
            <section className="hero">
              <div className="overlay">
                <div className="hero-content">
                  <motion.h1
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2, ease: [0.6, 0.01, 0.05, 0.95] }}
                  >
                   ¡Dale una segunda vida a tus libros con BookLoop!
                  </motion.h1>
                  <div className="hero-buttons">
                      
                      <Link to="/vender-page" className="btn-white">
                          <FaBookOpen /> Publicar mi libro
                      </Link>
                      <Link to="/comprar" className="btn-orange">
                          <FaShoppingCart /> Explorar descuentos
                      </Link>
                  </div>
                </div>
              </div>
            </section>

            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <CarruselLibros libros={destacados} titulo="Nuevos ingresos" isAdmin={isAdmin} onDelete={handleDeleteBook} />
            </motion.section>

            <PreferenciasUsuario
              generoSeleccionado={generoSeleccionado}
              onSeleccionar={setGeneroSeleccionado}
              onVerRecomendaciones={() => {
                if (generoSeleccionado) {
                  navigate(`/comprar?genero=${encodeURIComponent(generoSeleccionado)}`);
                }
              }}
            />

            <Cuestionario onFinalizar={manejarFinalizacionCuestionario} />
            {recomendaciones.length > 0 && <Recomendados libros={recomendaciones} />}

            


            <FAQQuestions />
            <Newsletter />
            <Footer />
          </div>
        </>
      )}
    </>
  );
}