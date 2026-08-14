import { useEffect, useRef } from 'react';

interface Pixel {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  shade: number; // 0–255 greyscale
}

/**
 * PixelCursor
 * Full-screen canvas layer. On mouse move, spawns tiny pixel squares
 * that drift + fall under gravity, then fade out.
 *
 * Disabled on touch devices and when prefers-reduced-motion is set.
 */
interface PixelCursorProps {
  isWhite?: boolean;
}

const PixelCursor = ({ isWhite = false }: PixelCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: -999, y: -999 });

  useEffect(() => {
    // Skip on touch / reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    const pixels: Pixel[] = [];
    let mouseX = -999;
    let mouseY = -999;
    let lastSpawnX = -999;
    let lastSpawnY = -999;
    let animId: number;

    const SPAWN_DISTANCE = 6; // spawn every N px of movement
    const SPAWN_COUNT = 3; // pixels per spawn burst

    const spawnPixels = (x: number, y: number) => {
      for (let i = 0; i < SPAWN_COUNT; i++) {
        const size = Math.random() * 5 + 3; // 3–8px
        pixels.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          size,
          vx: (Math.random() - 0.5) * 1.8,
          vy: Math.random() * -1.2 - 0.4, // initial upward kick
          alpha: 0.85 + Math.random() * 0.15,
          decay: 0.012 + Math.random() * 0.018,
          shade: isWhite
            ? 255 - Math.floor(Math.random() * 50) // near-white shades
            : Math.floor(Math.random() * 80), // near-black shades
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mousePos.current = { x: mouseX, y: mouseY };

      const dx = mouseX - lastSpawnX;
      const dy = mouseY - lastSpawnY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > SPAWN_DISTANCE) {
        spawnPixels(mouseX, mouseY);
        lastSpawnX = mouseX;
        lastSpawnY = mouseY;
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    const GRAVITY = 0.08;
    const MAX_PIXELS = 300;

    const draw = () => {
      animId = requestAnimationFrame(draw);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Trim if too many
      if (pixels.length > MAX_PIXELS) {
        pixels.splice(0, pixels.length - MAX_PIXELS);
      }

      for (let i = pixels.length - 1; i >= 0; i--) {
        const p = pixels[i];

        p.vy += GRAVITY;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          pixels.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = `rgb(${p.shade},${p.shade},${p.shade})`;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      }

      ctx.globalAlpha = 1;

      // Draw custom white cursor dot when on loading screen
      if (isWhite && mousePos.current.x > 0) {
        const { x, y } = mousePos.current;
        // Outer ring
        ctx.globalAlpha = 0.6;
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.stroke();
        // Inner dot
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', setSize);
    };
  }, [isWhite]);

  // Hide default cursor site-wide when on loading screen
  useEffect(() => {
    if (isWhite) {
      document.body.style.cursor = 'none';
    } else {
      document.body.style.cursor = '';
    }
    return () => {
      document.body.style.cursor = '';
    };
  }, [isWhite]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pixel-cursor-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10001,
        pointerEvents: 'none',
      }}
    />
  );
};

export default PixelCursor;
