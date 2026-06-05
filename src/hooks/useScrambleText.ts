import { useRef, useCallback } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#░▒▓█▄▀■□▪▫';

interface Options {
  duration?: number; // total scramble duration in ms (default 700)
  fps?: number;      // max updates per second (default 24)
  onComplete?: () => void;
}

/**
 * useScrambleText
 *
 * Attach the returned `ref` to a DOM element whose textContent you want to scramble.
 * Call `scramble()` to trigger the effect (idempotent — safe to call multiple times).
 *
 * Example:
 *   const { ref, scramble } = useScrambleText({ duration: 600 });
 *   <h2 ref={ref}>Experience.</h2>
 */
export function useScrambleText<T extends HTMLElement = HTMLElement>(
  opts: Options = {},
) {
  const { duration = 700, fps = 24, onComplete } = opts;

  const ref = useRef<T>(null);
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runningRef = useRef(false);

  const scramble = useCallback(() => {
    const el = ref.current;
    if (!el || runningRef.current) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const original = el.textContent ?? '';
    if (!original.trim()) return;

    runningRef.current = true;
    const start = performance.now();
    const interval = 1000 / fps;
    let lastFrame = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      if (now - lastFrame >= interval) {
        lastFrame = now;

        // Characters revealed = progress fraction of string length
        const revealed = Math.floor(progress * original.length);
        let output = '';

        for (let i = 0; i < original.length; i++) {
          if (original[i] === ' ') {
            output += ' ';
          } else if (i < revealed) {
            output += original[i];
          } else {
            output += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }

        el.textContent = output;
      }

      if (progress < 1) {
        frameRef.current = setTimeout(() => tick(performance.now()), 0);
      } else {
        el.textContent = original;
        runningRef.current = false;
        onComplete?.();
      }
    };

    tick(performance.now());
  }, [duration, fps, onComplete]);

  return { ref, scramble };
}
