import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaFilter, FaTags, FaLanguage, FaStar, FaMoneyBillWave } from 'react-icons/fa';
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
  const defaultGenres = [
    "Novela", "Cuento", "Poesía", "Drama", "Ciencia ficción",
    "Fantasía", "Misterio", "Terror", "Romance", "Deportes",
    "Realistas", "Salud", "Tecnología", "Ciencias", "Escolar"
  ];

  const allGenres = categories && categories.length > 0 
    ? categories 
    : defaultGenres.map(name => ({ category_id: name, category_name: name }));
  
  const genresToExclude = ['Ciencias', 'Filosofía', 'Fantasía', 'Escolar'];
  const genresToShow = allGenres.filter(category => 
    !genresToExclude.includes(category.category_name)
  );

  const [collapsed, setCollapsed] = useState({
    genero: false,
    idioma: false,
    estado: false,
    precio: false
  });

  const toggle = (key) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearFilters = () => {
    // We would need to pass this from parent, but we can just trigger empty states if possible
    // Since we don't have a clear all function passed, we'll leave it out or add it to parent later.
  };

  return (
    <div className="desktop-filters modern-filters">
      <div className="filters-header modern-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaFilter className="filter-icon" />
          <h3>Filtros</h3>
        </div>
      </div>

      {/* Filtro de Género */}
      <div className={`filter-section modern-section ${collapsed.genero ? 'is-collapsed' : ''}`}>
        <button className="filter-header modern-btn" onClick={() => toggle('genero')}>
          <div className="header-title">
            <FaTags className="section-icon" />
            <span>Género</span>
          </div>
          <div className="icon-wrapper">
            {!collapsed.genero ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </button>
        <div className={`filter-content modern-content ${collapsed.genero ? 'collapsed' : ''}`}>
          <div className="chips-container">
            {genresToShow.map(category => {
              const isSelected = selectedGenres.includes(category.category_name);
              return (
                <button
                  key={category.category_id}
                  className={`filter-chip ${isSelected ? 'selected' : ''}`}
                  onClick={() => onGenreChange(category.category_name)}
                >
                  {category.category_name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filtro de Idioma */}
      <div className={`filter-section modern-section ${collapsed.idioma ? 'is-collapsed' : ''}`}>
        <button className="filter-header modern-btn" onClick={() => toggle('idioma')}>
          <div className="header-title">
            <FaLanguage className="section-icon" />
            <span>Idioma</span>
          </div>
          <div className="icon-wrapper">
            {!collapsed.idioma ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </button>
        <div className={`filter-content modern-content ${collapsed.idioma ? 'collapsed' : ''}`}>
          <div className="chips-container">
            {Object.entries(languageMap).map(([code, name]) => {
              const isSelected = selectedLanguages.includes(name);
              return (
                <button
                  key={code}
                  className={`filter-chip ${isSelected ? 'selected' : ''}`}
                  onClick={() => onLanguageChange(name)}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filtro de Estado */}
      <div className={`filter-section modern-section ${collapsed.estado ? 'is-collapsed' : ''}`}>
        <button className="filter-header modern-btn" onClick={() => toggle('estado')}>
          <div className="header-title">
            <FaStar className="section-icon" />
            <span>Estado</span>
          </div>
          <div className="icon-wrapper">
            {!collapsed.estado ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </button>
        <div className={`filter-content modern-content ${collapsed.estado ? 'collapsed' : ''}`}>
          <div className="chips-container">
            {conditions.map(condition => {
              const isSelected = selectedConditions.includes(condition);
              return (
                <button
                  key={condition}
                  className={`filter-chip ${isSelected ? 'selected' : ''}`}
                  onClick={() => onConditionChange(condition)}
                >
                  {condition}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filtro de Precio */}
      <div className={`filter-section modern-section ${collapsed.precio ? 'is-collapsed' : ''}`}>
        <button className="filter-header modern-btn" onClick={() => toggle('precio')}>
          <div className="header-title">
            <FaMoneyBillWave className="section-icon" />
            <span>Precio</span>
          </div>
          <div className="icon-wrapper">
            {!collapsed.precio ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </button>
        <div className={`filter-content modern-content ${collapsed.precio ? 'collapsed' : ''}`}>
          <div className="price-range modern-price">
            <div className="price-inputs-row">
              <div className="price-input-wrapper">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => onPriceChange({ ...priceRange, min: e.target.value })}
                  className="modern-price-input"
                />
              </div>
              <span className="price-separator">-</span>
              <div className="price-input-wrapper">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value })}
                  className="modern-price-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopFilters; 