import React from 'react';
import '../Assets/css/TermsModal.css';

export default function TermsModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="terms-modal-overlay">
      <div className="terms-modal-content">
        <h2 className="terms-modal-title">Términos y Condiciones de BookLoop</h2>
        <ul className="terms-modal-list">
          <li>BookLoop es solo una plataforma de contacto entre compradores y vendedores de libros usados.</li>
          <li>No intervenimos ni garantizamos el pago, la entrega ni la calidad de los libros.</li>
          <li>El dinero de la compra/venta se acuerda y transfiere directamente entre las partes.</li>
          <li>BookLoop no se hace responsable por fraudes, pérdidas, daños o cualquier inconveniente derivado de la transacción.</li>
          <li>Al registrarte, aceptas que eres responsable de verificar la identidad de la otra parte y de actuar con precaución.</li>
          <li>El uso de la plataforma implica la aceptación de estos términos.</li>
        </ul>
        <div className="terms-modal-actions">
          <button
            onClick={onClose}
            className="terms-modal-button"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
