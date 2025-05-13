import React from 'react';
import '../Assets/css/portada.css';
import { FaShoppingCart, FaBookOpen } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import book12 from '../Assets/book12.webp';
import book5 from "../Assets/book11.webp";
import book6 from "../Assets/book6.webp";
import book9 from "../Assets/book9.webp";
import book3 from "../Assets/book3.webp";

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
                <button className="btn-orange">
                  <FaShoppingCart /> Quiero Comprar
                </button>
                <button className="btn-white">
                  <FaBookOpen /> Quiero Vender
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="ofertas">
          <h2>Nuevos ingresos</h2>
          <div className="product-grid">
            <div className="product-card">
              <span className="discount">-30%</span>
              <img src={book12} alt="La Fortuna" />
              <h3>La Fortuna</h3>
              <p>de Michael McDowell</p>
            </div>
            <div className="product-card">
              <span className="discount">-50%</span>
              <img src={book9} alt="El Dique" />
              <h3>El Dique</h3>
              <p>de Michael McDowell</p>
            </div>
            <div className="product-card">
              <span className="discount">-30%</span>
              <img src={book5} alt="La Casa" />
              <h3>La Casa</h3>
              <p>de Michael McDowell</p>
            </div>
            <div className="product-card">
              <span className="discount">-10%</span>
              <img src={book6} alt="La riada" />
              <h3>La riada</h3>
              <p>de Michael McDowell</p>
            </div>
    
            <div className="product-card">
              <span className="discount">-40%</span>
              <img src={book3} alt="Lluvia" />
              <h3>Lluvia</h3>
              <p>de Michael McDowell</p>
            </div>
          
          </div>
          
        </section>
      </div>
      <Footer />
    </>
  );
}
