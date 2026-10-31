import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHalloween } from './HalloweenContext';

interface SpiderWebProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  size?: number;
  withSpider?: boolean;
}

export const SpiderWeb: React.FC<SpiderWebProps> = ({
  position = 'top-left',
  className = '',
  size = 130,
  withSpider = false,
}) => {
  const { isHalloween, prefersReducedMotion } = useHalloween();
  const [spiderHovered, setSpiderHovered] = useState(false);

  if (!isHalloween) return null;

  // Determine rotation / transform based on corner position
  const getTransform = () => {
    switch (position) {
      case 'top-right':
        return 'scaleX(-1)';
      case 'bottom-left':
        return 'scaleY(-1)';
      case 'bottom-right':
        return 'scale(-1, -1)';
      default:
        return 'none';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-0 right-0 origin-top-right';
      case 'bottom-left':
        return 'bottom-0 left-0 origin-bottom-left';
      case 'bottom-right':
        return 'bottom-0 right-0 origin-bottom-right';
      default:
        return 'top-0 left-0 origin-top-left';
    }
  };

  return (
    <div
      className={`absolute z-20 pointer-events-none select-none ${getPositionClasses()} ${className}`}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: getTransform() }}
        className="opacity-35 transition-opacity duration-500 hover:opacity-60 text-foreground"
      >
        {/* Radial anchor threads */}
        <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="0" y1="0" x2="95" y2="28" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="0" y1="0" x2="82" y2="55" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="0" y1="0" x2="58" y2="80" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="0" y1="0" x2="28" y2="95" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="0" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />

        {/* Concentric spiral / catenary arcs */}
        {/* Arc 1 (Inner) */}
        <path
          d="M 22 0 Q 21 6 18 10 Q 15 15 10 18 Q 6 21 0 22"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
        {/* Arc 2 */}
        <path
          d="M 42 0 Q 39 12 34 20 Q 27 29 19 35 Q 11 40 0 42"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
        {/* Arc 3 */}
        <path
          d="M 64 0 Q 59 18 52 30 Q 41 44 29 53 Q 17 60 0 64"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
        {/* Arc 4 */}
        <path
          d="M 85 0 Q 78 24 69 41 Q 54 59 38 72 Q 22 81 0 85"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
        {/* Arc 5 (Outer perimeter) */}
        <path
          d="M 100 0 Q 94 28 82 55 Q 63 76 45 88 Q 25 96 0 100"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeDasharray="2 1"
        />
      </svg>

      {/* Optional Hanging Spider */}
      {withSpider && (
        <motion.div
          className="absolute pointer-events-auto cursor-pointer"
          style={{
            left: position.includes('right') ? 'auto' : `${size * 0.45}px`,
            right: position.includes('right') ? `${size * 0.45}px` : 'auto',
            top: 0,
          }}
          initial={{ y: 0 }}
          animate={{
            y: spiderHovered ? 45 : prefersReducedMotion ? 10 : [8, 22, 10],
          }}
          transition={{
            y: spiderHovered
              ? { type: 'spring', stiffness: 300, damping: 10 }
              : { duration: 5, repeat: Infinity, ease: 'easeInOut' },
          }}
          onMouseEnter={() => setSpiderHovered(true)}
          onMouseLeave={() => setSpiderHovered(false)}
          title="A friendly web-crawler"
        >
          {/* Silk thread */}
          <div
            className="w-[1px] bg-foreground/40 mx-auto transition-all"
            style={{ height: spiderHovered ? '45px' : '22px' }}
          />

          {/* Spider SVG */}
          <div className="w-5 h-5 text-foreground relative -mt-0.5 hover:text-[#FF7518] transition-colors duration-200">
            <svg viewBox="0 0 24 24" fill="currentColor">
              {/* Spider body & abdomen */}
              <ellipse cx="12" cy="11" rx="2.5" ry="3.5" />
              <circle cx="12" cy="6" r="2" />
              {/* Glowing tiny red/orange eyes */}
              <circle cx="11.2" cy="5.5" r="0.4" fill="#FF7518" />
              <circle cx="12.8" cy="5.5" r="0.4" fill="#FF7518" />
              {/* Left legs */}
              <path
                d="M 10 9 C 6 6, 4 9, 3 11 M 10 11 C 5 10, 3 13, 2 15 M 10 12 C 6 13, 4 17, 3 19 M 10 13 C 7 16, 6 20, 5 22"
                stroke="currentColor"
                strokeWidth="0.8"
                fill="none"
              />
              {/* Right legs */}
              <path
                d="M 14 9 C 18 6, 20 9, 21 11 M 14 11 C 19 10, 21 13, 22 15 M 14 12 C 18 13, 20 17, 21 19 M 14 13 C 17 16, 18 20, 19 22"
                stroke="currentColor"
                strokeWidth="0.8"
                fill="none"
              />
            </svg>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SpiderWeb;

