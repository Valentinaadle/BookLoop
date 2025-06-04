import React, { useState } from 'react';
import '../Assets/css/cuestionario.css';

function Cuestionario({ onFinalizar }) {
  const [respuestas, setRespuestas] = useState({});

  const manejarCambio = (pregunta, respuesta) => {
    setRespuestas(prev => ({ ...prev, [pregunta]: respuesta }));
  };

  const calcularResultados = () => {
    if (respuestas.genero) {
      onFinalizar(respuestas);
    } else {
      onFinalizar({}); // Clear recommendations if no genre is selected
    }
    setRespuestas({}); // Clear responses to close the questionnaire
  };

  return (
    <div className="cuestionario">
      <h3>Descubre tus intereses</h3>
      <div className="pregunta">
        <p>¿Cuál es tu género favorito?</p>
        <button onClick={() => manejarCambio('genero', 'Novela')}>Novela</button>
        <button onClick={() => manejarCambio('genero', 'Ciencia Ficción')}>Ciencia Ficción</button>
        <button onClick={() => manejarCambio('genero', 'Misterio')}>Misterio</button>
        <button onClick={() => manejarCambio('genero', 'Fantasía')}>Fantasía</button>
        <button onClick={() => manejarCambio('genero', 'Poesía')}>Poesía</button>
        <button onClick={() => manejarCambio('genero', 'Terror')}>Terror</button>
      </div>
      <button className="ver-recomendaciones" onClick={calcularResultados}>Ver Recomendaciones</button>
    </div>
  );
}

export default Cuestionario; 