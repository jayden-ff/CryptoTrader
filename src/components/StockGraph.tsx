import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface StockGraphProps {
  coinId: string;
}

const StockGraph: React.FC<StockGraphProps> = ({ coinId }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<string>('7');

  useEffect(() => {
    fetchChartData(timeRange);
  }, [coinId, timeRange]);

  const fetchChartData = async (days: string) => {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: 'eur',
          days: days,
        },
      });
      const prices = response.data.prices;

      const data = {
        labels: prices.map((price: number[]) => {
          const date = new Date(price[0]);
          return days === '1' ? date.toLocaleTimeString() : date.toLocaleDateString();
        }),
        datasets: [
          {
            label: 'Price (EUR)',
            data: prices.map((price: number[]) => price[1]),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      };

      setChartData(data);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  if (!chartData) {
    return <div>Loading chart...</div>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex justify-end mb-4">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-700 text-white px-2 py-1 rounded"
        >
          <option value="1">1 Hour</option>
          <option value="7">7 Days</option>
          <option value="30">1 Month</option>
          <option value="365">1 Year</option>
        </select>
      </div>
      <div style={{ height: '300px' }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
              },
              y: {
                ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
              },
            },
            plugins: {
              legend: { labels: { color: 'rgba(255, 255, 255, 0.7)' } },
              tooltip: {
                mode: 'index',
                intersect: false,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default StockGraph;