import React from 'react';
import '../Assets/css/about.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  return (
    <>
      <Header />
      
      <div className="about-us-container">
        {/* Sección Misión */}
        <section className="content-section mission-section">
          <div className="section-header">
            <img src="/icons/mision.png" alt="Icono Misión" className="section-icon" />
            <h2 className="section-title">Nuestra Misión</h2>
          </div>
          <div className="section-content">
            <p className="section-text">
              En BookLoop, nuestra misión es fomentar la lectura y la sostenibilidad a través de la venta de libros usados. 
              Creemos que cada libro tiene una historia que contar y queremos ayudar a que esas historias encuentren nuevos hogares.<br />
              Reducir el desperdicio de libros y promover una economía circular donde cada libro pueda ser reutilizado y disfrutado por nuevas generaciones.
            </p>
          </div>
        </section>

        {/* Sección Equipo */}
        <section className="content-section team-section">
          <div className="section-header">
            <img src="/icons/equipo.png" alt="Icono Equipo" className="section-icon" />
            <h2 className="section-title">Nuestro Equipo</h2>
          </div>
          <div className="section-content">
            <p className="section-text">
              Somos un grupo de apasionados por los libros, el planeta y la educación. 
              Nuestro equipo trabaja incansablemente para reducir el desperdicio y promover una economía circular. <br />
              Nos une el amor por las historias, pero también la convicción de que la educación debe ser accesible y respetuosa con el planeta.
            </p>
          </div>
        </section>

        {/* Sección Contacto */}
        <section className="content-section contact-section">
          <div className="section-header">
            <img src="/icons/whatsapp.png" alt="Icono WhatsApp" className="section-icon contact-icon" />
            <h2 className="section-title">Contacto</h2>
          </div>
          <div className="section-content">
            <p className="section-text">¿Tenés dudas o sugerencias? ¡Estamos para ayudarte!</p>
            
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-label">Email:</span> itsbookloop@gmail.com
              </div>
              <div className="contact-item">
                <span className="contact-label">Teléfono:</span> (+54) 3815699499
              </div>
              <div className="contact-item">
                <span className="contact-label">Horario:</span> Lunes a Sábado de 8:00 a 21:00
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;