import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <motion.h1 
        className="text-5xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to CryptoTrader Pro 🚀💹
      </motion.h1>
      <motion.p 
        className="text-2xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Start your journey in cryptocurrency trading without risking real money! 🎉
      </motion.p>
      <motion.div
        className="flex justify-center space-x-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Link to="/trading" className="btn btn-primary text-xl px-8 py-3">
          Start Trading 📈
        </Link>
        <Link to="/portfolio" className="btn btn-success text-xl px-8 py-3">
          View Portfolio 💼
        </Link>
      </motion.div>
      <motion.div 
        className="mt-16 bg-gray-800 p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-4">Why CryptoTrader Pro? 🤔</h2>
        <ul className="text-left text-xl space-y-4">
          <li>✅ Real-time cryptocurrency data</li>
          <li>✅ Risk-free trading simulation</li>
          <li>✅ Interactive charts and analytics</li>
          <li>✅ Track your portfolio performance</li>
          <li>✅ Compete on the leaderboard</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default Home;