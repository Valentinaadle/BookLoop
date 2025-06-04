import React, { useState } from 'react';
import '../Assets/css/filtro.css';

function Filtros({ onAplicarFiltros }) {
  const [filtros, setFiltros] = useState({
    categorias: [],
    idioma: '',
    autor: '',
    precio: { min: 5, max: 60 }
  });

  const manejarCambio = (tipo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [tipo]: valor
    }));
  };

  const aplicarFiltros = () => {
    onAplicarFiltros(filtros);
  };

  return (
    <div className="filtros">
      <h3>Filtros</h3>
      <div className="filter-group">
        <h4>Categorías</h4>
        <label><input type="checkbox" /> Educational</label>
        <label><input type="checkbox" /> Business</label>
        <label><input type="checkbox" /> Marketing</label>
        <label><input type="checkbox" /> Design</label>
        <label><input type="checkbox" /> Imaginative literature</label>
        <label><input type="checkbox" /> Scientific literature</label>
        <label><input type="checkbox" /> Other</label>
      </div>
      <div className="filter-group">
        <h4>Idioma</h4>
        <label><input type="checkbox" /> English</label>
        <label><input type="checkbox" /> Ukrainian</label>
        <label><input type="checkbox" /> German</label>
        <label><input type="checkbox" /> Italian</label>
        <label><input type="checkbox" /> French</label>
        <label><input type="checkbox" /> Spanish</label>
      </div>
      <div className="filter-group">
        <h4>Autor</h4>
        <input type="text" placeholder="Find Author" onChange={(e) => manejarCambio('autor', e.target.value)} />
        <label><input type="checkbox" /> Joanne Rowling</label>
        <label><input type="checkbox" /> Taylor Jenkins Reid</label>
        <label><input type="checkbox" /> Rebecca Yarros</label>
        <label><input type="checkbox" /> Don Norman</label>
      </div>
      <div className="filter-group">
        <h4>Precio</h4>
        <div className="price-range">
          <label>Desde <input type="number" value={filtros.precio.min} onChange={(e) => manejarCambio('precio', { ...filtros.precio, min: e.target.value })} /></label>
          <label>Hasta <input type="number" value={filtros.precio.max} onChange={(e) => manejarCambio('precio', { ...filtros.precio, max: e.target.value })} /></label>
        </div>
      </div>
      <button onClick={aplicarFiltros}>APPLY</button>
    </div>
  );
}

export default Filtros; 