import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../Assets/css/desktopFilters.css';

const DesktopFilters = ({
  categories = [],
  selectedGenres = [],
  selectedLanguages = [],
  selectedConditions = [],
  priceRange = { min: '', max: '' },
  onGenreChange,
  onLanguageChange,
  onConditionChange,
  onPriceChange,
  languageMap = {
    'en': 'Inglés',
    'es': 'Español',
  },
  conditions = ["Nuevo", "Como Nuevo", "Buen Estado", "Aceptable"]
}) => {
  // Usar las categorías del backend si están disponibles, sino usar géneros por defecto
  const defaultGenres = [
    "Novela",
    "Cuento", 
    "Poesía",
    "Drama",
    "Ciencia ficción",
    "Fantasía",
    "Misterio",
    "Terror",
    "Romance",
    "Deportes",
    "Realistas",
    "Salud",
    "Tecnología",
    "Ciencias",
    "Escolar"
  ];

  // Usar categorías del backend si están disponibles, sino usar géneros por defecto
  const allGenres = categories && categories.length > 0 
    ? categories 
    : defaultGenres.map(name => ({ category_id: name, category_name: name }));
  
  // Filtrar géneros no deseados
  const genresToExclude = ['Ciencias', 'Filosofía', 'Fantasía', 'Escolar'];
  const genresToShow = allGenres.filter(category => 
    !genresToExclude.includes(category.category_name)
  );
  const [collapsed, setCollapsed] = useState({
    genero: true,
    idioma: true,
    estado: true,
    precio: true
  });

  const toggle = (key) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="desktop-filters">
      <div className="filters-header">
        <h3>Filtros</h3>
      </div>

      {/* Filtro de Género */}
      <div className="filter-section">
        <button 
          className="filter-header" 
          onClick={() => toggle('genero')}
        >
          <span>Género</span>
                     {!collapsed.genero ? <FaChevronDown /> : <FaChevronUp />}
        </button>
                 <div className={`filter-content ${collapsed.genero ? 'collapsed' : ''}`}>
          <div className="filter-options">
            {genresToShow.map(category => (
              <label key={category.category_id} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(category.category_name)}
                  onChange={() => onGenreChange(category.category_name)}
                  className="filter-checkbox"
                />
                <span className="filter-label">{category.category_name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Filtro de Idioma */}
      <div className="filter-section">
        <button 
          className="filter-header" 
          onClick={() => toggle('idioma')}
        >
          <span>Idioma</span>
                     {!collapsed.idioma ? <FaChevronDown /> : <FaChevronUp />}
        </button>
        <div className={`filter-content ${collapsed.idioma ? 'collapsed' : ''}`}>
          <div className="filter-options">
            {Object.entries(languageMap).map(([code, name]) => (
              <label key={code} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes(name)}
                  onChange={() => onLanguageChange(name)}
                  className="filter-checkbox"
                />
                <span className="filter-label">{name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Filtro de Estado */}
      <div className="filter-section">
        <button 
          className="filter-header" 
          onClick={() => toggle('estado')}
        >
          <span>Estado</span>
                     {!collapsed.estado ? <FaChevronDown /> : <FaChevronUp />}
        </button>
        <div className={`filter-content ${collapsed.estado ? 'collapsed' : ''}`}>
          <div className="filter-options">
            {conditions.map(condition => (
              <label key={condition} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedConditions.includes(condition)}
                  onChange={() => onConditionChange(condition)}
                  className="filter-checkbox"
                />
                <span className="filter-label">{condition}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Filtro de Precio */}
      <div className="filter-section">
        <button 
          className="filter-header" 
          onClick={() => toggle('precio')}
        >
          <span>Precio</span>
                     {!collapsed.precio ? <FaChevronDown /> : <FaChevronUp />}
        </button>
        <div className={`filter-content ${collapsed.precio ? 'collapsed' : ''}`}>
          <div className="price-range">
            <div className="price-input-group">
              <label>Desde:</label>
                             <input
                 type="number"
                 placeholder="Precio mínimo ($)"
                 value={priceRange.min}
                 onChange={(e) => onPriceChange({ ...priceRange, min: e.target.value })}
                 className="price-input"
               />
            </div>
            <div className="price-input-group">
              <label>Hasta:</label>
                             <input
                 type="number"
                 placeholder="Precio máximo ($)"
                 value={priceRange.max}
                 onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value })}
                 className="price-input"
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopFilters; 