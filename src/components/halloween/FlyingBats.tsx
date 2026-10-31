import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHalloween } from './HalloweenContext';

interface Bat {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  scale: number;
  duration: number;
  delay: number;
  curveY: number;
}

export const FlyingBats: React.FC = () => {
  const { isHalloween, prefersReducedMotion } = useHalloween();
  const [activeFlights, setActiveFlights] = useState<Bat[]>([]);

  useEffect(() => {
    if (!isHalloween || prefersReducedMotion) {
      setActiveFlights([]);
      return;
    }

    const triggerFlight = () => {
      if (typeof window === 'undefined') return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Random flight direction: left-to-right or right-to-left
      const leftToRight = Math.random() > 0.4;
      const count = Math.floor(Math.random() * 2) + 1; // 1-2 bats per flock

      const newBats: Bat[] = [];
      const baseDelay = 0;

      for (let i = 0; i < count; i++) {
        const startY = Math.random() * (vh * 0.45) + 60; // upper half of screen
        const endY = startY + (Math.random() * 160 - 80);
        const curveY = (startY + endY) / 2 + (Math.random() * 120 - 60);

        newBats.push({
          id: Date.now() + i,
          startX: leftToRight ? -80 : vw + 80,
          startY,
          endX: leftToRight ? vw + 100 : -100,
          endY,
          scale: 0.65 + Math.random() * 0.45,
          duration: 7 + Math.random() * 4, // 7-11s smooth majestic flight
          delay: baseDelay + i * 0.8,
          curveY,
        });
      }

      setActiveFlights(newBats);

      // Clean up after flight completes
      setTimeout(() => {
        setActiveFlights([]);
      }, 14000);
    };

    // First flight after 4 seconds
    const initialTimer = setTimeout(triggerFlight, 4000);

    // Then periodically every 24-34 seconds
    const interval = setInterval(triggerFlight, 26000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isHalloween, prefersReducedMotion]);

  if (!isHalloween || prefersReducedMotion) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
      aria-hidden="true"
    >
      <AnimatePresence>
        {activeFlights.map((bat) => {
          const facingRight = bat.endX > bat.startX;
          return (
            <motion.div
              key={bat.id}
              className="absolute top-0 left-0"
              initial={{
                x: bat.startX,
                y: bat.startY,
                opacity: 0,
                scale: bat.scale,
              }}
              animate={{
                x: [bat.startX, (bat.startX + bat.endX) / 2, bat.endX],
                y: [bat.startY, bat.curveY, bat.endY],
                opacity: [0, 0.9, 0.9, 0],
              }}
              transition={{
                duration: bat.duration,
                delay: bat.delay,
                ease: 'easeInOut',
              }}
            >
              <div
                style={{
                  transform: facingRight ? 'scaleX(1)' : 'scaleX(-1)',
                }}
              >
                {/* Flapping Bat SVG */}
                <motion.div
                  animate={{
                    y: [0, -6, 0, -6, 0],
                    rotate: [0, -4, 3, -4, 0],
                  }}
                  transition={{
                    duration: 0.45,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-10 h-7 text-[#0B0B0B]"
                  style={{
                    filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.4))',
                  }}
                >
                  <svg viewBox="0 0 64 40" fill="currentColor">
                    {/* Bat Body */}
                    <ellipse cx="32" cy="20" rx="4" ry="7" />
                    {/* Bat Ears */}
                    <polygon points="30,14 28,9 32,12" />
                    <polygon points="34,14 36,9 32,12" />
                    {/* Left Wing with flap motion */}
                    <motion.path
                      d="M 28 18 Q 18 10 4 14 Q 10 24 16 26 Q 22 28 28 24 Z"
                      animate={{
                        d: [
                          'M 28 18 Q 18 10 4 14 Q 10 24 16 26 Q 22 28 28 24 Z',
                          'M 28 18 Q 18 4 6 2 Q 12 16 18 20 Q 24 24 28 22 Z',
                          'M 28 18 Q 18 10 4 14 Q 10 24 16 26 Q 22 28 28 24 Z',
                        ],
                      }}
                      transition={{
                        duration: 0.4,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    {/* Right Wing with flap motion */}
                    <motion.path
                      d="M 36 18 Q 46 10 60 14 Q 54 24 48 26 Q 42 28 36 24 Z"
                      animate={{
                        d: [
                          'M 36 18 Q 46 10 60 14 Q 54 24 48 26 Q 42 28 36 24 Z',
                          'M 36 18 Q 46 4 58 2 Q 52 16 46 20 Q 40 24 36 22 Z',
                          'M 36 18 Q 46 10 60 14 Q 54 24 48 26 Q 42 28 36 24 Z',
                        ],
                      }}
                      transition={{
                        duration: 0.4,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default FlyingBats;
