import React from 'react';
import { useHalloween } from './HalloweenContext';
import { playClick, playHover } from '@/hooks/useSoundEffects';

export const HalloweenToggle: React.FC = () => {
  const { isHalloween, toggleHalloween } = useHalloween();

  const handleToggle = () => {
    playClick();
    toggleHalloween();
  };

  return (
    <button
      onClick={handleToggle}
      onMouseEnter={playHover}
      className={`p-2 border-2 border-black bg-white hover:bg-black transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 rounded-none relative group`}
      aria-label={
        isHalloween ? 'Disable Halloween Spirit' : 'Enable Halloween Spirit'
      }
      title={
        isHalloween
          ? 'Halloween Mode: Active (Click to toggle off)'
          : 'Halloween Mode: Inactive (Click to activate)'
      }
    >
      <div className="w-4 h-4 flex items-center justify-center relative">
        {/* Pumpkin Icon */}
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 transition-transform duration-300 ${
            isHalloween ? 'scale-105' : 'opacity-40 grayscale'
          }`}
          fill="none"
        >
          {/* Stem */}
          <path
            d="M11 2 C11 0 13 0 14 3"
            stroke={isHalloween ? '#22C55E' : '#666'}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Pumpkin Body */}
          <ellipse
            cx="12"
            cy="14"
            rx="9"
            ry="7.5"
            fill={isHalloween ? '#FF7518' : '#888'}
            stroke="#000"
            strokeWidth="1.2"
          />
          {/* Carved Eyes */}
          <polygon
            points="8,12 10,10 10,13"
            fill={isHalloween ? '#FFF' : '#333'}
          />
          <polygon
            points="16,12 14,10 14,13"
            fill={isHalloween ? '#FFF' : '#333'}
          />
          {/* Carved Smile */}
          <path
            d="M7 16 Q12 19 17 16"
            stroke={isHalloween ? '#FFF' : '#333'}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Diagonal slash when disabled */}
        {!isHalloween && (
          <div className="absolute left-[0px] top-[7px] w-4 h-0.5 bg-red-500 -rotate-45" />
        )}
      </div>

      {/* Mini notification dot for seasonal discovery */}
      {isHalloween && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF7518] rounded-full animate-ping" />
      )}
    </button>
  );
};

export default HalloweenToggle;
