import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHalloween } from './HalloweenContext';
import { playSpookyBoo } from '@/hooks/useSoundEffects';

interface FloatingGhostProps {
  className?: string;
  size?: number;
  initialX?: number;
  initialY?: number;
  interactive?: boolean;
}

export const FloatingGhost: React.FC<FloatingGhostProps> = ({
  className = '',
  size = 54,
  interactive = true,
}) => {
  const { isHalloween, prefersReducedMotion } = useHalloween();
  const [isSpooked, setIsSpooked] = useState(false);
  const [hasBooed, setHasBooed] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const ghostRef = useRef<HTMLDivElement>(null);

  if (!isHalloween) return null;

  const triggerGhost = (e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    setIsSpooked(true);
    setHasBooed(true);
    setClickCount((c) => c + 1);
    playSpookyBoo();
    setTimeout(() => {
      setIsSpooked(false);
    }, 2400);
  };

  const handleGhostClick = (e: React.MouseEvent) => {
    triggerGhost(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerGhost(e);
    }
  };

  const getBooText = () => {
    if (clickCount % 3 === 1) return 'BOO! 👻';
    if (clickCount % 3 === 2) return 'TRICK OR TREAT! 🎃';
    return 'HAPPY HALLOWEEN! ✨';
  };

  return (
    <motion.div
      ref={ghostRef}
      className={`relative z-20 select-none ${
        interactive
          ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7518] rounded-full'
          : ''
      } ${className}`}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={
        interactive
          ? 'Spooky Ghost Easter Egg. Click or press Enter to say hello.'
          : undefined
      }
      initial={{ y: 0, rotate: 0 }}
      animate={
        prefersReducedMotion
          ? {}
          : isSpooked
            ? {
                y: [-10, -35, -5, -20, 0],
                rotate: [0, -15, 15, -8, 0],
                scale: [1, 1.25, 1.1, 1],
              }
            : {
                y: [0, -18, -4, -14, 0],
                x: [0, 8, -6, 4, 0],
                rotate: [0, -3, 2, -1, 0],
              }
      }
      transition={{
        duration: isSpooked ? 1.4 : 6,
        repeat: isSpooked ? 0 : Infinity,
        ease: 'easeInOut',
      }}
      onClick={interactive ? handleGhostClick : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      onMouseEnter={() => {
        if (!hasBooed && interactive) {
          triggerGhost();
        }
      }}
      style={{
        cursor: interactive ? 'pointer' : 'default',
        filter:
          'drop-shadow(0 6px 14px rgba(255, 117, 24, 0.25)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.4))',
      }}
      title={interactive ? 'Click to say hello to the ghost!' : undefined}
    >
      {/* Ghost Speech Bubble Easter Egg */}
      <AnimatePresence>
        {isSpooked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: -30 }}
            exit={{ opacity: 0, scale: 0.7, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-[#FF7518] border-2 border-[#FF7518] px-3 py-1 font-mono text-[10px] font-bold tracking-widest uppercase shadow-[3px_3px_0px_0px_#FF7518] pointer-events-none z-30"
          >
            {getBooText()}
            <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2 h-2 bg-black border-r-2 border-b-2 border-[#FF7518] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ghost SVG */}
      <svg
        width={size}
        height={size * 1.2}
        viewBox="0 0 64 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300"
      >
        {/* Ghost Body */}
        <path
          d="M 32 4
             C 16 4, 8 16, 8 32
             C 8 46, 6 56, 10 68
             C 12 73, 17 67, 20 68
             C 24 69, 27 74, 32 72
             C 37 70, 40 68, 44 71
             C 48 73, 52 72, 54 67
             C 58 56, 56 46, 56 32
             C 56 16, 48 4, 32 4 Z"
          fill="#FAFAFA"
          stroke="#0B0B0B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Ghost Little Arms */}
        {isSpooked ? (
          // Spooked / Raised arms
          <>
            <path
              d="M 12 36 C 4 30, 2 24, 6 22 C 10 20, 14 26, 16 32"
              fill="#FAFAFA"
              stroke="#0B0B0B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 52 36 C 60 30, 62 24, 58 22 C 54 20, 50 26, 48 32"
              fill="#FAFAFA"
              stroke="#0B0B0B"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        ) : (
          // Relaxed floating arms
          <>
            <path
              d="M 12 36 C 6 39, 6 45, 10 47 C 14 49, 15 44, 15 39"
              fill="#FAFAFA"
              stroke="#0B0B0B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 52 36 C 58 39, 58 45, 54 47 C 50 49, 49 44, 49 39"
              fill="#FAFAFA"
              stroke="#0B0B0B"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Eyes */}
        {isSpooked ? (
          // Wide surprised eyes
          <>
            <circle cx="24" cy="27" r="4.5" fill="#0B0B0B" />
            <circle cx="40" cy="27" r="4.5" fill="#0B0B0B" />
            <circle cx="22.5" cy="25.5" r="1.5" fill="#FFFFFF" />
            <circle cx="38.5" cy="25.5" r="1.5" fill="#FFFFFF" />
            {/* Open mouth */}
            <ellipse cx="32" cy="38" rx="4" ry="6" fill="#0B0B0B" />
            {/* Cute rosy cheeks */}
            <circle cx="17" cy="33" r="3" fill="#FF7518" opacity="0.6" />
            <circle cx="47" cy="33" r="3" fill="#FF7518" opacity="0.6" />
          </>
        ) : (
          // Cheerful friendly eyes
          <>
            <ellipse cx="25" cy="28" rx="3" ry="4.5" fill="#0B0B0B" />
            <ellipse cx="39" cy="28" rx="3" ry="4.5" fill="#0B0B0B" />
            <circle cx="24" cy="26.5" r="1.2" fill="#FFFFFF" />
            <circle cx="38" cy="26.5" r="1.2" fill="#FFFFFF" />
            {/* Subtle smile */}
            <path
              d="M 28 36 Q 32 40, 36 36"
              stroke="#0B0B0B"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Subtle cheeks */}
            <circle cx="19" cy="33" r="2.5" fill="#FF7518" opacity="0.35" />
            <circle cx="45" cy="33" r="2.5" fill="#FF7518" opacity="0.35" />
          </>
        )}
      </svg>
    </motion.div>
  );
};

export default FloatingGhost;
