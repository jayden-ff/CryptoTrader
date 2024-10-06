import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Briefcase, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Portfolio: React.FC = () => {
  const { portfolio, coins } = useGameContext();

  const totalValue = Object.values(portfolio).reduce((sum, coin) => sum + coin.value, 0);

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Briefcase className="mr-2" />
        Your Portfolio 💼
      </h2>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 mb-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-2 flex items-center">
          <TrendingUp className="mr-2" />
          Total Value 💰
        </h3>
        <p className="text-3xl font-bold text-white">€{totalValue.toFixed(2)}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Coin</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Value (EUR)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(portfolio).map(([coinId, { amount, value }]) => {
              const coin = coins.find(c => c.id === coinId);
              return (
                <motion.tr
                  key={coinId}
                  className="border-b border-gray-700 hover:bg-gray-750 transition-colors duration-150"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-4 py-2">{coin?.name || coinId}</td>
                  <td className="px-4 py-2">{amount}</td>
                  <td className="px-4 py-2">€{value.toFixed(2)}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Portfolio;