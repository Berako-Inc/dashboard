import { ENV } from './environment';

// Configuración de la API
export const API_CONFIG = {
  BASE_URL: ENV.API_BASE_URL,
  ENDPOINTS: {
    ITEMS: '/items',
  },
  POLLING_INTERVAL: ENV.POLLING_INTERVAL,
  MAX_DATA_POINTS: ENV.MAX_DATA_POINTS,
} as const;

// Tipos de respuesta de la API
export interface ApiResponse<T> {
  items: T[];
  count: number;
}

// Clase de error personalizada para la API
export class ApiError extends Error {
  public status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
} 