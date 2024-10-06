import React from 'react';
import { Trophy, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard: React.FC = () => {
  // Placeholder data for the leaderboard
  const leaderboard = [
    { rank: 1, name: 'Alice', portfolio_value: 50000 },
    { rank: 2, name: 'Bob', portfolio_value: 45000 },
    { rank: 3, name: 'Charlie', portfolio_value: 40000 },
    { rank: 4, name: 'David', portfolio_value: 35000 },
    { rank: 5, name: 'Eve', portfolio_value: 30000 },
  ];

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Trophy className="mr-2" />
        Leaderboard 🏆
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Portfolio Value</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <motion.tr
                key={player.rank}
                className="border-b border-gray-700 hover:bg-gray-750 transition-colors duration-150"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td className="px-4 py-2">{player.rank}</td>
                <td className="px-4 py-2 flex items-center">
                  <User className="mr-2" size={18} />
                  {player.name}
                </td>
                <td className="px-4 py-2">€{player.portfolio_value.toFixed(2)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Leaderboard;