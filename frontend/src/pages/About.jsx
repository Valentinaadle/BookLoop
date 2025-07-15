import React from 'react';
import '../Assets/css/about.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import valentinaImg from '../Assets/persona.jpg';

const About = () => {
  // Datos del equipo
  const teamMembers = [
    { id: 1, name: "Valentina", role: "Fundadora", img: valentinaImg },
    { id: 2, name: "Alessandro", role: "Logística", img: valentinaImg },
    { id: 3, name: "Candelaria", role: "Atención al cliente", img: valentinaImg },
    { id: 4, name: "Lucas", role: "Servicio tecnico", img: valentinaImg },
    { id: 5, name: "Andres", role: "RR.HH", img: valentinaImg },
  ];

  // Datos de contacto
  const contactInfo = [
    { id: 1, icon: "✉️", label: "Email", info: "itsbookloop@gmail.com" },
    { id: 2, icon: "📞", label: "Teléfono", info: "(+54) 3815699499" },
    { id: 3, icon: "🕒", label: "Horario", info: "Lunes a Sábado de 8:00 a 21:00" },
  ];

  return (
    <>
      <Header />
      <div className="about-container">
        {/* Sección Hero unificada con Misión */}
        <section className="unified-hero-mission">
          <div className="hero-content">
            <h1>BookLoop: Donde los libros renacen</h1>
            <div className="mission-infoboxes">
              <div className="infobox">
                <div className="infobox-icon">📚</div>
                <p>Fomentamos la sostenibilidad a través de la venta de libros usados</p>
              </div>
              <div className="infobox">
                <div className="infobox-icon">🔄</div>
                <p>Creemos que cada libro tiene una historia que contar</p>
              </div>
              <div className="infobox">
                <div className="infobox-icon">🌱</div>
                <p>Promovemos una economía circular para reducir el desperdicio</p>
              </div>
            </div>
          </div>
        </section>

        {/* Equipo */}
        <section className="team-section">
  <div className="team-header">
    
    <h2>Nuestro Equipo</h2>
  
  </div>
  
  <div className="team-container">
    <div className="team-content">
      <div className="team-description">
        <p>
          Somos un grupo de apasionados por los libros, el planeta y la educación. 
          Nos une el amor por las historias y la convicción de que la educación debe ser accesible y respetuosa con el planeta.
        </p>
      </div>
      
      <div className="team-grid">
        {teamMembers.map((member) => (
          <div key={member.id} className="team-member-card">
            <div className="member-image-container">
              <img src={member.img} alt={member.name} className="member-image" />
              
            </div>
            <div className="member-details">
              <span className="member-name">{member.name}</span>
              <span className="member-role">{member.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

        {/* Contacto */}
        <section className="contact-section">
          <h2>Contacto</h2>
          <p className="contact-description">¿Tenés dudas o sugerencias? ¡Estamos para ayudarte!</p>
          <div className="contact-grid">
            {contactInfo.map((contact) => (
              <div key={contact.id} className="contact-card">
                <span className="contact-icon">{contact.icon}</span>
                <h3>{contact.label}</h3>
                <p>{contact.info}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;