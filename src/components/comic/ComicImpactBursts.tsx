import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useComic } from '@/context/ThemeContext';

interface ImpactBurstItem {
  id: number;
  x: number;
  y: number;
  word: string;
  rotate: number;
  goldVariant: boolean;
}

const ONOMATOPOEIA_WORDS = [
  'POW!',
  'ZAP!',
  'BAM!',
  'THWIP!',
  'SNAP!',
  'CLANG!',
  'ZOOM!',
];

const INTERACTIVE_SELECTOR =
  'button, a, [role="button"], .comic-panel-white, .comic-panel-concrete, .comic-panel-dark';

const IGNORED_SELECTOR =
  'input, textarea, select, [role="dialog"], [role="menu"]';

/**
 * Tactile Superhero Onomatopoeia Micro-Bursts on interactive clicks/taps.
 * Strictly capped, throttled, viewport-clamped, and styled in Noir Gold & Ink.
 */
export const ComicImpactBursts: React.FC = () => {
  const { isComic, prefersReducedMotion } = useComic();
  const [bursts, setBursts] = useState<ImpactBurstItem[]>([]);
  const lastBurstRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    if (!isComic || prefersReducedMotion) {
      setBursts([]);
      return;
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Never distract typing inside forms, modals, or dropdown menus
      if (target.closest(IGNORED_SELECTOR)) return;

      // Trigger only when clicking genuinely interactive elements
      const interactiveEl = target.closest(INTERACTIVE_SELECTOR);
      if (!interactiveEl) return;

      const now = Date.now();
      if (now - lastBurstRef.current < 280) return;
      lastBurstRef.current = now;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const clampedX = Math.max(54, Math.min(vw - 54, e.clientX));
      const clampedY = Math.max(46, Math.min(vh - 40, e.clientY - 14));

      const id = now + Math.random();
      const word =
        ONOMATOPOEIA_WORDS[
          Math.floor(Math.random() * ONOMATOPOEIA_WORDS.length)
        ];
      const rotate = Math.round(Math.random() * 18 - 9);
      const goldVariant = Math.random() > 0.45;

      const nextBurst: ImpactBurstItem = {
        id,
        x: clampedX,
        y: clampedY,
        word,
        rotate,
        goldVariant,
      };

      setBursts((prev) => [...prev.slice(-1), nextBurst]);

      const clearTimer = window.setTimeout(() => {
        setBursts((prev) => prev.filter((item) => item.id !== id));
      }, 620);
      timersRef.current.push(clearTimer);
    };

    document.addEventListener('click', handleClick, { passive: true });
    return () => {
      document.removeEventListener('click', handleClick);
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current = [];
    };
  }, [isComic, prefersReducedMotion]);

  if (!isComic || prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[60] overflow-hidden select-none"
    >
      <AnimatePresence>
        {bursts.map((burst) => (
          <motion.div
            key={burst.id}
            initial={{
              opacity: 0,
              scale: 0.45,
              x: burst.x,
              y: burst.y,
              rotate: burst.rotate,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.55, 1.08, 1, 0.92],
              y: burst.y - 24,
            }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-0 left-0 will-change-transform"
          >
            {/* Jagged pop-art action starburst badge */}
            <div className="relative -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center">
              <svg
                width="82"
                height="46"
                viewBox="0 0 110 62"
                className="block"
              >
                <polygon
                  points="10,20 22,5 42,14 58,3 72,15 96,7 91,25 106,36 88,43 95,58 70,50 54,59 38,48 16,56 22,40 4,33"
                  fill={burst.goldVariant ? '#D9B45B' : '#171717'}
                  stroke={burst.goldVariant ? '#171717' : '#D9B45B'}
                  strokeWidth="3"
                  strokeLinejoin="miter"
                />
              </svg>
              <span
                className={`absolute font-mono text-[10px] font-black tracking-widest uppercase ${
                  burst.goldVariant ? 'text-[#171717]' : 'text-[#FFFFFF]'
                }`}
              >
                {burst.word}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ComicImpactBursts;
