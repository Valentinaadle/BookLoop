import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const ResponsiveFilters = ({
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
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [collapsed, setCollapsed] = useState({
    genero: true,
    idioma: true,
    estado: true,
    precio: true
  });

  const toggle = (key) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  const closeFilterPanel = () => {
    setIsFilterPanelOpen(false);
  };

  return (
    <>
      {/* BOTÓN HAMBURGUESA - Solo visible en dispositivos móviles */}
      <button
        onClick={toggleFilterPanel}
        className="block lg:hidden fixed top-20 left-4 z-[9999] bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-lg transition-colors duration-200"
        style={{
          position: 'fixed',
          zIndex: 9999,
          top: '80px',
          left: '16px'
        }}
      >
        <FaBars size={20} />
      </button>

      {/* OVERLAY - Solo aparece en móviles cuando el panel está abierto */}
      {isFilterPanelOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[8888]"
          onClick={closeFilterPanel}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 8888
          }}
        />
      )}

      {/* PANEL DE FILTROS MÓVIL - Se desliza desde la izquierda */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-[9000] transform transition-transform duration-300 ease-in-out ${
          isFilterPanelOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          position: 'fixed',
          zIndex: 9000,
          height: '100vh',
          overflowY: 'auto'
        }}
      >
        <div className="p-6">
          {/* Header con botón de cerrar */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Filtros</h2>
            <button
              onClick={closeFilterPanel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Contenido de filtros */}
          <div className="space-y-6">
            {/* Filtro de Género */}
            <div>
              <button
                onClick={() => toggle('genero')}
                className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-700 hover:text-gray-900"
              >
                <span>Género</span>
                <span className="text-sm">{collapsed.genero ? '−' : '+'}</span>
              </button>
              {collapsed.genero && (
                <div className="mt-3 space-y-2">
                  {categories.map((category) => (
                    <label key={category.category_id} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(category.category_name)}
                        onChange={() => onGenreChange(category.category_name)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>{category.category_name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Filtro de Idioma */}
            <div>
              <button
                onClick={() => toggle('idioma')}
                className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-700 hover:text-gray-900"
              >
                <span>Idioma</span>
                <span className="text-sm">{collapsed.idioma ? '−' : '+'}</span>
              </button>
              {collapsed.idioma && (
                <div className="mt-3 space-y-2">
                  {Object.values(languageMap).map((language) => (
                    <label key={language} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(language)}
                        onChange={() => onLanguageChange(language)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>{language}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Filtro de Estado */}
            <div>
              <button
                onClick={() => toggle('estado')}
                className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-700 hover:text-gray-900"
              >
                <span>Estado</span>
                <span className="text-sm">{collapsed.estado ? '−' : '+'}</span>
              </button>
              {collapsed.estado && (
                <div className="mt-3 space-y-2">
                  {conditions.map((condition) => (
                    <label key={condition} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(condition)}
                        onChange={() => onConditionChange(condition)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>{condition}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Filtro de Precio */}
            <div>
              <button
                onClick={() => toggle('precio')}
                className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-700 hover:text-gray-900"
              >
                <span>Precio</span>
                <span className="text-sm">{collapsed.precio ? '−' : '+'}</span>
              </button>
              {collapsed.precio && (
                <div className="mt-3 space-y-3">
                  <input
                    type="number"
                    placeholder="Precio mínimo"
                    value={priceRange.min}
                    onChange={(e) => onPriceChange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Precio máximo"
                    value={priceRange.max}
                    onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PANEL DE FILTROS DESKTOP - Siempre visible en pantallas grandes */}
      <aside className="hidden lg:block w-64 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-300">
          Filtros
        </h2>

        <div className="space-y-6">
          {/* Filtro de Género */}
          <div>
            <button
              onClick={() => toggle('genero')}
              className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-700 hover:text-gray-900"
            >
              <span>Género</span>
              <span className="text-sm">{collapsed.genero ? '−' : '+'}</span>
            </button>
            {collapsed.genero && (
              <div className="mt-3 space-y-2">
                {categories.map((category) => (
                  <label key={category.category_id} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(category.category_name)}
                      onChange={() => onGenreChange(category.category_name)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>{category.category_name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Filtro de Idioma */}
          <div>
            <button
              onClick={() => toggle('idioma')}
              className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-700 hover:text-gray-900"
            >
              <span>Idioma</span>
              <span className="text-sm">{collapsed.idioma ? '−' : '+'}</span>
            </button>
            {collapsed.idioma && (
              <div className="mt-3 space-y-2">
                {Object.values(languageMap).map((language) => (
                  <label key={language} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(language)}
                      onChange={() => onLanguageChange(language)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>{language}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Filtro de Estado */}
          <div>
            <button
              onClick={() => toggle('estado')}
              className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-700 hover:text-gray-900"
            >
              <span>Estado</span>
              <span className="text-sm">{collapsed.estado ? '−' : '+'}</span>
            </button>
            {collapsed.estado && (
              <div className="mt-3 space-y-2">
                {conditions.map((condition) => (
                  <label key={condition} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedConditions.includes(condition)}
                      onChange={() => onConditionChange(condition)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>{condition}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Filtro de Precio */}
          <div>
            <button
              onClick={() => toggle('precio')}
              className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-700 hover:text-gray-900"
            >
              <span>Precio</span>
              <span className="text-sm">{collapsed.precio ? '−' : '+'}</span>
            </button>
            {collapsed.precio && (
              <div className="mt-3 space-y-3">
                <input
                  type="number"
                  placeholder="Precio mínimo"
                  value={priceRange.min}
                  onChange={(e) => onPriceChange({ ...priceRange, min: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="number"
                  placeholder="Precio máximo"
                  value={priceRange.max}
                  onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default ResponsiveFilters; 