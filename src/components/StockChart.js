import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStockHistory } from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const StockChart = ({ symbol }) => {
  const { data: history, error, isLoading } = useQuery({
    queryKey: ['stockHistory', symbol], // Refetches when symbol changes
    queryFn: () => fetchStockHistory(symbol),
    select: (data) => data.data,
    enabled: !!symbol, // Only run query if symbol is provided
    staleTime: 60 * 1000,
  });

  if (!symbol) {
    return <div className="p-4 text-center text-gray-500">Select a stock from the table above to view its recent price history.</div>;
  }

  if (isLoading) {
    return <div className="text-center p-4">Loading history for {symbol}...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error loading history for {symbol}: {error.message}</div>;
  }

  if (!history || history.length === 0) {
    return <div className="text-center p-4 text-gray-500">No historical data available for {symbol}.</div>;
  }

  const chartData = {
    datasets: [
      {
        label: `${symbol} Price`,
        data: history.map(point => ({ x: point.timestamp, y: point.price })), // Format for time scale
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointRadius: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows height control via container
    plugins: {
      legend: { display: false },
      title: { display: true, text: `Recent Price History for ${symbol}` },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: {
        type: 'time', // Use time scale for x-axis
        time: {
           displayFormats: { minute: 'HH:mm' },
           tooltipFormat: 'PPpp',
           unit: 'minute',
        },
        title: { display: true, text: 'Time' },
        grid: { display: false }
      },
      y: {
        title: { display: true, text: 'Price ($)' },
      },
    },
     interaction: { mode: 'nearest', axis: 'x', intersect: false }
  };

  return (
    // Container requires a defined height for maintainAspectRatio: false
    <div className="bg-white shadow sm:rounded-lg mt-6 p-4" style={{ height: '400px' }}>
      <Line options={chartOptions} data={chartData} />
    </div>
  );
};

export default StockChart;