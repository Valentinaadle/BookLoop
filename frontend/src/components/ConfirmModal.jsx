import React from 'react';

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-2" style={{ color: '#131416', textAlign: 'center' }}>{title || 'Confirmar'}</h2>
        <p className="mb-4" style={{ color: '#131416', textAlign: 'center' }}>{message}</p>
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={onCancel}
            style={{ color: '#131416', border: '1px solid #131416', background: 'transparent', padding: '8px 20px', borderRadius: '6px', fontWeight: 500, transition: 'background 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.background = '#f2f2f2')}
            onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{ color: '#fff', background: '#131416', border: '1px solid #131416', padding: '8px 20px', borderRadius: '6px', fontWeight: 600, transition: 'background 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.background = '#23262a')}
            onMouseOut={e => (e.currentTarget.style.background = '#131416')}
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
