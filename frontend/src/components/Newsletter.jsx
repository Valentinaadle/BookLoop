import React, { useState } from "react";
import "../Assets/css/newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulamos una llamada al backend
    setTimeout(() => {
      setLoading(false);
      setEmail(""); // opcional, limpiar input
      setShowModal(true); // mostramos el modal
    }, 1000); // simula 1 segundo de espera
  };

  return (
    <div className="newsletter-container">
      <div className="newsletter-text-content">
        <h2 className="newsletter-title">Suscríbete a las novedades</h2>
        <p className="newsletter-desc">
          Recibe nuestro newsletter para estar al día con todas las novedades.
        </p>
      </div>

      <form className="newsletter-form" onSubmit={handleSubmit}>
        <div className="newsletter-input-group">
          <input
            className="newsletter-input"
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <button className="newsletter-btn" type="submit" disabled={loading}>
            {loading ? "Enviando..." : "SUSCRIBIRME"}
          </button>
        </div>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>¡Suscripción exitosa!</h3>
            <p>Gracias por suscribirte a nuestro newsletter. Pronto recibirás novedades en tu correo.</p>
            <button onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newsletter;
