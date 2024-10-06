import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

interface Portfolio {
  [key: string]: { amount: number; value: number };
}

interface GameContextType {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  portfolio: Portfolio;
  setPortfolio: React.Dispatch<React.SetStateAction<Portfolio>>;
  coins: Coin[];
  setCoins: React.Dispatch<React.SetStateAction<Coin[]>>;
  buyStock: (coinId: string, amount: number) => void;
  sellStock: (coinId: string, amount: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem('balance');
    return savedBalance ? parseFloat(savedBalance) : 10000;
  });
  const [portfolio, setPortfolio] = useState<Portfolio>(() => {
    const savedPortfolio = localStorage.getItem('portfolio');
    return savedPortfolio ? JSON.parse(savedPortfolio) : {};
  });
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    fetchCoins();
  }, []);

  useEffect(() => {
    localStorage.setItem('balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const fetchCoins = async () => {
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
  };

  const buyStock = (coinId: string, amount: number) => {
    const coin = coins.find((c) => c.id === coinId);
    if (coin) {
      const cost = coin.current_price * amount;
      if (balance >= cost) {
        setBalance((prevBalance) => prevBalance - cost);
        setPortfolio((prevPortfolio) => {
          const updatedPortfolio = { ...prevPortfolio };
          if (coinId in updatedPortfolio) {
            updatedPortfolio[coinId].amount += amount;
            updatedPortfolio[coinId].value += cost;
          } else {
            updatedPortfolio[coinId] = { amount, value: cost };
          }
          return updatedPortfolio;
        });
      } else {
        alert('Insufficient balance');
      }
    }
  };

  const sellStock = (coinId: string, amount: number) => {
    const coin = coins.find((c) => c.id === coinId);
    if (coin && portfolio[coinId] && portfolio[coinId].amount >= amount) {
      const value = coin.current_price * amount;
      setBalance((prevBalance) => prevBalance + value);
      setPortfolio((prevPortfolio) => {
        const updatedPortfolio = { ...prevPortfolio };
        updatedPortfolio[coinId].amount -= amount;
        updatedPortfolio[coinId].value -= value;
        if (updatedPortfolio[coinId].amount === 0) {
          delete updatedPortfolio[coinId];
        }
        return updatedPortfolio;
      });
    } else {
      alert('Insufficient stock');
    }
  };

  return (
    <GameContext.Provider value={{ balance, setBalance, portfolio, setPortfolio, coins, setCoins, buyStock, sellStock }}>
      {children}
    </GameContext.Provider>
  );
};