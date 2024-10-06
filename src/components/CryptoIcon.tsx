import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CryptoIconProps {
  symbol: string;
  className?: string;
}

const CryptoIcon: React.FC<CryptoIconProps> = ({ symbol, className }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError) {
    return (
      <div className={`crypto-icon-placeholder ${className}`}>
        {symbol.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <>
      {!imageLoaded && (
        <div className={`crypto-icon-placeholder ${className}`}>
          {symbol.slice(0, 2).toUpperCase()}
        </div>
      )}
      <motion.img
        src={`https://cryptoicons.org/api/icon/${symbol.toLowerCase()}/25`}
        alt={`${symbol} icon`}
        className={`${className} ${imageLoaded ? '' : 'hidden'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </>
  );
};

export default CryptoIcon;