import { SensorData } from '../types/SensorData';
import { API_CONFIG, ApiResponse, ApiError } from '../config/api';

class SensorService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Obtiene todos los datos de sensores desde la API
   */
  async getSensorData(): Promise<SensorData[]> {
    try {
      const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.ITEMS}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const data: ApiResponse<SensorData> = await response.json();
      
      // Validar que la respuesta tenga la estructura esperada
      if (!data.items || !Array.isArray(data.items)) {
        throw new Error('Formato de respuesta inválido: se esperaba un array de items');
      }

      return data.items;
    } catch (error) {
      console.error('Error al obtener datos de sensores:', error);
      
      if (error instanceof Error) {
        throw new ApiError(error.message);
      }
      
      throw new ApiError('Error desconocido al obtener datos de sensores');
    }
  }

  /**
   * Obtiene un sensor específico por ID
   */
  async getSensorById(id: string): Promise<SensorData | null> {
    try {
      const allSensors = await this.getSensorData();
      return allSensors.find(sensor => sensor.id === id) || null;
    } catch (error) {
      console.error(`Error al obtener sensor con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Valida que los datos del sensor tengan la estructura correcta
   */
  private validateSensorData(data: any): data is SensorData {
    return (
      typeof data === 'object' &&
      typeof data.id === 'string' &&
      typeof data.timestamp === 'string' &&
      typeof data.temperature === 'number' &&
      typeof data.humidity === 'number' &&
      typeof data.pm1_0 === 'number' &&
      typeof data.pm2_5 === 'number' &&
      typeof data.pm10 === 'number' &&
      typeof data.name === 'string' &&
      typeof data.location === 'string' &&
      typeof data.device_type === 'string' &&
      typeof data.status === 'string'
    );
  }
}

// Crear una instancia única del servicio (Singleton)
export const sensorService = new SensorService(); 