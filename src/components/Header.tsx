import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Briefcase, Award } from 'lucide-react';
import { useGameContext } from '../context/GameContext';

const Header: React.FC = () => {
  const { balance } = useGameContext();

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <TrendingUp size={28} />
          <span className="text-2xl font-bold">CryptoTrader Pro 🚀</span>
        </Link>
        <nav className="flex items-center">
          <ul className="flex space-x-6 mr-6">
            <li>
              <Link to="/trading" className="nav-link flex items-center">
                <TrendingUp size={20} className="mr-1" />
                Trading 📊
              </Link>
            </li>
            <li>
              <Link to="/portfolio" className="nav-link flex items-center">
                <Briefcase size={20} className="mr-1" />
                Portfolio 💼
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className="nav-link flex items-center">
                <Award size={20} className="mr-1" />
                Leaderboard 🏆
              </Link>
            </li>
          </ul>
          <div className="bg-gray-700 px-4 py-2 rounded-full text-lg font-semibold">
            Balance: €{balance.toFixed(2)} 💰
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;