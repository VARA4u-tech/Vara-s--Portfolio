import React, { useEffect, useRef } from 'react';
import { useHalloween } from './HalloweenContext';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  maxOpacity: number;
  color: string;
  wobbleSpeed: number;
  wobbleAngle: number;
}

export const SpookyAtmosphere: React.FC = () => {
  const { isHalloween, prefersReducedMotion } = useHalloween();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isHalloween || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Halloween particle color palette (glowing amber, orange, subtle violet, ghost dust)
    const colors = [
      'rgba(255, 117, 24, ', // Halloween Orange
      'rgba(255, 160, 0, ', // Warm Amber
      'rgba(245, 245, 245, ', // Ghost White
      'rgba(147, 51, 234, ', // Mystical Purple
    ];

    // Cap at 25 particles for lightweight, clean performance
    const particleCount = width < 768 ? 14 : 24;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 1.2,
        speedY: -(Math.random() * 0.45 + 0.2), // gentle upwards drift
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.5 + 0.1,
        maxOpacity: Math.random() * 0.45 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        wobbleAngle: Math.random() * Math.PI * 2,
      });
    }

    let isRunning = true;
    const handleVisibility = () => {
      isRunning = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = () => {
      if (!isRunning) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.wobbleAngle += p.wobbleSpeed;
        p.x += Math.sin(p.wobbleAngle) * 0.4 + p.speedX;
        p.y += p.speedY;

        // Reset if drifted off screen
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw soft glowing particle
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#FF7518';
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isHalloween, prefersReducedMotion]);

  if (!isHalloween || prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
    />
  );
};

export default SpookyAtmosphere;
