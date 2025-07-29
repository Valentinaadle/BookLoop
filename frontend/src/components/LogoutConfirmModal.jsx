import React from 'react';
import '../Assets/css/LogoutConfirmModal.css';

export default function LogoutConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal-content">
        <h2 className="logout-modal-title">{title || 'Cerrar sesión'}</h2>
        <p className="logout-modal-message">{message}</p>
        <div className="logout-modal-actions">
          <button
            onClick={onCancel}
            className="logout-modal-button cancel"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="logout-modal-button confirm"
          >
            Sí, cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
