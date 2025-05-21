import React, { useState, useEffect } from 'react';
import '../Assets/css/portada.css';
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
            <div className="product-card" key={idx}>
              {book.descuento && <span className="discount">{book.descuento}</span>}
              <button 
                className="favorite-btn"
                onClick={() => toggleFavorito(idx)}
                aria-label="Agregar a favoritos"
              >
                {favoritos[idx] ? <FaHeart /> : <FaRegHeart />}
              </button>
              <img src={book.img} alt={book.titulo} />
              <h3>{book.titulo}</h3>
              <p>de {book.autor}</p>
              {book.precio && (
                <div className="book-price">
                  <span className="price">${book.precio}</span>
                  <button className="buy-btn">
                    <FaShoppingCart /> Comprar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button className="carousel-arrow right" onClick={handleNext} aria-label="Siguiente"><FaChevronRight /></button>
      </div>
    </section>
  );
};

export default function Portada() {
  return (
    <>
      <Header />
      <div className="portada">
        <section className="hero">
          <div className="overlay">
            <div className="hero-content">
              <h1>Vende o dona tus libros de forma fácil y segura</h1>
              <div className="hero-buttons">
                <button className="btn-orange"><FaShoppingCart /> Quiero Comprar</button>
                <button className="btn-white"><FaBookOpen /> Quiero Vender</button>
              </div>
            </div>
          </div>
        </section>

        <CarruselLibros libros={nuevosLibros} titulo="Nuevos ingresos" />
        <CarruselLibros libros={masVendidos} titulo="Más vendidos" extraClass="separado" />

        <section className="categorias-destacadas">
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
        </section>
      </div>
      <Footer />
    </>
  );
}
