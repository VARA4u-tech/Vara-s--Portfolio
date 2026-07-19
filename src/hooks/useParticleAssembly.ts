import { useEffect } from 'react';
import { ANIMATION_CONFIG } from '@/data/animations';

export const useParticleAssembly = (
  assembleCanvasRef: React.RefObject<HTMLCanvasElement>,
  nameRef: React.RefObject<HTMLHeadingElement>,
  scrambleLine1: () => void,
  scrambleLine2: () => void,
) => {
  useEffect(() => {
    const canvas = assembleCanvasRef.current;
    const nameEl = nameRef.current;
    if (!canvas || !nameEl) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Skip animation — show name immediately
      nameEl.style.opacity = '1';
      canvas.style.display = 'none';
      return;
    }

    // Skip heavy particle animation on mobile/tablet — just fade name in
    const isMobileOrTablet = window.innerWidth <= 1024;
    if (isMobileOrTablet) {
      canvas.style.display = 'none';
      nameEl.style.opacity = '0';
      nameEl.style.transition = 'opacity 0.6s ease 0.3s';
      // Trigger reflow then fade in
      requestAnimationFrame(() => {
        nameEl.style.opacity = '1';
        setTimeout(scrambleLine1, 400);
        setTimeout(scrambleLine2, 650);
      });
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Hide real name until assembly completes
    nameEl.style.opacity = '0';

    const { particleCount, assembleDurationMs, fadeDurationMs, spread } = ANIMATION_CONFIG.particleAssembly;

    interface Particle {
      sx: number;
      sy: number; // start (scatter)
      tx: number;
      ty: number; // target (centre)
      x: number;
      y: number;
      size: number;
      shade: number;
      eased: number;
    }

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const particles: Particle[] = Array.from({ length: particleCount }, () => {
      // scatter from screen edges
      const edge = Math.floor(Math.random() * 4);
      let sx = 0,
        sy = 0;
      if (edge === 0) {
        sx = Math.random() * canvas.width;
        sy = -20;
      } else if (edge === 1) {
        sx = canvas.width + 20;
        sy = Math.random() * canvas.height;
      } else if (edge === 2) {
        sx = Math.random() * canvas.width;
        sy = canvas.height + 20;
      } else {
        sx = -20;
        sy = Math.random() * canvas.height;
      }

      // target: cluster around name area
      return {
        sx,
        sy,
        tx: cx + (Math.random() - 0.5) * spread,
        ty: cy - 30 + (Math.random() - 0.5) * 80,
        x: sx,
        y: sy,
        size: Math.random() * 5 + 2,
        shade: Math.floor(Math.random() * 60),
        eased: 0,
      };
    });

    const start = performance.now();
    let animId: number;
    let phase: 'assemble' | 'fade' = 'assemble';
    let fadeStart = 0;

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const draw = (now: number) => {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (phase === 'assemble') {
        const t = Math.min((now - start) / assembleDurationMs, 1);

        for (const p of particles) {
          p.eased = easeOutQuart(t);
          p.x = p.sx + (p.tx - p.sx) * p.eased;
          p.y = p.sy + (p.ty - p.sy) * p.eased;

          ctx.globalAlpha = 0.7 + t * 0.3;
          ctx.fillStyle = `rgb(${p.shade},${p.shade},${p.shade})`;
          ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        }

        if (t >= 1) {
          // Assembly done — reveal real name + scramble
          nameEl.style.opacity = '1';
          nameEl.style.transition = 'opacity 0.25s ease';
          setTimeout(scrambleLine1, 50);
          setTimeout(scrambleLine2, 280);
          phase = 'fade';
          fadeStart = now;
        }
      } else {
        // Fade out canvas
        const ft = Math.min((now - fadeStart) / fadeDurationMs, 1);
        if (ft >= 1) {
          cancelAnimationFrame(animId);
          canvas.style.display = 'none';
          return;
        }
        ctx.globalAlpha = 1 - ft;
        for (const p of particles) {
          ctx.fillStyle = `rgb(${p.shade},${p.shade},${p.shade})`;
          ctx.fillRect(Math.round(p.tx), Math.round(p.ty), p.size, p.size);
        }
      }
    };

    // 300ms delay so page has loaded
    const timeout = setTimeout(() => {
      animId = requestAnimationFrame(draw);
    }, 300);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animId);
      if (nameEl) nameEl.style.opacity = '1';
    };
  }, [assembleCanvasRef, nameRef, scrambleLine1, scrambleLine2]);
};
