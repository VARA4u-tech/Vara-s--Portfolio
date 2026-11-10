import React from 'react';
import { useComic } from '@/context/ThemeContext';
import { playClick, playHover } from '@/hooks/useSoundEffects';

export const ComicToggle: React.FC = () => {
  const { isComic, toggleComic } = useComic();

  const handleToggle = () => {
    playClick();
    toggleComic();
  };

  return (
    <button
      onClick={handleToggle}
      onMouseEnter={playHover}
      className={`p-2 border-2 transition-all duration-300 active:scale-95 rounded-none relative group ${
        isComic
          ? 'border-[#D9D9D9] bg-[#171717] text-[#D9B45B] shadow-[3px_3px_0px_0px_#D9B45B] hover:border-[#D9B45B] hover:shadow-[2px_2px_0px_0px_#B58B32] hover:translate-x-[1px] hover:translate-y-[1px]'
          : 'border-black bg-white hover:bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'
      }`}
      aria-label={
        isComic ? 'Disable Retro Comic Theme' : 'Enable Retro Comic Theme'
      }
      title={
        isComic
          ? 'Retro Comic Press Theme: Active (Click to switch)'
          : 'Retro Comic Press Theme: Inactive (Click to activate)'
      }
    >
      <div className="w-4 h-4 flex items-center justify-center relative">
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 transition-transform duration-300 ${
            isComic ? 'scale-105' : 'opacity-45'
          }`}
          fill="none"
        >
          {/* Comic Geometric Panel & Burst */}
          <polygon
            points="12,1.5 14.8,7.5 21.5,5.5 17.5,11 22.5,15.5 16,16.8 16.5,22.5 12,18 7.5,22.5 8,16.8 1.5,15.5 6.5,11 2.5,5.5 9.2,7.5"
            fill={isComic ? '#D9B45B' : '#888888'}
            stroke={isComic ? '#FFFFFF' : '#171717'}
            strokeWidth="1.2"
            strokeLinejoin="miter"
          />
          <rect
            x="10.2"
            y="10.2"
            width="3.6"
            height="3.6"
            transform="rotate(45 12 12)"
            fill={isComic ? '#B58B32' : '#171717'}
          />
        </svg>

        {/* Clean diagonal slash when inactive */}
        {!isComic && (
          <div className="absolute left-0 top-[7px] w-4 h-0.5 bg-[#888888] -rotate-45" />
        )}
      </div>

      {/* Steady gold corner pip when active (no flashing/ping) */}
      {isComic && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#D9B45B] border border-[#171717]" />
      )}
    </button>
  );
};

export default ComicToggle;
