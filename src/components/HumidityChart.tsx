import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { SensorData } from '../types/SensorData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HumidityChartProps {
  data: SensorData[];
}

const HumidityChart: React.FC<HumidityChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => format(new Date(item.timestamp), 'HH:mm', { locale: es })),
    datasets: [
      {
        label: 'Humedad (%)',
        data: data.map(item => item.humidity),
        borderColor: 'rgb(6, 182, 212)',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(6, 182, 212)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: 'bold' as const,
          },
          color: '#374151',
        },
      },
      title: {
        display: true,
        text: 'Humedad en Tiempo Real',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
        color: '#1f2937',
        padding: 20,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(6, 182, 212)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `Humedad: ${context.parsed.y}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
          callback: function(value: any) {
            return value + '%';
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>Última actualización: {data.length > 0 ? format(new Date(data[data.length - 1].timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: es }) : 'Sin datos'}</span>
        <span className="flex items-center">
          <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
          Humedad
        </span>
      </div>
    </div>
  );
};

export default HumidityChart; 