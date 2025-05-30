import React from 'react';
import AirQualityChart from './AirQualityChart';
import StatsCard from './StatsCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';
import { useSensorDataSimple } from '../hooks/useSensorDataSimple';

// Iconos SVG para calidad del aire
const PM1Icon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

const PM25Icon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
  </svg>
);

const PM10Icon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
  </svg>
);

const AirIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
  </svg>
);

const AirQualityDashboard: React.FC = () => {
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

  const getAirQualityLevel = (pm2_5: number, pm10: number) => {
    // Verificar si los sensores están inactivos
    if (pm2_5 === 0 && pm10 === 0) {
      return { level: 'Sensor Inactivo', color: '#6b7280', description: 'Los sensores de material particulado no están enviando datos' };
    }
    
    // Basado en estándares de la OMS y EPA
    if (pm2_5 <= 12 && pm10 <= 50) {
      return { level: 'Buena', color: '#10b981', description: 'Calidad del aire satisfactoria' };
    } else if (pm2_5 <= 35 && pm10 <= 100) {
      return { level: 'Moderada', color: '#f59e0b', description: 'Calidad del aire aceptable' };
    } else if (pm2_5 <= 55 && pm10 <= 150) {
      return { level: 'Insalubre para grupos sensibles', color: '#f97316', description: 'Miembros de grupos sensibles pueden experimentar problemas' };
    } else if (pm2_5 <= 150 && pm10 <= 250) {
      return { level: 'Insalubre', color: '#ef4444', description: 'Todos pueden experimentar problemas' };
    } else {
      return { level: 'Muy Insalubre', color: '#991b1b', description: 'Advertencia de salud: todos pueden experimentar efectos graves' };
    }
  };

  const getHealthRecommendations = (pm2_5: number, pm10: number) => {
    // Si los sensores están inactivos
    if (pm2_5 === 0 && pm10 === 0) {
      return [
        'Verificar conexión y funcionamiento del sensor de calidad del aire',
        'Revisar la calibración del sensor de material particulado', 
        'Contactar al administrador del sistema para diagnóstico',
        'Validar que el sensor esté correctamente instalado'
      ];
    }
    
    if (pm2_5 <= 12 && pm10 <= 50) {
      return [
        'Disfruta de actividades al aire libre',
        'Ideal para ejercicio exterior',
        'Ventila tu hogar normalmente'
      ];
    } else if (pm2_5 <= 35 && pm10 <= 100) {
      return [
        'Actividades al aire libre están bien para la mayoría',
        'Personas sensibles deben considerar reducir ejercicio intenso al aire libre',
        'Cierra ventanas si tienes asma o problemas respiratorios'
      ];
    } else {
      return [
        'Limita el tiempo al aire libre',
        'Evita ejercicio intenso al exterior',
        'Considera usar mascarilla si debes salir',
        'Mantén ventanas cerradas',
        'Usa purificador de aire si es posible'
      ];
    }
  };

  // Mostrar loading spinner mientras se cargan los datos iniciales
  if (isLoading && sensorData.length === 0) {
    return <LoadingSpinner fullScreen message="Conectando con sensores de calidad del aire..." />;
  }

  const airQualityLevel = latestData 
    ? getAirQualityLevel(latestData.pm2_5, latestData.pm10)
    : null;

  const healthRecommendations = latestData 
    ? getHealthRecommendations(latestData.pm2_5, latestData.pm10)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard de Calidad del Aire</h1>
              <p className="text-gray-600 mt-1">Monitoreo de Material Particulado (PM) en Tiempo Real</p>
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

        {/* Overall Air Quality Status */}
        {latestData && airQualityLevel && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Estado General de la Calidad del Aire</h2>
                <p className="text-gray-600 mt-1">{airQualityLevel.description}</p>
              </div>
              <div className="text-right">
                <div 
                  className="inline-flex items-center px-4 py-2 rounded-full text-white font-semibold"
                  style={{ backgroundColor: airQualityLevel.color }}
                >
                  <AirIcon />
                  <span className="ml-2">{airQualityLevel.level}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {latestData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="PM1.0"
              value={latestData.pm1_0}
              unit="μg/m³"
              icon={<PM1Icon />}
              color="#06b6d4"
              trend={previousData ? calculateTrend(latestData.pm1_0, previousData.pm1_0) : undefined}
              subtitle="Partículas ultrafinas"
            />
            <StatsCard
              title="PM2.5"
              value={latestData.pm2_5}
              unit="μg/m³"
              icon={<PM25Icon />}
              color="#f59e0b"
              trend={previousData ? calculateTrend(latestData.pm2_5, previousData.pm2_5) : undefined}
              subtitle="Partículas finas"
            />
            <StatsCard
              title="PM10"
              value={latestData.pm10}
              unit="μg/m³"
              icon={<PM10Icon />}
              color="#ef4444"
              trend={previousData ? calculateTrend(latestData.pm10, previousData.pm10) : undefined}
              subtitle="Partículas gruesas"
            />
          </div>
        )}

        {/* Chart */}
        <div className="mb-8">
          <AirQualityChart data={sensorData} />
        </div>

        {/* Health Recommendations */}
        {healthRecommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {latestData && latestData.pm2_5 === 0 && latestData.pm10 === 0 
                ? 'Recomendaciones de Diagnóstico' 
                : 'Recomendaciones de Salud'
              }
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className={`w-5 h-5 mt-0.5 ${latestData && latestData.pm2_5 === 0 && latestData.pm10 === 0 ? 'text-orange-500' : 'text-blue-500'}`} fill="currentColor" viewBox="0 0 20 20">
                      {latestData && latestData.pm2_5 === 0 && latestData.pm10 === 0 ? (
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      )}
                    </svg>
                  </div>
                  <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estado actual del sensor - cuando los valores son 0 */}
        {latestData && latestData.pm1_0 === 0 && latestData.pm2_5 === 0 && latestData.pm10 === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Estado Actual del Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Datos del API</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>URL:</strong> {window.location.origin}/api/items</p>
                  <p><strong>Última actualización:</strong> {new Date(latestData.timestamp).toLocaleString('es-ES')}</p>
                  <p><strong>Total de registros:</strong> {sensorData.length}</p>
                  <p><strong>Estado conexión:</strong> <span className={isConnected ? 'text-green-600' : 'text-red-600'}>{isConnected ? 'Conectado' : 'Desconectado'}</span></p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Valores Recibidos</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>PM1.0:</strong> {latestData.pm1_0} μg/m³</p>
                  <p><strong>PM2.5:</strong> {latestData.pm2_5} μg/m³</p>
                  <p><strong>PM10:</strong> {latestData.pm10} μg/m³</p>
                  <p><strong>Temperatura:</strong> {latestData.temperature}°C (funcionando)</p>
                  <p><strong>Humedad:</strong> {latestData.humidity}% (funcionando)</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Diagnóstico:</strong> El sensor DHT22 está funcionando correctamente (temperatura y humedad), 
                pero el sensor de material particulado está enviando valores de 0.0. Esto indica que:
              </p>
              <ul className="text-sm text-blue-700 mt-2 list-disc list-inside space-y-1">
                <li>El sensor de PM podría estar desconectado</li>
                <li>Falta calibración o inicialización del sensor</li>
                <li>El código del dispositivo IoT necesita configuración adicional</li>
                <li>Los sensores de PM requieren tiempo de calentamiento</li>
              </ul>
            </div>
          </div>
        )}

        {/* Device Info */}
        {latestData && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sensor</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Nombre del Sensor</p>
                <p className="text-lg font-semibold text-gray-900">{latestData.name}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Ubicación</p>
                <p className="text-lg font-semibold text-gray-900">{latestData.location}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Tipo de Dispositivo</p>
                <p className="text-lg font-semibold text-gray-900">{latestData.device_type}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Estado</p>
                <p className={`text-lg font-semibold ${latestData.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  {latestData.status === 'active' ? 'Activo' : 'Inactivo'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Information Panel */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">¿Qué es el Material Particulado?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">PM1.0</h4>
              <p>Partículas con diámetro menor a 1.0 micrómetros. Son las más pequeñas y pueden penetrar profundamente en los pulmones y el torrente sanguíneo.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">PM2.5</h4>
              <p>Partículas con diámetro menor a 2.5 micrómetros. También conocidas como partículas finas, pueden llegar a los alvéolos pulmonares.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">PM10</h4>
              <p>Partículas con diámetro menor a 10 micrómetros. Son partículas gruesas que pueden llegar a las vías respiratorias superiores.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Dashboard de Calidad del Aire - Monitoreo en Tiempo Real</p>
          <p>Datos actualizados cada 5 segundos | Estándares basados en OMS y EPA</p>
        </div>
      </div>
    </div>
  );
};

export default AirQualityDashboard; 