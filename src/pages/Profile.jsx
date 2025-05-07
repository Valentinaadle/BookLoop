import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../Assets/css/profile.css';
import '../Assets/css/header.css';
import '../Assets/css/footer.css';

function Profile() {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = () => {
    setIsVerified(true);
    // Aquí iría la lógica real de verificación
  };

  return (
    <>
      <Header />
      
      <div className="profile-container">
        <div className="profile-card">
          <div className="header-background"></div>
          
          <div className="profile-top">
            <div className="avatar-circle">J</div>
            <div className="info">
              <h2>
                Lucas Luna 
                {!isVerified && (
                  <button className="verify-btn" onClick={handleVerify}>
                    Get Verified
                  </button>
                )}
                {isVerified && <span className="verified-badge">✓ Verificado</span>}
              </h2>
              <p>Universidad Santo Tomás De Aquino</p>
              <p>Argentina, Tucumán, Yerba Buena • <a href="#">Contact Info</a></p>
            </div>
            <div className="school-logo">
              <div className="profile-actions">
                <button>Seguir</button>
              </div>  
            </div>
          </div>
      
          <div className="profile-actions">
            <button>Seguir</button>
            <button>Mensaje</button>
            <button>Editar perfil</button>
            <button>Ver publicaciones</button>
          </div>
      
          <div className="promo-cards">
            <div className="card">
              <p><strong>¿Buscas recomendaciones?</strong></p>
              <p>Controla los géneros y temas que te interesan para recibir sugerencias personalizadas.</p>
              <br />
              <a href="#" className="b">Configurar intereses</a>
            </div>
            <div className="card">
              <p><strong>¿Eres autor o editor?</strong></p>
              <p>Publica tus libros o gestiona tu catálogo desde tu perfil.</p>
              <br />
              <a href="#" className="b">Subir un libro / Gestionar publicaciones</a>
            </div>
          </div>
      
          <div className="suggestions">
            <h3>Sugerencias • Solo para ti</h3>
            <div className="suggestion-row">
              <div className="suggestion-box">
                <p><strong>¿Qué géneros te gustan?</strong></p>
                <p>Los perfiles con géneros preferidos obtienen mejores recomendaciones.</p>
                <button>Agregar géneros</button>
              </div>
              <div className="suggestion-box">
                <p><strong>Agrega una biografía lectora</strong></p>
                <p>Compartir tu historia como lector aumenta la interacción.</p>
                <button>Agregar biografía</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}

export default Profile;