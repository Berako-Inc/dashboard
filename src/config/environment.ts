// Configuración de variables de entorno
export const ENV = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://74unkrq7fj.execute-api.us-east-1.amazonaws.com/dev',
  POLLING_INTERVAL: parseInt(process.env.REACT_APP_POLLING_INTERVAL || '5000'),
  MAX_DATA_POINTS: parseInt(process.env.REACT_APP_MAX_DATA_POINTS || '20'),
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Validar configuración
export const validateEnvironment = (): void => {
  if (!ENV.API_BASE_URL) {
    throw new Error('REACT_APP_API_BASE_URL es requerida');
  }

  if (ENV.POLLING_INTERVAL < 1000) {
    console.warn('REACT_APP_POLLING_INTERVAL es muy bajo, se recomienda al menos 1000ms');
  }

  if (ENV.MAX_DATA_POINTS < 5) {
    console.warn('REACT_APP_MAX_DATA_POINTS es muy bajo, se recomienda al menos 5 puntos');
  }
}; 