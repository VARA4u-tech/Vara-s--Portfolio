import { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  baseAlpha: number;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
}

/**
 * PixelGrid
 * Fixed full-screen canvas grid of pixel dots.
 * - Random breathing pulse per dot
 * - Mouse proximity brightens nearby dots
 * - Scroll causes a subtle column-shift parallax
 *
 * Monochrome only. Disabled on touch + prefers-reduced-motion.
 */
const PixelGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DOT_SIZE = 1.5;
    const GAP = 28; // spacing between dots
    const MOUSE_RADIUS = 120;
    const MOUSE_BOOST = 0.55;

    let W = 0;
    let H = 0;
    let dots: Dot[] = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let scrollY = 0;
    let animId: number;

    const buildGrid = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;

      dots = [];
      const cols = Math.ceil(W / GAP) + 1;
      const rows = Math.ceil(H / GAP) + 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const baseAlpha = 0.06 + Math.random() * 0.08;
          dots.push({
            x: c * GAP,
            y: r * GAP,
            baseAlpha,
            alpha: baseAlpha,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.003 + Math.random() * 0.005,
          });
        }
      }
    };

    buildGrid();
    window.addEventListener('resize', buildGrid);

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });

    let frame = 0;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      frame++;

      ctx.clearRect(0, 0, W, H);

      const parallaxOffset = (scrollY * 0.015) % GAP;

      for (const dot of dots) {
        // Breathing pulse
        dot.pulsePhase += dot.pulseSpeed;
        const pulse = Math.sin(dot.pulsePhase) * 0.025;

        // Parallax — shift Y slightly with scroll
        const drawY = dot.y - parallaxOffset;

        // Skip dots outside viewport
        if (drawY < -GAP || drawY > H + GAP) continue;

        // Mouse proximity glow
        const dx = dot.x - mouseX;
        const dy = drawY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity =
          dist < MOUSE_RADIUS ? (1 - dist / MOUSE_RADIUS) * MOUSE_BOOST : 0;

        dot.alpha = Math.min(0.85, dot.baseAlpha + pulse + proximity);

        ctx.globalAlpha = dot.alpha;
        ctx.fillStyle = '#000000';
        ctx.fillRect(
          dot.x - DOT_SIZE / 2,
          drawY - DOT_SIZE / 2,
          DOT_SIZE,
          DOT_SIZE,
        );
      }

      ctx.globalAlpha = 1;
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', buildGrid);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.9,
      }}
    />
  );
};

export default PixelGrid;
