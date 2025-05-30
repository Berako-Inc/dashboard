export interface SensorData {
  id: string;
  timestamp: string;
  ttl: number;
  name: string;
  location: string;
  temperature: number;
  humidity: number;
  pm1_0: number;
  pm2_5: number;
  pm10: number;
  device_type: string;
  status: string;
  [key: string]: any; // Para campos personalizados adicionales
}

export interface ChartDataPoint {
  x: string;
  y: number;
} 