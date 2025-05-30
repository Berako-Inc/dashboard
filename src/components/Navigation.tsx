import React from 'react';

interface NavigationProps {
  activeView: 'main' | 'air-quality';
  onViewChange: (view: 'main' | 'air-quality') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => onViewChange('main')}
          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
            activeView === 'main'
              ? 'bg-blue-600 text-white shadow-lg transform scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span>Dashboard Principal</span>
          </div>
        </button>
        
        <button
          onClick={() => onViewChange('air-quality')}
          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
            activeView === 'air-quality'
              ? 'bg-green-600 text-white shadow-lg transform scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
            <span>Calidad del Aire</span>
          </div>
        </button>
      </div>
      
      {/* Indicadores de descripción */}
      <div className="mt-4 text-center">
        {activeView === 'main' ? (
          <p className="text-sm text-gray-600">
            Vista completa con temperatura, humedad y calidad del aire
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Vista especializada en monitoreo de material particulado (PM1.0, PM2.5, PM10)
          </p>
        )}
      </div>
    </div>
  );
};

export default Navigation; 