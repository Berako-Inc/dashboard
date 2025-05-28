export interface SensorData {
  id: string;
  timestamp: string;
  ttl: number;
  name: string;
  location: string;
  temperature: number;
  humidity: number;
  status: string;
  [key: string]: any; // Para campos personalizados adicionales
}

export interface ChartDataPoint {
  x: string;
  y: number;
} 