import React from 'react';
import '../Assets/css/about.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import misionIcon from '../icons/mision.png';
import equipoIcon from '../icons/equipo.png';

const About = () => {
  return (
    <>
    <Header />
    
      <div className="about-us-container">
      <div className="mission-image">
          <img src={misionIcon} alt="Icono de misión" />
      </div>
      <section className="our-story">
        <h2 className="section-title">Nuestra Historia</h2>
        <p className="section-text">
          En BookLoop, nuestra misión es fomentar la lectura y la sostenibilidad a través de la venta de libros usados. 
          Creemos que cada libro tiene una historia que contar y queremos ayudar a que esas historias encuentren nuevos hogares.
        </p>
      </section>

      <section className="our-team">
        <h2 className="section-title">Nuestro Equipo</h2>
        <p className="section-text">
          Somos un grupo de apasionados por los libros, el planeta y la educación. 
          Nuestro equipo trabaja incansablemente para reducir el desperdicio y promover una economía circular.
        </p>
        <div className="team-image">
            <img src={equipoIcon} alt="Icono de equipo" />
          </div>
        
        <div className="team-members">
          <div className="team-member">
            <h3 className="member-name">Steel Henry</h3>
            <p className="member-position">CEO & Fundador</p>
          </div>
          <div className="team-member">
            <h3 className="member-name">Jacob Bouzheus</h3>
            <p className="member-position">CTO</p>
          </div>
        </div>
      </section>

      <section className="contact-form">
        <h2 className="section-title">Contacto</h2>
        <p className="contact-text">¿Tenés dudas o sugerencias? ¡Estamos para ayudarte!</p>
        
        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-label">Email:</span> itsbookloop@gmail.com
          </div>
          <div className="contact-item">
            <span className="contact-label">Contacto:</span> (+54) 3815699499
          </div>
          <div className="contact-item">
            <span className="contact-label">Horario de atención:</span> Lunes a Sábado de 8:00 a 21:00
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default About;