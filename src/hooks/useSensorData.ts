import { useState, useEffect, useCallback, useRef } from 'react';
import { SensorData } from '../types/SensorData';
import { sensorService } from '../services/sensorService';
import { API_CONFIG, ApiError } from '../config/api';

interface UseSensorDataReturn {
  sensorData: SensorData[];
  latestData: SensorData | null;
  previousData: SensorData | null;
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useSensorData = (): UseSensorDataReturn => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Usar useRef para mantener la referencia del intervalo
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Función para obtener datos de la API
  const fetchSensorData = useCallback(async () => {
    try {
      setError(null);
      const data = await sensorService.getSensorData();
      
      // Solo actualizar el estado si el componente sigue montado
      if (mountedRef.current) {
        setSensorData(prevData => {
          // Combinar datos nuevos con los existentes, evitando duplicados
          const combinedData = [...prevData];
          
          data.forEach(newItem => {
            const existingIndex = combinedData.findIndex(item => item.id === newItem.id);
            if (existingIndex >= 0) {
              // Actualizar item existente
              combinedData[existingIndex] = newItem;
            } else {
              // Agregar nuevo item
              combinedData.push(newItem);
            }
          });
          
                     // Ordenar por timestamp y mantener solo los últimos puntos configurados
           return combinedData
             .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
             .slice(-API_CONFIG.MAX_DATA_POINTS);
        });
        
        setIsConnected(true);
        setIsLoading(false);
      }
    } catch (err) {
      if (mountedRef.current) {
        const errorMessage = err instanceof ApiError 
          ? err.message 
          : 'Error al conectar con el servidor';
        
        setError(errorMessage);
        setIsConnected(false);
        setIsLoading(false);
        
        console.error('Error al obtener datos de sensores:', err);
      }
    }
  }, []);

  // Función para refetch manual
  const refetch = useCallback(async () => {
    setIsLoading(true);
    await fetchSensorData();
  }, [fetchSensorData]);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Configurar polling automático
  useEffect(() => {
    // Fetch inicial
    fetchSensorData();

    // Configurar intervalo para polling
    intervalRef.current = setInterval(() => {
      fetchSensorData();
    }, API_CONFIG.POLLING_INTERVAL);

    // Cleanup function
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Dependencias vacías para ejecutar solo una vez

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Calcular datos derivados
  const latestData = sensorData.length > 0 ? sensorData[sensorData.length - 1] : null;
  const previousData = sensorData.length > 1 ? sensorData[sensorData.length - 2] : null;

  return {
    sensorData,
    latestData,
    previousData,
    isLoading,
    isConnected,
    error,
    refetch,
    clearError,
  };
}; 