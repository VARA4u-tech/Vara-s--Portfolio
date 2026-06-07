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
 * - Mouse proximity brightens nearby dots (desktop only)
 * - Scroll causes a subtle column-shift parallax
 *
 * Mobile/tablet (≤ 768px): disabled entirely for performance.
 * Touch devices: mouse proximity skipped, reduced dot density.
 * prefers-reduced-motion: disabled.
 */
const PixelGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // ── Guards ──────────────────────────────────────────────
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Disable entirely on mobile / small tablet for performance
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    // Detect touch (no mouse → skip mouse proximity)
    const isTouch = window.matchMedia('(hover: none)').matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // ── Config (adapts to screen size) ──────────────────────
    const isTablet = window.innerWidth <= 1024;
    const DOT_SIZE = 1.5;
    const GAP = isTablet ? 38 : 28; // fewer dots on tablet
    const MOUSE_RADIUS = isTablet ? 80 : 120;
    const MOUSE_BOOST = 0.45;
    const MAX_PULSE_SPEED = isTablet ? 0.003 : 0.005;

    let W = 0;
    let H = 0;
    let dots: Dot[] = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let scrollY = 0;
    let animId: number;

    // ── Build dot grid ───────────────────────────────────────
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
          const baseAlpha = 0.05 + Math.random() * 0.07;
          dots.push({
            x: c * GAP,
            y: r * GAP,
            baseAlpha,
            alpha: baseAlpha,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.002 + Math.random() * MAX_PULSE_SPEED,
          });
        }
      }
    };

    buildGrid();

    // Debounce resize to avoid expensive grid rebuild on every pixel
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildGrid, 200);
    };
    window.addEventListener('resize', onResize);

    // ── Event listeners ──────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    if (!isTouch) {
      window.addEventListener('mousemove', onMouseMove);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── RAF draw loop ────────────────────────────────────────
    // Throttle to ~30fps on tablet, 60fps on desktop
    let lastFrame = 0;
    const FRAME_INTERVAL = isTablet ? 33 : 0; // ~30fps on tablet

    const draw = (now: number) => {
      animId = requestAnimationFrame(draw);

      if (FRAME_INTERVAL > 0 && now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;

      ctx.clearRect(0, 0, W, H);

      const parallaxOffset = (scrollY * 0.012) % GAP;

      for (const dot of dots) {
        // Breathing pulse
        dot.pulsePhase += dot.pulseSpeed;
        const pulse = Math.sin(dot.pulsePhase) * 0.022;

        // Parallax — shift Y slightly with scroll
        const drawY = dot.y - parallaxOffset;

        // Skip dots outside viewport
        if (drawY < -GAP || drawY > H + GAP) continue;

        // Mouse proximity glow (desktop only — cheaper distSq check)
        let proximity = 0;
        if (!isTouch) {
          const dx = dot.x - mouseX;
          const dy = drawY - mouseY;
          const distSq = dx * dx + dy * dy;
          if (distSq < MOUSE_RADIUS * MOUSE_RADIUS) {
            proximity = (1 - Math.sqrt(distSq) / MOUSE_RADIUS) * MOUSE_BOOST;
          }
        }

        dot.alpha = Math.min(0.8, dot.baseAlpha + pulse + proximity);

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

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      if (!isTouch) window.removeEventListener('mousemove', onMouseMove);
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
        opacity: 0.85,
      }}
    />
  );
};

export default PixelGrid;
