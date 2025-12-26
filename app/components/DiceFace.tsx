
import React from 'react';

interface DiceFaceProps {
  value: number;
  className?: string;
}

const DiceFace: React.FC<DiceFaceProps> = ({ value, className = "" }) => {
  const dotPositions: Record<number, number[][]> = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [25, 75], [75, 25], [75, 75]],
    5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
    6: [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]],
  };

  const dots = dotPositions[value] || [];

  return (
    <div className={`relative w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-slate-200 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full p-4">
        {dots.map(([cx, cy], idx) => (
          <circle 
            key={idx} 
            cx={cx} 
            cy={cy} 
            r="8" 
            fill="currentColor" 
            className="text-slate-900"
          />
        ))}
      </svg>
    </div>
  );
};

export default DiceFace;
