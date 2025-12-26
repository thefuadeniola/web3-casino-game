import React, { useState, useEffect, useRef } from 'react';
import { DiceProps } from '../types';
import DiceFace from './DiceFace'

const Dice: React.FC<DiceProps> = ({ value, isRolling, onAnimationComplete }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRolling) {
      // Start "shuffling" numbers
      intervalRef.current = window.setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 80) as unknown as number;

      // Stop after a set duration and set the deterministic target value
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
  }, [isRolling, value, onAnimationComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`transition-all duration-300 transform ${isRolling ? 'scale-110 animate-dice-shake' : 'scale-100 rotate-0'}`}>
        <DiceFace value={displayValue} />
      </div>
      <div className="mt-4 h-6 text-indigo-300 font-medium tracking-widest uppercase text-sm">
        Determine your fate...
      </div>
    </div>
  );
};

export default Dice;
