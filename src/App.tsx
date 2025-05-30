import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import AirQualityDashboard from './components/AirQualityDashboard';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
  const [activeView, setActiveView] = useState<'main' | 'air-quality'>('main');

  return (
    <div className="App">
      <ErrorBoundary>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Navigation 
            activeView={activeView} 
            onViewChange={setActiveView} 
          />
          {activeView === 'main' ? <Dashboard /> : <AirQualityDashboard />}
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default App; 