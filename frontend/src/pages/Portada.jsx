import React, { useState, useEffect } from 'react';
import '../Assets/css/portada.css';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loader from '../components/Loader.jsx';
import '../Assets/css/loader.css';
import FAQQuestions from '../components/FAQQuestion.jsx';

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
import { getBookImage, getBookAuthor } from '../utils/bookUtils';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CarruselLibros = ({ libros, titulo, extraClass = "" }) => {
  const [startIdx, setStartIdx] = useState(0);
  const visibleCount = 4;
  const total = libros.length;
  const navigate = useNavigate();
  const handlePrev = () => setStartIdx((prev) => (prev - 1 + total) % total);
  const handleNext = () => setStartIdx((prev) => (prev + 1) % total);
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

export default function Portada() {
  const [loading, setLoading] = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [booksDB, setBooksDB] = useState([]);
  const [destacados, setDestacados] = useState([]);
  const [masVendidos, setMasVendidos] = useState([]);

  useEffect(() => {
    // Tiempo mínimo para el loader (3 segundos)
    const timer = setTimeout(() => setMinTimePassed(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/books`)
      .then(res => res.json())
      .then(data => {
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
              <CarruselLibros libros={destacados} titulo="Nuevos ingresos" />
            </motion.section>
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="categorias-destacadas"
            >
              <h2>Categorías destacadas</h2>
              <div className="categorias-grid">
                {[
                  { nombre: 'Novela', icon: '📖' },
                  { nombre: 'Ciencia Ficción', icon: '🚀' },
                  { nombre: 'Misterio', icon: '🕵️‍♂️' },
                  { nombre: 'Fantasía', icon: '🐉' },
                  { nombre: 'Poesía', icon: '📝' },
                  { nombre: 'Terror', icon: '👻' },
                ].map((cat) => (
                  <div className="categoria-card" key={cat.nombre}>
                    <span className="categoria-icon">{cat.icon}</span>
                    <span className="categoria-nombre">{cat.nombre}</span>
                  </div>
                ))}
              </div>
            </motion.section>


            <FAQQuestions />
          </div>
          <Footer />
        </>
      )}
    </>
  );
}