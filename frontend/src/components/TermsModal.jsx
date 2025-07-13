import React from 'react';

export default function TermsModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-bold mb-2" style={{ color: '#131416', textAlign: 'center' }}>Términos y Condiciones de BookLoop</h2>
        <ul style={{margin:'0.5rem 0 0 1.2rem',padding:0, color:'#222', fontSize:'0.98rem', textAlign:'left'}}>
          <li>BookLoop es solo una plataforma de contacto entre compradores y vendedores de libros usados.</li>
          <li>No intervenimos ni garantizamos el pago, la entrega ni la calidad de los libros.</li>
          <li>El dinero de la compra/venta se acuerda y transfiere directamente entre las partes.</li>
          <li>BookLoop no se hace responsable por fraudes, pérdidas, daños o cualquier inconveniente derivado de la transacción.</li>
          <li>Al registrarte, aceptas que eres responsable de verificar la identidad de la otra parte y de actuar con precaución.</li>
          <li>El uso de la plataforma implica la aceptación de estos términos.</li>
        </ul>
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            style={{ color: '#fff', background: '#131416', border: '1px solid #131416', padding: '8px 32px', borderRadius: '6px', fontWeight: 600, transition: 'background 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.background = '#23262a')}
            onMouseOut={e => (e.currentTarget.style.background = '#131416')}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
