import { useEffect } from 'react';

const CONFIG = {
  CHARS: {
    MINIMAL: '01{}[]/*#=+-;:.abcdefghi',
    FULL: '01{}[]<>/*#=+-;:.abcdefghijklmnopqrstuvwxyz',
  },
  COLS: { PHONE: 24, TABLET: 32, DESKTOP: 0 },
  FPS: { PHONE: 24, TABLET: 24, DESKTOP: 33 },
  FONT_SIZE: { PHONE: 12, TABLET: 13, DESKTOP: 14 },
  TRAIL_FADE: {
    PHONE: 'rgba(255,255,255,0.10)',
    TABLET: 'rgba(255,255,255,0.08)',
    DESKTOP: 'rgba(255,255,255,0.06)',
  },
};

export const useMatrixRain = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    const w = window.innerWidth;
    const isPhone = w <= 480;
    const isTablet = w > 480 && w <= 1024;
    const isDesktop = w > 1024;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Performance tiers ──────────────────────────────────────────
    // Phone:   24 columns, 24fps, tiny chars, DPR capped at 1
    // Tablet:  32 columns, 24fps, medium chars, DPR capped at 1
    // Desktop: full columns, 33fps, full char set, native DPR
    const dpr = isDesktop ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    const COLS = isPhone ? CONFIG.COLS.PHONE : isTablet ? CONFIG.COLS.TABLET : CONFIG.COLS.DESKTOP;
    const FPS = isPhone ? CONFIG.FPS.PHONE : isTablet ? CONFIG.FPS.TABLET : CONFIG.FPS.DESKTOP;
    const FRAME_MS = 1000 / FPS;

    // Minimal char set on mobile for faster Math.random index lookups
    const chars = (isPhone || isTablet) ? CONFIG.CHARS.MINIMAL : CONFIG.CHARS.FULL;

    const fontSize = isPhone ? CONFIG.FONT_SIZE.PHONE : isTablet ? CONFIG.FONT_SIZE.TABLET : CONFIG.FONT_SIZE.DESKTOP;

    const setSize = () => {
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      if (dpr !== 1) ctx.scale(dpr, dpr);
    };
    setSize();

    // Column stride — auto on desktop, fixed count on mobile/tablet
    const colStride =
      COLS > 0 ? Math.floor(window.innerWidth / COLS) : fontSize;
    const columns = COLS > 0 ? COLS : Math.floor(window.innerWidth / colStride);

    interface Drop {
      y: number;
      depth: number;
      speed: number;
    }
    const drops: Drop[] = Array.from({ length: columns }, () => ({
      y: Math.random() * -50,
      depth: Math.random(),
      speed: isPhone
        ? 0.6 + Math.random() * 0.8 // very slow on phone
        : isTablet
          ? 0.9 + Math.random() * 1.4
          : 1.5 + Math.random() * 3.5,
    }));

    let lastTime = 0;
    let rafId: number;
    let paused = false;

    const draw = (ts: number) => {
      rafId = requestAnimationFrame(draw);
      if (paused) return;
      if (ts - lastTime < FRAME_MS) return;
      lastTime = ts;

      const cw = canvas.width / dpr;
      const ch = canvas.height / dpr;

      // Fade trail — less transparent on mobile = faster visual reset
      ctx.fillStyle = isPhone
        ? CONFIG.TRAIL_FADE.PHONE
        : isTablet
          ? CONFIG.TRAIL_FADE.TABLET
          : CONFIG.TRAIL_FADE.DESKTOP;
      ctx.fillRect(0, 0, cw, ch);

      const charLen = chars.length;
      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const char = chars[(Math.random() * charLen) | 0];
        const fSize = isPhone ? fontSize : fontSize * (0.5 + drop.depth * 0.7);
        const opacity = isPhone
          ? 0.35 + drop.depth * 0.40
          : 0.05 + drop.depth * 0.25;

        ctx.font = `${fSize}px monospace`;
        ctx.fillStyle = `rgba(0,0,0,${opacity * 1.5})`;
        ctx.fillText(char, i * colStride, drop.y * fontSize);

        // Trail char — skip on phone to save one fillText per frame
        if (!isPhone && drop.y > 1) {
          ctx.fillStyle = `rgba(0,0,0,${opacity})`;
          ctx.fillText(
            chars[(Math.random() * charLen) | 0],
            i * colStride,
            (drop.y - 1) * fontSize,
          );
        }

        drop.y += drop.speed;

        // Reset threshold — higher on mobile so columns reset sooner
        const resetThreshold = isPhone ? 0.93 : isTablet ? 0.96 : 0.97;
        if (drop.y * fontSize > ch && Math.random() > resetThreshold) {
          drop.y = -(Math.random() * 10 + 2);
          drop.depth = Math.random();
          drop.speed = isPhone
            ? 0.6 + Math.random() * 0.8
            : isTablet
              ? 0.9 + Math.random() * 1.4
              : 1 + drop.depth * 2;
        }
      }
    };

    rafId = requestAnimationFrame(draw);

    // ── Pause when tab is hidden ──────────────────────────────────
    const onVisibility = () => {
      paused = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    // ── Pause when hero is out of viewport (IntersectionObserver) ─
    let io: IntersectionObserver | null = null;
    const hero = canvas.parentElement;
    if (hero && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        ([entry]) => {
          paused = !entry.isIntersecting;
        },
        { threshold: 0.01 },
      );
      io.observe(hero);
    }

    // ── Resize ────────────────────────────────────────────────────
    const onResize = () => setSize();
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      io?.disconnect();
    };
  }, [canvasRef]);
};
