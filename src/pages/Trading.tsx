import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { useGameContext } from '../context/GameContext';
import StockGraph from '../components/StockGraph';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CryptoIcon from '../components/CryptoIcon';

const Trading: React.FC = () => {
  const { coins, setCoins, buyStock, sellStock, portfolio } = useGameContext();
  const [loading, setLoading] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [buyAnimation, setBuyAnimation] = useState<string | null>(null);
  const [sellAnimation, setSellAnimation] = useState<string | null>(null);

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'eur',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
          sparkline: false,
        },
      });
      setCoins(response.data);
    } catch (error) {
      console.error('Error fetching coins:', error);
    }
    setLoading(false);
  };

  const handleBuy = (coinId: string) => {
    const amount = parseFloat(prompt('Enter the amount to buy:') || '0');
    if (amount > 0) {
      buyStock(coinId, amount);
      setBuyAnimation(coinId);
      setTimeout(() => setBuyAnimation(null), 500);
    }
  };

  const handleSell = (coinId: string) => {
    const coin = coins.find(c => c.id === coinId);
    const ownedAmount = portfolio[coinId]?.amount || 0;
    if (ownedAmount > 0 && coin) {
      const maxSellAmount = ownedAmount * coin.current_price;
      const amount = parseFloat(prompt(`Enter the amount to sell (max €${maxSellAmount.toFixed(2)}):`) || '0');
      if (amount > 0 && amount <= maxSellAmount) {
        sellStock(coinId, amount / coin.current_price);
        setSellAnimation(coinId);
        setTimeout(() => setSellAnimation(null), 500);
      } else if (amount > maxSellAmount) {
        alert("You don't have enough of this currency to sell that amount.");
      }
    } else {
      alert("You don't own any of this currency to sell.");
    }
  };

  const getDecimalPlaces = (price: number) => {
    if (price < 0.01) return 6;
    if (price < 1) return 4;
    return 2;
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-white">Trading 📊</h2>
        <button onClick={fetchCoins} className="btn btn-primary flex items-center">
          <RefreshCw size={18} className="mr-2" />
          Refresh
        </button>
      </div>
      {loading ? (
        <p className="text-xl">Loading... 🔄</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Symbol</th>
                <th className="px-4 py-2 text-left">Price (EUR)</th>
                <th className="px-4 py-2 text-left">24h Change</th>
                <th className="px-4 py-2 text-left">Owned</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => (
                <React.Fragment key={coin.id}>
                  <motion.tr
                    className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-150"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-4 py-2 flex items-center">
                      <CryptoIcon symbol={coin.symbol} className="mr-2" />
                      <span className="cursor-pointer" onClick={() => setSelectedCoin(selectedCoin === coin.id ? null : coin.id)}>
                        {coin.name}
                      </span>
                    </td>
                    <td className="px-4 py-2 uppercase">{coin.symbol}</td>
                    <td className="px-4 py-2">
                      <motion.span
                        key={coin.current_price}
                        initial={{ opacity: 0.5, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        €{coin.current_price.toFixed(getDecimalPlaces(coin.current_price))}
                      </motion.span>
                    </td>
                    <td className="px-4 py-2">
                      <motion.span
                        key={coin.price_change_percentage_24h}
                        initial={{ opacity: 0.5, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-center ${
                          coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {coin.price_change_percentage_24h > 0 ? (
                          <TrendingUp size={16} className="mr-1" />
                        ) : (
                          <TrendingDown size={16} className="mr-1" />
                        )}
                        {coin.price_change_percentage_24h.toFixed(2)}%
                        {coin.price_change_percentage_24h > 0 ? '📈' : '📉'}
                      </motion.span>
                    </td>
                    <td className="px-4 py-2">
                      {portfolio[coin.id] ? portfolio[coin.id].amount.toFixed(4) : '0'}
                    </td>
                    <td className="px-4 py-2">
                      <motion.button
                        onClick={() => handleBuy(coin.id)}
                        className="btn btn-success mr-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={buyAnimation === coin.id ? { scale: [1, 1.2, 1] } : {}}
                      >
                        Buy 💰
                      </motion.button>
                      <motion.button
                        onClick={() => handleSell(coin.id)}
                        className="btn btn-danger"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={sellAnimation === coin.id ? { scale: [1, 1.2, 1] } : {}}
                        disabled={!portfolio[coin.id] || portfolio[coin.id].amount === 0}
                      >
                        Sell 💸
                      </motion.button>
                    </td>
                  </motion.tr>
                  <AnimatePresence>
                    {selectedCoin === coin.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td colSpan={6} className="px-4 py-4">
                          <StockGraph coinId={coin.id} />
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Trading;