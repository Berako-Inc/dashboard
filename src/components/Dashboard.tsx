import React from 'react';
import TemperatureChart from './TemperatureChart';
import HumidityChart from './HumidityChart';
import AirQualityChart from './AirQualityChart';
import StatsCard from './StatsCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';
import { useSensorDataSimple } from '../hooks/useSensorDataSimple';

// Iconos SVG simples
const TemperatureIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2 2a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

const HumidityIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 2C5.477 2 2 5.477 2 10s3.477 8 8 8 8-3.477 8-8-3.477-8-8-8zM8 10a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const StatusIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const AirQualityIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
  </svg>
);

const Dashboard: React.FC = () => {
  const { 
    sensorData, 
    latestData, 
    previousData, 
    isLoading, 
    isConnected, 
    error, 
    refetch, 
    clearError 
  } = useSensorDataSimple();

  const calculateTrend = (current: number, previous: number) => {
    if (!previous) return undefined;
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.round(Math.abs(change) * 10) / 10,
      isPositive: change > 0,
    };
  };

  const getAirQualityLevel = (pm2_5: number) => {
    if (pm2_5 <= 12) return 'Buena';
    if (pm2_5 <= 35) return 'Moderada';
    if (pm2_5 <= 55) return 'Insalubre para sensibles';
    return 'Insalubre';
  };

  // Mostrar loading spinner mientras se cargan los datos iniciales
  if (isLoading && sensorData.length === 0) {
    return <LoadingSpinner fullScreen message="Conectando con sensores IoT..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard IoT</h1>
              <p className="text-gray-600 mt-1">Monitoreo de Temperatura, Humedad y Calidad del Aire en Tiempo Real</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
              {isLoading && (
                <div className="ml-2">
                  <LoadingSpinner size="sm" message="" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <ErrorAlert 
            error={error} 
            onRetry={refetch} 
            onDismiss={clearError} 
          />
        )}

        {/* Stats Cards */}
        {latestData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatsCard
              title="Temperatura Actual"
              value={latestData.temperature}
              unit="°C"
              icon={<TemperatureIcon />}
              color="#ef4444"
              trend={previousData ? calculateTrend(latestData.temperature, previousData.temperature) : undefined}
            />
            <StatsCard
              title="Humedad Actual"
              value={latestData.humidity}
              unit="%"
              icon={<HumidityIcon />}
              color="#06b6d4"
              trend={previousData ? calculateTrend(latestData.humidity, previousData.humidity) : undefined}
            />
            <StatsCard
              title="PM2.5"
              value={latestData.pm2_5}
              unit="μg/m³"
              icon={<AirQualityIcon />}
              color="#f59e0b"
              trend={previousData ? calculateTrend(latestData.pm2_5, previousData.pm2_5) : undefined}
              subtitle={getAirQualityLevel(latestData.pm2_5)}
            />
            <StatsCard
              title="Ubicación"
              value={latestData.location}
              unit=""
              icon={<LocationIcon />}
              color="#8b5cf6"
            />
            <StatsCard
              title="Estado"
              value={latestData.status === 'active' ? 'Activo' : 'Inactivo'}
              unit=""
              icon={<StatusIcon />}
              color="#10b981"
            />
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TemperatureChart data={sensorData} />
          <HumidityChart data={sensorData} />
        </div>

        {/* Air Quality Chart - Full Width */}
        <div className="mb-8">
          <AirQualityChart data={sensorData} />
        </div>

        {/* Device Info */}
        {latestData && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Dispositivo</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Nombre del Sensor</p>
                <p className="text-lg font-semibold text-gray-900">{latestData.name}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">ID del Dispositivo</p>
                <p className="text-lg font-semibold text-gray-900 truncate">{latestData.id}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Tipo de Dispositivo</p>
                <p className="text-lg font-semibold text-gray-900">{latestData.device_type}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">TTL</p>
                <p className="text-lg font-semibold text-gray-900">{latestData.ttl}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Dashboard IoT - Monitoreo en Tiempo Real</p>
          <p>Datos actualizados cada 5 segundos</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 