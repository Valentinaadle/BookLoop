import React, { useState } from 'react';
import '../Assets/css/faqquestions.css';

const FAQQuestions = () => {
  const faqs = [
    {
      question: '¿Cómo realizo una compra en Bookloop?',
      answer: 'Para comprar, selecciona el libro que te interese y haz clic en "Contactar al vendedor". Automáticamente se enviará un email al vendedor con tus datos para que coordinen el pago y envío. Bookloop facilita el contacto, pero la transacción final se acuerda directamente entre las partes.'
    },
    {
      question: '¿Cuánto cuesta publicar un libro?',
      answer: 'Es completamente gratis. Solo regístrate, completa los datos del libro y publícalo. No hay límites ni comisiones por venta. Puedes editar o eliminar tus publicaciones cuando quieras.',
    },
    {
      question: '¿Qué hago si tengo problemas con una venta?',
      answer:' Contacta a nuestro equipo de soporte desde la sección "Contacto". Mediamos en disputas y brindamos asistencia para resolver cualquier inconveniente con compradores o vendedores.'
    },
    {
      question: '¿Puedo editar o eliminar una publicación?',
      answer: 'Sí. Desde tu perfil, en "Mis publicaciones", puedes modificar detalles, fotos o precios, o eliminar el anuncio si ya no está disponible. Los cambios se actualizan inmediatamente.',
    },
    {
      question: '¿Cuánto tiempo toma vender un libro?',
      answer: 'Depende de la demanda y el precio. Libros populares o académicos suelen venderse en días o semanas. Te sugerimos incluir buenas fotos y precios razonables para agilizar el proceso.',
    },
   
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1 className="faq-title">Preguntas Comunes sobre BookLoop</h1>
      <p className="faq-subtitle">Encuentra respuestas a las dudas más frecuentes sobre cómo vender y comprar libros usados en nuestra plataforma.</p>
      
      {faqs.map((faq, index) => (
        <div className={`faq-item ${openIndex === index ? 'open' : ''}`} key={index}>
          <button className="faq-question" onClick={() => toggleFAQ(index)}>
            {faq.question}
            <span className={`faq-arrow ${openIndex === index ? 'open' : ''}`}>▼</span>
          </button>
          <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
            {openIndex === index && <p>{faq.answer}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQQuestions;