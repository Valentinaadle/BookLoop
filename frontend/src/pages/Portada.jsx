import React, { useState, useEffect } from 'react';
import '../Assets/css/portada.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loader from '../components/Loader.jsx';
import '../Assets/css/loader.css';

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

const nuevosLibros = [
  { descuento: '-30%', img: book12, titulo: 'La Fortuna', autor: 'Michael McDowell', precio: 15.99 },
  { descuento: '-50%', img: book9, titulo: 'El Dique', autor: 'Michael McDowell', precio: 12.99 },
  { descuento: '-30%', img: book5, titulo: 'La Casa', autor: 'Michael McDowell', precio: 14.99 },
  { descuento: '-10%', img: book6, titulo: 'La riada', autor: 'Michael McDowell', precio: 16.99 },
  { descuento: '-40%', img: book3, titulo: 'Lluvia', autor: 'Michael McDowell', precio: 13.99 },
];

const masVendidos = [
  { img: book13, titulo: 'Orgullo y Prejuicio', autor: 'Jane Austen' },
  { img: book14, titulo: 'Cumbres Borrascosas', autor: 'Emily Bronte' },
  { img: book12, titulo: 'La Fortuna', autor: 'Michael McDowell' },
  { img: book9, titulo: 'El Dique', autor: 'Michael McDowell' },
  { img: book5, titulo: 'La Casa', autor: 'Michael McDowell' },
  { img: book6, titulo: 'La riada', autor: 'Michael McDowell' },
  { img: book3, titulo: 'Lluvia', autor: 'Michael McDowell' },
];

const CarruselLibros = ({ libros, titulo, extraClass = "" }) => {
  const [startIdx, setStartIdx] = useState(0);
  const [favoritos, setFavoritos] = useState({});
  const visibleCount = 4;
  const total = libros.length;
  const handlePrev = () => setStartIdx((prev) => (prev - 1 + total) % total);
  const handleNext = () => setStartIdx((prev) => (prev + 1) % total);
  const visibleBooks = Array.from({ length: visibleCount }, (_, i) => libros[(startIdx + i) % total]);

  const toggleFavorito = (idx) => {
    setFavoritos(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  useEffect(() => {
    const interval = setInterval(() => setStartIdx((prev) => (prev + 1) % total), 4000);
    return () => clearInterval(interval);
  }, [total]);

  return (
    <section className={`ofertas ${extraClass}`}>
      <h2>{titulo}</h2>
      <div className="carousel-container">
        <button className="carousel-arrow left" onClick={handlePrev} aria-label="Anterior"><FaChevronLeft /></button>
        <div className="carousel-books">
          {visibleBooks.map((book, idx) => (
            <BookCard
              key={idx}
              descuento={book.descuento}
              img={book.img}
              titulo={book.titulo}
              autor={book.autor}
              precio={book.precio}
              favorito={favoritos[(startIdx + idx) % total]}
              onToggleFavorito={() => toggleFavorito((startIdx + idx) % total)}
              onBuy={() => alert(`Comprar: ${book.titulo}`)}
            />
          ))}
        </div>
        <button className="carousel-arrow right" onClick={handleNext} aria-label="Siguiente"><FaChevronRight /></button>
      </div>
    </section>
  );
};

export default function Portada() {
  const [loading, setLoading] = useState(true);

  // Cuando el loader termine, ocultarlo
  const handleLoaderFinish = () => setLoading(false);

  return (
    <>
      {loading && <Loader onFinish={handleLoaderFinish} />}
      {!loading && (
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
                      <Link to="/" className="btn-orange">
                          <FaShoppingCart /> Quiero Comprar
                      </Link>
                      <Link to="/vender-page" className="btn-white">
                          <FaBookOpen /> Quiero Vender
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
              <CarruselLibros libros={nuevosLibros} titulo="Nuevos ingresos" />
            </motion.section>
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <CarruselLibros libros={masVendidos} titulo="Más vendidos" extraClass="separado" />
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
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
