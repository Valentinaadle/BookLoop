import React, { useState } from "react";
import "../Assets/css/newsletter.css";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al suscribirse");
      } else {
        setSuccess(data.message || "¡Gracias por suscribirte!");
        setSubmitted(true);
      }
    } catch (err) {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newsletter-container">
      <div className="newsletter-title">Suscríbete a las novedades</div>
      <div className="newsletter-desc">
        Recibe nuestro newsletter para estar al día con todas las novedades.
      </div>
      {success && (
        <div style={{ color: "#2e7d32", fontWeight: 600, marginTop: "1rem" }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{ color: "#c62828", fontWeight: 600, marginTop: "1rem" }}>
          {error}
        </div>
      )}
      {!submitted && (
        <form className="newsletter-form" onSubmit={handleSubmit}>
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
        </form>
      )}
    </div>
  );
};

export default Newsletter;
