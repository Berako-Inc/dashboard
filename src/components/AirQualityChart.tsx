import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { SensorData } from '../types/SensorData';

interface AirQualityChartProps {
  data: SensorData[];
}

// Niveles de referencia de la OMS para PM2.5 y PM10
const WHO_LIMITS = {
  PM2_5: 15, // μg/m³ (promedio anual)
  PM10: 45   // μg/m³ (promedio anual)
};

const AirQualityChart: React.FC<AirQualityChartProps> = ({ data }) => {
  const formatDataForChart = () => {
    return data.slice(-20).map((item, index) => ({
      time: new Date(item.timestamp).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      pm1_0: Math.round(item.pm1_0 * 10) / 10,
      pm2_5: Math.round(item.pm2_5 * 10) / 10,
      pm10: Math.round(item.pm10 * 10) / 10,
      timestamp: item.timestamp
    }));
  };

  const chartData = formatDataForChart();

  // Verificar si todos los valores de PM son 0
  const allPMValuesZero = data.length > 0 && data.every(item => 
    item.pm1_0 === 0 && item.pm2_5 === 0 && item.pm10 === 0
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm font-medium">{`Hora: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-semibold">
              {entry.name}: {entry.value} μg/m³
            </p>
          ))}
          <div className="mt-2 text-xs text-gray-500">
            <p>Límites OMS:</p>
            <p>PM2.5: {WHO_LIMITS.PM2_5} μg/m³</p>
            <p>PM10: {WHO_LIMITS.PM10} μg/m³</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getAirQualityStatus = (pm2_5: number, pm10: number) => {
    if (pm2_5 === 0 && pm10 === 0) {
      return { status: 'Sensor Inactivo', color: 'text-gray-600', bgColor: 'bg-gray-50' };
    } else if (pm2_5 <= WHO_LIMITS.PM2_5 && pm10 <= WHO_LIMITS.PM10) {
      return { status: 'Buena', color: 'text-green-600', bgColor: 'bg-green-50' };
    } else if (pm2_5 <= WHO_LIMITS.PM2_5 * 2 && pm10 <= WHO_LIMITS.PM10 * 2) {
      return { status: 'Moderada', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    } else {
      return { status: 'Mala', color: 'text-red-600', bgColor: 'bg-red-50' };
    }
  };

  const latestData = data[data.length - 1];
  const airQualityStatus = latestData 
    ? getAirQualityStatus(latestData.pm2_5, latestData.pm10)
    : null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Calidad del Aire</h3>
          <p className="text-sm text-gray-600">Material Particulado (μg/m³)</p>
        </div>
        {airQualityStatus && (
          <div className={`px-3 py-1 rounded-full ${airQualityStatus.bgColor}`}>
            <span className={`text-sm font-medium ${airQualityStatus.color}`}>
              {airQualityStatus.status}
            </span>
          </div>
        )}
      </div>

      {/* Alerta cuando todos los valores son 0 */}
      {allPMValuesZero && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-orange-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-orange-800">Sensor de Calidad del Aire Inactivo</h4>
              <p className="text-sm text-orange-700 mt-1">
                Todos los valores de material particulado (PM1.0, PM2.5, PM10) están en 0.0 μg/m³. 
                Esto indica que el sensor de calidad del aire no está funcionando o no está calibrado correctamente.
              </p>
              <div className="mt-2 text-xs text-orange-600">
                <p><strong>Posibles causas:</strong></p>
                <ul className="list-disc list-inside mt-1">
                  <li>Sensor de material particulado desconectado o dañado</li>
                  <li>Falta de calibración del sensor</li>
                  <li>Error en el código del dispositivo IoT</li>
                  <li>Sensor aún no inicializado</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>No hay datos de calidad del aire disponibles</p>
          </div>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
                tickMargin={10}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickMargin={10}
                label={{ value: 'μg/m³', angle: -90, position: 'insideLeft' }}
                domain={[0, 'dataMax + 5']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Líneas de referencia para límites OMS - solo si hay valores no cero */}
              {!allPMValuesZero && (
                <>
                  <ReferenceLine 
                    y={WHO_LIMITS.PM2_5} 
                    stroke="#f59e0b" 
                    strokeDasharray="5 5" 
                    label={{ value: "Límite PM2.5 OMS", position: "insideTopRight" }}
                  />
                  <ReferenceLine 
                    y={WHO_LIMITS.PM10} 
                    stroke="#ef4444" 
                    strokeDasharray="5 5" 
                    label={{ value: "Límite PM10 OMS", position: "insideTopRight" }}
                  />
                </>
              )}
              
              <Line
                type="monotone"
                dataKey="pm1_0"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2 }}
                name="PM1.0"
              />
              <Line
                type="monotone"
                dataKey="pm2_5"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                name="PM2.5"
              />
              <Line
                type="monotone"
                dataKey="pm10"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                name="PM10"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-4 text-xs text-gray-500 border-t pt-4">
        <p><strong>Límites de referencia OMS:</strong></p>
        <p>• PM2.5: {WHO_LIMITS.PM2_5} μg/m³ (promedio anual)</p>
        <p>• PM10: {WHO_LIMITS.PM10} μg/m³ (promedio anual)</p>
        <p className="mt-2">Las partículas PM1.0, PM2.5 y PM10 representan partículas con diámetros menores a 1.0, 2.5 y 10 micrómetros respectivamente.</p>
        {allPMValuesZero && (
          <p className="mt-2 text-orange-600"><strong>Nota:</strong> Los datos mostrados reflejan exactamente lo que envía el sensor IoT.</p>
        )}
      </div>
    </div>
  );
};

export default AirQualityChart; 