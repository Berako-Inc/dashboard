import { useState, useEffect, useRef } from 'react';
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
  refetch: () => void;
  clearError: () => void;
}

export const useSensorDataSimple = (): UseSensorDataReturn => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Función para refetch manual
  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  // Función para limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Efecto principal para obtener datos
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setError(null);
        const data = await sensorService.getSensorData();
        
        if (isMounted) {
          setSensorData(prevData => {
            const combinedData = [...prevData];
            
            data.forEach(newItem => {
              const existingIndex = combinedData.findIndex(item => item.id === newItem.id);
              if (existingIndex >= 0) {
                combinedData[existingIndex] = newItem;
              } else {
                combinedData.push(newItem);
              }
            });
            
            return combinedData
              .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
              .slice(-API_CONFIG.MAX_DATA_POINTS);
          });
          
          setIsConnected(true);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof ApiError 
            ? err.message 
            : 'Error al conectar con el servidor';
          
          setError(errorMessage);
          setIsConnected(false);
          setIsLoading(false);
          
          console.error('Error al obtener datos de sensores:', err);
        }
      }
    };

    // Fetch inicial
    fetchData();

    // Configurar intervalo
    intervalRef.current = setInterval(fetchData, API_CONFIG.POLLING_INTERVAL);

    // Cleanup
    return () => {
      isMounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetchTrigger]); // Solo depende del trigger de refetch

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