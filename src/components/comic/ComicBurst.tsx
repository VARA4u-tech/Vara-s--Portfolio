import React from 'react';
import { playHover, playClick } from '@/hooks/useSoundEffects';

export type ComicBurstColor =
  | 'gold'
  | 'dark-gold'
  | 'white'
  | 'concrete'
  | 'black';

interface ComicBurstProps {
  text: string;
  subtext?: string;
  size?: number;
  color?: ComicBurstColor;
  className?: string;
  rotate?: number;
  interactive?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
}

const FILL_MAP: Record<ComicBurstColor, string> = {
  gold: '#D9B45B',
  'dark-gold': '#B58B32',
  white: '#FFFFFF',
  concrete: '#D9D9D9',
  black: '#171717',
};

const TEXT_MAP: Record<ComicBurstColor, string> = {
  gold: '#171717',
  'dark-gold': '#FFFFFF',
  white: '#171717',
  concrete: '#171717',
  black: '#FFFFFF',
};

const STROKE_MAP: Record<ComicBurstColor, string> = {
  gold: '#171717',
  'dark-gold': '#171717',
  white: '#171717',
  concrete: '#171717',
  black: '#D9B45B',
};

export const ComicBurst: React.FC<ComicBurstProps> = ({
  text,
  subtext,
  size = 64,
  color = 'gold',
  className = '',
  rotate = 0,
  interactive = false,
  onClick,
}) => {
  const burstPoints =
    '50,3 60,21 79,11 75,31 96,36 81,52 94,70 74,73 70,95 52,80 37,93 33,73 13,75 21,54 5,40 25,30 19,12 39,19';

  const handleClick = (e: React.MouseEvent) => {
    if (interactive) {
      playClick();
      onClick?.(e);
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={interactive ? playHover : undefined}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
      }}
      className={`relative inline-flex items-center justify-center select-none ${
        interactive
          ? 'cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95'
          : 'pointer-events-none'
      } ${className}`}
      title={text}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(3px 3px 0px #B58B32)' }}
      >
        <polygon
          points={burstPoints}
          fill={FILL_MAP[color]}
          stroke={STROKE_MAP[color]}
          strokeWidth="3"
          strokeLinejoin="miter"
        />
        <polygon
          points={burstPoints}
          fill="none"
          stroke={color === 'black' ? '#888888' : '#171717'}
          strokeWidth="1"
          strokeOpacity="0.35"
          transform="scale(0.82) translate(10.8, 10.8)"
        />
      </svg>

      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-1"
        style={{ color: TEXT_MAP[color] }}
      >
        <span className="font-mono font-black text-[10px] md:text-xs tracking-tight uppercase leading-none">
          {text}
        </span>
        {subtext && (
          <span className="font-mono text-[7px] font-bold tracking-widest uppercase mt-0.5 opacity-80">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};

export default ComicBurst;
