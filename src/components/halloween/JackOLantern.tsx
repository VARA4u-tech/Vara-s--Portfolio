import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHalloween } from './HalloweenContext';
import { playPumpkinGlow } from '@/hooks/useSoundEffects';

interface JackOLanternProps {
  className?: string;
  size?: number;
  interactive?: boolean;
}

export const JackOLantern: React.FC<JackOLanternProps> = ({
  className = '',
  size = 48,
  interactive = true,
}) => {
  const { isHalloween, prefersReducedMotion } = useHalloween();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  if (!isHalloween) return null;

  const triggerGlow = (e?: React.SyntheticEvent) => {
    if (!interactive) return;
    if (e) e.stopPropagation();
    setIsClicked(true);
    playPumpkinGlow();
    setTimeout(() => setIsClicked(false), 800);
  };

  const handleClick = (e: React.MouseEvent) => {
    triggerGlow(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerGlow(e);
    }
  };

  return (
    <motion.div
      className={`inline-block select-none relative ${
        interactive
          ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7518] rounded-full'
          : ''
      } ${className}`}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={
        interactive
          ? "Spooky Jack-o'-lantern. Click or press Enter to light up."
          : undefined
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onKeyDown={interactive ? handleKeyDown : undefined}
      animate={
        prefersReducedMotion
          ? {}
          : isClicked
            ? { scale: [1, 1.25, 0.95, 1.05, 1], rotate: [0, -8, 8, -4, 0] }
            : isHovered
              ? { scale: 1.08, y: -3 }
              : { scale: 1, y: 0 }
      }
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        cursor: interactive ? 'pointer' : 'default',
        filter: isHovered
          ? 'drop-shadow(0 0 16px rgba(255, 117, 24, 0.75))'
          : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25))',
      }}
      title={interactive ? "Spooky Jack-o'-lantern (Click me!)" : undefined}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pumpkin Stem */}
        <path
          d="M 33 16 C 33 8, 38 4, 44 3 C 44 6, 41 12, 38 16 Z"
          fill="#3B7A57"
          stroke="#0B0B0B"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Outer Pumpkin Lobes / Back shadow */}
        <ellipse
          cx="23"
          cy="42"
          rx="14"
          ry="19"
          fill="#E65100"
          stroke="#0B0B0B"
          strokeWidth="2.5"
        />
        <ellipse
          cx="49"
          cy="42"
          rx="14"
          ry="19"
          fill="#E65100"
          stroke="#0B0B0B"
          strokeWidth="2.5"
        />

        {/* Mid Lobes */}
        <ellipse
          cx="28"
          cy="43"
          rx="13"
          ry="21"
          fill="#FF7518"
          stroke="#0B0B0B"
          strokeWidth="2.5"
        />
        <ellipse
          cx="44"
          cy="43"
          rx="13"
          ry="21"
          fill="#FF7518"
          stroke="#0B0B0B"
          strokeWidth="2.5"
        />

        {/* Center Main Lobe */}
        <ellipse
          cx="36"
          cy="44"
          rx="13"
          ry="22"
          fill="#FFA000"
          stroke="#0B0B0B"
          strokeWidth="2.5"
        />

        {/* Carved Eyes - Glowing with Candle Fire */}
        <g
          fill={isHovered ? '#FFE082' : '#FFD54F'}
          stroke="#0B0B0B"
          strokeWidth="1.8"
          strokeLinejoin="round"
          className="candle-glow"
        >
          {/* Left Eye */}
          {isClicked ? (
            // Winking left eye
            <path
              d="M 23 37 Q 27 34, 31 37"
              stroke="#0B0B0B"
              strokeWidth="2.5"
              fill="none"
            />
          ) : (
            // Triangular carved eye
            <polygon points="23,39 27,31 31,38" />
          )}

          {/* Right Eye */}
          <polygon points="41,38 45,31 49,39" />

          {/* Nose */}
          <polygon points="36,41 33,46 39,46" />

          {/* Jagged Jack-o'-lantern Mouth */}
          <polygon points="21,52 26,55 29,52 33,56 36,52 39,56 43,52 46,55 51,52 48,60 41,61 36,59 31,61 24,60" />
        </g>
      </svg>
    </motion.div>
  );
};

export default JackOLantern;
