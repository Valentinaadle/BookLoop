import React from 'react';
import '../Assets/css/about.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import andresImg from '../Assets/team/andres.jpg';
import lucasImg from '../Assets/team/lucas.jpg';
import candeImg from '../Assets/team/cande.jpg';
import aleImg from '../Assets/team/ale.jpg';
import valeImg from '../Assets/team/vale.jpg';

// Importamos íconos vectoriales modernos en lugar de las imágenes JPG estáticas
import { FaLeaf, FaBookOpen, FaRecycle, FaEnvelope, FaPhoneAlt, FaClock } from 'react-icons/fa';

const About = () => {
  // Datos del equipo
  const teamMembers = [
    { id: 1, name: "Valentina", role: "Fundadora", descripcion:"La mente creativa detrás del proyecto, impulsa la visión y dirige cada paso del emprendimiento.", img: valeImg },
    { id: 2, name: "Alessandro", role: "Logística", descripcion:"Supervisa el correcto funcionamiento de la plataforma y procesos entre las partes.", img: aleImg },
    { id: 3, name: "Candelaria", role: "Atención al cliente", descripcion:"Resuelve dudas y acompaña a cada cliente para brindar una experiencia excelente.", img: candeImg },
    { id: 4, name: "Lucas", role: "Servicio tecnico", descripcion:"Garantiza el correcto funcionamiento de la pagina y soluciones técnicas.", img: lucasImg },
    { id: 5, name: "Andres", role: "RR.HH", descripcion:"Se ocupa de nuestro equipo, cuidando el talento y fomentando un buen clima laboral.", img: andresImg },
  ];

  // Datos de contacto usando react-icons
  const contactInfo = [
    { 
      id: 1, 
      Icon: FaEnvelope, 
      label: "Email", 
      info: "itsbookloop@gmail.com" 
    },
    { 
      id: 2, 
      Icon: FaPhoneAlt, 
      label: "Teléfono", 
      info: "(+54) 3815699499" 
    },
    { 
      id: 3, 
      Icon: FaClock, 
      label: "Horario", 
      info: "Lunes a Sábado de 8:00 a 21:00" 
    }
  ];

  return (
    <>
      <Header />
      <div className="about-container">
        {/* Sección Hero unificada con Misión */}
        <section className="unified-hero-mission">
          <div className="hero-content">
            <h1>Acerca de nosotros</h1>
          </div>
        </section>
       <div className="mission-infoboxes">
        <div className="infobox">
          <div className="infobox-top"> 
            <div className="infobox-icon-wrapper">
              <FaLeaf className="infobox-icon-svg" />
            </div>
            <h3 className="infobox-title">Sostenibilidad</h3>
          </div>
          <p className="infobox-text">Fomentamos la sostenibilidad a través de la venta de libros usados</p>
        </div>
        
        <div className="infobox">
          <div className="infobox-top">
            <div className="infobox-icon-wrapper">
              <FaBookOpen className="infobox-icon-svg" />
            </div>
            <h3 className="infobox-title">Historias</h3>
          </div>
          <p className="infobox-text">Creemos que cada libro tiene una historia que contar</p>
        </div>
        
        <div className="infobox">
          <div className="infobox-top">
            <div className="infobox-icon-wrapper">
              <FaRecycle className="infobox-icon-svg" />
            </div>
            <h3 className="infobox-title">Economía Circular</h3>
          </div>
          <p className="infobox-text">Promovemos una economía circular para reducir el desperdicio</p>
        </div>
      </div>

        {/* Equipo - Versión cards alargadas */}
        <section className="team-section">
          <div className="team-header">
            <h2>Conocé a nuestro equipo</h2>
            <p>Somos un grupo de apasionados que trabajamos cada día para que tu experiencia en nuestra plataforma sea única. </p>
            <p>Promovemos la economía circular, dándole una nueva vida a los productos y fomentando un consumo más responsable.</p>
          </div>
        
          <div className="team-container">
            <div className="team-grid-five">
              {teamMembers.map((member) => (
                <div key={member.id} className="team-card-slim">
                  <div className="member-image-wrapper-slim">
                    <img src={member.img} alt={member.name} className="member-photo-slim"/>
                  </div>
                  <div className="member-info-slim">
                    <h3 className="member-name-slim">{member.name}</h3>
                    <p className="member-role-slim">{member.role}</p>
                    <p className="member-description-slim">
                      {member.descripcion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section className="contact-section">
          <h2>Contacto</h2>
          <p className="contact-description">¿Tenés dudas o sugerencias? ¡Estamos para ayudarte!</p>
          <div className="contact-grid">
          {contactInfo.map((contact) => {
            const Icon = contact.Icon;
            return (
              <div key={contact.id} className="contact-card">
                <div className="contact-icon-container">
                  <Icon className="contact-icon-svg" />
                </div>
                <h3>{contact.label}</h3>
                <p>{contact.info}</p>
              </div>
            );
          })}
        </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;