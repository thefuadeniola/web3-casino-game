
import React, { useState, useEffect, useRef } from 'react';
import { CoinProps } from '../types';

const Coin: React.FC<CoinProps> = ({ value, isFlipping, onAnimationComplete }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isFlipping) {
      intervalRef.current = window.setInterval(() => {
        setDisplayValue(Math.random() > 0.5 ? 1 : 2);
      }, 100) as unknown as number;

      const timer = setTimeout(() => {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDisplayValue(value);
        if (onAnimationComplete) onAnimationComplete();
      }, 1000);

      return () => {
        clearTimeout(timer);
        if (intervalRef.current !== null) clearInterval(intervalRef.current);
      };
    } else {
      setDisplayValue(value);
    }
  }, [isFlipping, value, onAnimationComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`w-32 h-32 rounded-full border-4 border-[#b2fa63] bg-zinc-900 flex items-center justify-center shadow-[0_0_30px_rgba(178,250,99,0.3)] transition-all duration-300 ${isFlipping ? 'animate-coin-flip' : ''}`}>
        <span className="text-[#b2fa63] font-black text-3xl">
          {displayValue === 1 ? 'H' : 'T'}
        </span>
      </div>
      <div className="mt-4 h-6 text-[#b2fa63] font-medium tracking-widest uppercase text-xs opacity-70">
        {isFlipping ? "Flipping..." : displayValue === 1 ? "Heads" : "Tails"}
      </div>
    </div>
  );
};

export default Coin;
