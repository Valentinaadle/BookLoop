import React from 'react';
import '../Assets/css/portada.css';
import { FaShoppingCart, FaBookOpen } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import book12 from '../Assets/book12.webp';
import book5 from "../Assets/book5.webp";
import book6 from "../Assets/book6.webp";
import book7 from "../Assets/book7.webp";
import book8 from "../Assets/book8.webp";
import book9 from "../Assets/book9.webp";

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
              <img src={book12} alt="El Principito" />
              <h3>El Principito</h3>
              <p>de Antoine de Saint-Exupéry</p>
            </div>
            <div className="product-card">
              <span className="discount">-50%</span>
              <img src={book9} alt="El León de Ale" />
              <h3>El León de Ale</h3>
              <p>de Alejandro R.</p>
            </div>
            <div className="product-card">
              <span className="discount">-30%</span>
              <img src={book5} alt="Pepe el Grillo" />
              <h3>Pepe El Grillo</h3>
              <p>de Andres B.</p>
            </div>
            <div className="product-card">
              <span className="discount">-10%</span>
              <img src={book6} alt="Pepe el Grillo" />
              <h3>Pepe El Grillo</h3>
              <p>de Andres B.</p>
            </div>
            <div className="product-card">
              <span className="discount">-20%</span>
              <img src={book7} alt="Pepe el Grillo" />
              <h3>Pepe El Grillo</h3>
              <p>de Andres B.</p>
            </div>
            <div className="product-card">
              <span className="discount">-40%</span>
              <img src={book8} alt="Pepe el Grillo" />
              <h3>Pepe El Grillo</h3>
              <p>de Andres B.</p>
            </div>
          
          </div>
          
        </section>
      </div>
      <Footer />
    </>
  );
}
