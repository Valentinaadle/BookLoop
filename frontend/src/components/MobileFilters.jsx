import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const MobileFilters = ({
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
    'fr': 'Francés',
  },
  conditions = ["Nuevo", "Como Nuevo", "Buen Estado", "Usado", "Aceptable", "Muy bueno"]
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sections, setSections] = useState({
    genero: true,
    idioma: true,
    estado: true,
    precio: true
  });

  const toggleSection = (section) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const openPanel = () => setIsOpen(true);
  const closePanel = () => setIsOpen(false);

  return (
    <div>
      {/* Botón hamburguesa para móviles */}
      <button
        onClick={openPanel}
        className="lg:hidden fixed top-20 left-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700"
        style={{ zIndex: 999999 }}
      >
        <FaBars size={18} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closePanel}
          style={{ zIndex: 9998 }}
        />
      )}

      {/* Panel móvil */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ zIndex: 9999, maxWidth: '85vw', overflowY: 'auto' }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Filtros</h2>
            <button onClick={closePanel} className="p-2 hover:bg-gray-100 rounded">
              <FaTimes size={18} />
            </button>
          </div>

          {/* Filtros */}
          <div className="space-y-4">
            {/* Género */}
            <div>
              <button
                onClick={() => toggleSection('genero')}
                className="w-full flex justify-between items-center py-2 font-medium"
              >
                Género <span>{sections.genero ? '−' : '+'}</span>
              </button>
              {sections.genero && (
                <div className="space-y-2 mt-2">
                  {categories.map(cat => (
                    <label key={cat.category_id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(cat.category_name)}
                        onChange={() => onGenreChange(cat.category_name)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{cat.category_name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Idioma */}
            <div>
              <button
                onClick={() => toggleSection('idioma')}
                className="w-full flex justify-between items-center py-2 font-medium"
              >
                Idioma <span>{sections.idioma ? '−' : '+'}</span>
              </button>
              {sections.idioma && (
                <div className="space-y-2 mt-2">
                  {Object.values(languageMap).map(lang => (
                    <label key={lang} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(lang)}
                        onChange={() => onLanguageChange(lang)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{lang}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Estado */}
            <div>
              <button
                onClick={() => toggleSection('estado')}
                className="w-full flex justify-between items-center py-2 font-medium"
              >
                Estado <span>{sections.estado ? '−' : '+'}</span>
              </button>
              {sections.estado && (
                <div className="space-y-2 mt-2">
                  {conditions.map(condition => (
                    <label key={condition} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(condition)}
                        onChange={() => onConditionChange(condition)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{condition}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Precio */}
            <div>
              <button
                onClick={() => toggleSection('precio')}
                className="w-full flex justify-between items-center py-2 font-medium"
              >
                Precio <span>{sections.precio ? '−' : '+'}</span>
              </button>
              {sections.precio && (
                <div className="space-y-3 mt-2">
                  <input
                    type="number"
                    placeholder="Mínimo"
                    value={priceRange.min}
                    onChange={(e) => onPriceChange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Máximo"
                    value={priceRange.max}
                    onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Panel desktop */}
      <aside className="hidden lg:block w-64 bg-white border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-6 pb-2 border-b">Filtros</h2>
        
        <div className="space-y-4">
          {/* Género Desktop */}
          <div>
            <button
              onClick={() => toggleSection('genero')}
              className="w-full flex justify-between items-center py-2 font-medium"
            >
              Género <span>{sections.genero ? '−' : '+'}</span>
            </button>
            {sections.genero && (
              <div className="space-y-2 mt-2">
                {categories.map(cat => (
                  <label key={cat.category_id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(cat.category_name)}
                      onChange={() => onGenreChange(cat.category_name)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{cat.category_name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Idioma Desktop */}
          <div>
            <button
              onClick={() => toggleSection('idioma')}
              className="w-full flex justify-between items-center py-2 font-medium"
            >
              Idioma <span>{sections.idioma ? '−' : '+'}</span>
            </button>
            {sections.idioma && (
              <div className="space-y-2 mt-2">
                {Object.values(languageMap).map(lang => (
                  <label key={lang} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(lang)}
                      onChange={() => onLanguageChange(lang)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{lang}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Estado Desktop */}
          <div>
            <button
              onClick={() => toggleSection('estado')}
              className="w-full flex justify-between items-center py-2 font-medium"
            >
              Estado <span>{sections.estado ? '−' : '+'}</span>
            </button>
            {sections.estado && (
              <div className="space-y-2 mt-2">
                {conditions.map(condition => (
                  <label key={condition} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedConditions.includes(condition)}
                      onChange={() => onConditionChange(condition)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{condition}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Precio Desktop */}
          <div>
            <button
              onClick={() => toggleSection('precio')}
              className="w-full flex justify-between items-center py-2 font-medium"
            >
              Precio <span>{sections.precio ? '−' : '+'}</span>
            </button>
            {sections.precio && (
              <div className="space-y-3 mt-2">
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={priceRange.min}
                  onChange={(e) => onPriceChange({ ...priceRange, min: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm"
                />
                <input
                  type="number"
                  placeholder="Máximo"
                  value={priceRange.max}
                  onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MobileFilters; 