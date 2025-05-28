import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { validateEnvironment } from './config/environment';

// Validar configuración del entorno
try {
  validateEnvironment();
} catch (error) {
  console.error('Error de configuración:', error);
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 