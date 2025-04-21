// src/components/StockChart.js
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
  TimeScale, // Import TimeScale for time-based axes
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Import adapter for time scale

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale // Register TimeScale
);

const StockChart = ({ symbol }) => {
  const { data: history, error, isLoading } = useQuery({
    // Query key includes the symbol so it refetches when symbol changes
    queryKey: ['stockHistory', symbol],
    queryFn: () => fetchStockHistory(symbol),
    select: (data) => data.data, // Extract array from response
    enabled: !!symbol, // Only run query if symbol is provided
    staleTime: 60 * 1000, // Cache history for 1 minute
    // No refetchInterval here unless explicitly desired
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

  // Prepare data for Chart.js
  const chartData = {
    // Use timestamps directly for x-axis data points
    labels: history.map(point => point.timestamp),
    datasets: [
      {
        label: `${symbol} Price`,
        // Map data correctly for time scale: {x: timestamp, y: price}
        data: history.map(point => ({ x: point.timestamp, y: point.price })),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointRadius: 1, // Smaller points
      },
    ],
  };

  // Configure Chart.js options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to fill container height
    plugins: {
      legend: {
        display: false, // Hide legend for single dataset
      },
      title: {
        display: true,
        text: `Recent Price History for ${symbol}`,
      },
      tooltip: {
         mode: 'index',
         intersect: false,
      },
    },
    scales: {
      x: {
        type: 'time', // Use time scale for x-axis
        time: {
           unit: 'minute', // Adjust time unit based on data frequency (minute, hour, day)
           tooltipFormat: 'PPpp', // Format for tooltips e.g., "Jul 20, 2023, 4:30:00 PM"
           displayFormats: { // How axes labels are displayed
               minute: 'HH:mm' // e.g., 14:30
           }
        },
        title: {
          display: true,
          text: 'Time',
        },
        grid: {
           display: false // Hide x-axis grid lines
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price ($)',
        },
         // Optional: Add padding to y-axis
         // grace: '5%'
      },
    },
     interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
     }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg mt-6 p-4" style={{ height: '400px' }}> {/* Give chart container a height */}
      <Line options={chartOptions} data={chartData} />
    </div>
  );
};

export default StockChart;