import React, { useEffect, useRef } from 'react';
import { useComic } from '@/context/ThemeContext';

type ParticleShape = 'star' | 'dot' | 'streak';

interface ComicMote {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  shape: ParticleShape;
  color: string;
  phase: number;
  phaseSpeed: number;
}

const MOTES_PALETTE = [
  '217, 180, 91', // #D9B45B Mustard Gold
  '181, 139, 50', // #B58B32 Dark Gold
  '217, 217, 217', // #D9D9D9 Concrete Gray
  '136, 136, 136', // #888888 Industrial Gray
  '255, 255, 255', // #FFFFFF Pure White
];

/**
 * Lightweight Noir Print & Hero Skyline Atmosphere Canvas.
 * Renders crisp, unblurred 4-point comic glints, ink flecks, and micro speed-streaks
 * strictly within the 6-color palette — pauses on tab switch and honors reduced motion.
 */
export const ComicAtmosphere: React.FC = () => {
  const { isComic, prefersReducedMotion } = useComic();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isComic || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = width < 768 ? 10 : 18;
    const shapes: ParticleShape[] = ['star', 'dot', 'dot', 'streak'];
    const motes: ComicMote[] = [];

    for (let i = 0; i < count; i++) {
      const shape = shapes[i % shapes.length];
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size:
          shape === 'star'
            ? 2.8 + Math.random() * 2.2
            : shape === 'streak'
              ? 6 + Math.random() * 6
              : 1.5 + Math.random() * 1.4,
        speedY: -(0.22 + Math.random() * 0.35),
        speedX: (Math.random() - 0.5) * 0.16,
        opacity: 0.25 + Math.random() * 0.4,
        shape,
        color: MOTES_PALETTE[i % MOTES_PALETTE.length],
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.012 + Math.random() * 0.015,
      });
    }

    let isRunning = !document.hidden;
    const handleVisibility = () => {
      isRunning = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const drawFourPointStar = (
      cx: number,
      cy: number,
      r: number,
      fillStyle: string,
    ) => {
      const inner = r * 0.26;
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + inner, cy - inner);
      ctx.lineTo(cx + r, cy);
      ctx.lineTo(cx + inner, cy + inner);
      ctx.lineTo(cx, cy + r);
      ctx.lineTo(cx - inner, cy + inner);
      ctx.lineTo(cx - r, cy);
      ctx.lineTo(cx - inner, cy - inner);
      ctx.closePath();
      ctx.fillStyle = fillStyle;
      ctx.fill();
    };

    const render = () => {
      if (isRunning) {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < motes.length; i++) {
          const m = motes[i];
          m.phase += m.phaseSpeed;
          m.x += Math.sin(m.phase) * 0.28 + m.speedX;
          m.y += m.speedY;

          if (m.y < -16) {
            m.y = height + 16;
            m.x = Math.random() * width;
          }
          if (m.x < -16) m.x = width + 16;
          if (m.x > width + 16) m.x = -16;

          const fill = `rgba(${m.color}, ${m.opacity.toFixed(2)})`;

          if (m.shape === 'star') {
            drawFourPointStar(m.x, m.y, m.size, fill);
          } else if (m.shape === 'streak') {
            ctx.strokeStyle = fill;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(m.x + 2, m.y + m.size);
            ctx.stroke();
          } else {
            ctx.fillStyle = fill;
            ctx.fillRect(m.x, m.y, m.size, m.size);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isComic, prefersReducedMotion]);

  if (!isComic || prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
    />
  );
};

export default ComicAtmosphere;
