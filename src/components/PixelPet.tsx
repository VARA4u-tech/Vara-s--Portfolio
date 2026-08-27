/**
 * PixelPet — Page-wide companion mascot.
 *
 * Architecture:
 *  - Fixed overlay (pointer-events: auto on dog element only).
 *  - IntersectionObserver drives section-to-section jumps.
 *  - Single mousemove listener for proximity → notice/bark.
 *  - RAF loop drives all position & animation state — zero React re-renders
 *    during motion (only state changes trigger re-render for visual mode).
 *  - prefers-reduced-motion: fully static.
 *  - Mobile / touch: cursor events disabled; scroll-only transitions; lower fps.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { playBark } from '@/hooks/useSoundEffects';

// ─── Section config ────────────────────────────────────────────────────
const SECTION_IDS = [
  'hero',
  'about',
  'education',
  'experience',
  'achievements',
  'projects',
  'skills',
  'contact',
  'finale',
] as const;

// ─── Dog states ────────────────────────────────────────────────────────
type DogState =
  | 'idle'
  | 'walking'
  | 'jumping'
  | 'noticing'
  | 'barking'
  | 'hoveredPause'
  | 'sleeping';

// ─── Constants ─────────────────────────────────────────────────────────
const DOG_W = 40; // px — bounding box width
const DOG_H = 40; // px — bounding box height
const BARK_COOLDOWN_MS = 15_000;
const PROXIMITY_RADIUS = 180; // px
const SLEEP_AFTER_MS = 14_000;

interface PixelPetProps {
  /** Section IDs passed from the page so the dog can observe them. */
  sectionIds?: readonly string[];
}

const PixelPet = ({ sectionIds = SECTION_IDS }: PixelPetProps) => {
  // ── Reduced motion guard ──────────────────────────────────────────────
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Touch device detection ─────────────────────────────────────────────
  const isTouch =
    typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  // ── Dog visual state (triggers re-render) ──────────────────────────────
  const [dogState, setDogState] = useState<DogState>('idle');
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [showBark, setShowBark] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  // ── Refs for zero-render animation loop ───────────────────────────────
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dogRef = useRef<HTMLDivElement>(null);

  // Position state (mutated directly in RAF; no setState)
  const posRef = useRef({ x: 60, y: 0 }); // x = px from left

  // Mutable state refs (not React state to avoid re-renders)
  const currentSectionIdx = useRef(0);
  const targetSectionIdx = useRef(0);
  const isJumping = useRef(false);
  const isHovered = useRef(false);
  const lastBarkTime = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sleepTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef<DogState>('idle');
  const rafRef = useRef<number>(0);
  const jumpFromX = useRef(0);
  const jumpToX = useRef(0);
  const jumpPhase = useRef<'anticipate' | 'arc' | 'land' | 'recover' | 'done'>(
    'done',
  );
  const jumpPhaseStart = useRef(0);
  const barkShowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noticeShowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Helper: set state via both ref and React setState ─────────────────
  const applyState = useCallback((s: DogState) => {
    stateRef.current = s;
    setDogState(s);
  }, []);

  // ── Compute X position for a given section index ──────────────────────
  const xForSection = useCallback(
    (idx: number): number => {
      const vw = window.innerWidth;
      const count = sectionIds.length;
      // Spread across 10% – 80% of viewport width so dog stays visible
      const spread = vw * 0.7;
      const start = vw * 0.08;
      return Math.round(start + (idx / Math.max(count - 1, 1)) * spread);
    },
    [sectionIds.length],
  );

  // ── Start a section jump ───────────────────────────────────────────────
  const startJump = useCallback(
    (toIdx: number) => {
      if (isJumping.current || isHovered.current) return;
      const fromX = posRef.current.x;
      const toX = xForSection(toIdx);
      if (Math.abs(toX - fromX) < 20) return; // already close enough

      currentSectionIdx.current = toIdx;
      jumpFromX.current = fromX;
      jumpToX.current = toX;
      isJumping.current = true;
      jumpPhase.current = 'anticipate';
      jumpPhaseStart.current = performance.now();

      setDirection(toX > fromX ? 'right' : 'left');
      applyState('jumping');

      // Clear sleep/idle
      if (sleepTimer.current) clearTimeout(sleepTimer.current);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    },
    [xForSection, applyState],
  );

  const armSleepTimer = useCallback(() => {
    if (sleepTimer.current) clearTimeout(sleepTimer.current);
    sleepTimer.current = setTimeout(() => {
      if (!isJumping.current && !isHovered.current) {
        applyState('sleeping');
      }
    }, SLEEP_AFTER_MS);
  }, [applyState]);

  // ── Jump animation tick (called from RAF) ─────────────────────────────
  const tickJump = useCallback(
    (now: number) => {
      const el = wrapperRef.current;
      if (!el) return;

      const elapsed = now - jumpPhaseStart.current;

      if (jumpPhase.current === 'anticipate') {
        // Crouch: 120ms
        const t = Math.min(elapsed / 120, 1);
        const scaleY = 1 - 0.18 * Math.sin(t * Math.PI);
        const ty = 4 * Math.sin(t * Math.PI);
        el.style.transform = `translateX(${posRef.current.x}px) translateY(${ty}px) scaleY(${scaleY})`;
        if (elapsed >= 120) {
          jumpPhase.current = 'arc';
          jumpPhaseStart.current = now;
        }
      } else if (jumpPhase.current === 'arc') {
        // Arc jump: 500ms
        const t = Math.min(elapsed / 500, 1);
        // ease out cubic for X
        const eased = 1 - Math.pow(1 - t, 3);
        const newX =
          jumpFromX.current + (jumpToX.current - jumpFromX.current) * eased;
        posRef.current.x = newX;
        // Parabolic arc for Y: peaks at midpoint
        const arc = Math.sin(t * Math.PI) * -65;
        el.style.transform = `translateX(${newX}px) translateY(${arc}px) scaleY(${1 + Math.abs(arc) * 0.003})`;
        if (elapsed >= 500) {
          posRef.current.x = jumpToX.current;
          jumpPhase.current = 'land';
          jumpPhaseStart.current = now;
        }
      } else if (jumpPhase.current === 'land') {
        // Squash: 80ms
        const t = Math.min(elapsed / 80, 1);
        const scaleY = 1 - 0.22 * Math.sin(t * Math.PI);
        const scaleX = 1 + 0.12 * Math.sin(t * Math.PI);
        el.style.transform = `translateX(${posRef.current.x}px) translateY(0px) scaleY(${scaleY}) scaleX(${scaleX})`;
        if (elapsed >= 80) {
          jumpPhase.current = 'recover';
          jumpPhaseStart.current = now;
        }
      } else if (jumpPhase.current === 'recover') {
        // Recover: 150ms back to normal
        const t = Math.min(elapsed / 150, 1);
        const eased = 1 - Math.pow(1 - t, 2);
        const scaleY = 0.78 + 0.22 * eased;
        const scaleX = 1.12 - 0.12 * eased;
        el.style.transform = `translateX(${posRef.current.x}px) translateY(0px) scaleY(${scaleY}) scaleX(${scaleX})`;
        if (elapsed >= 150) {
          jumpPhase.current = 'done';
          el.style.transform = `translateX(${posRef.current.x}px) translateY(0px)`;
          isJumping.current = false;
          applyState('idle');
          armSleepTimer();
        }
      }
    },
    [applyState, armSleepTimer],
  );

  // ── RAF loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (prefersReduced) return;

    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);
      if (isJumping.current) {
        tickJump(now);
        return;
      }

      // Subtle idle bob when not paused
      if (!isHovered.current && stateRef.current === 'idle') {
        const bob = Math.sin(now / 900) * 1.8;
        const el = wrapperRef.current;
        if (el) {
          el.style.transform = `translateX(${posRef.current.x}px) translateY(${bob}px)`;
        }
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReduced, tickJump]);

  // ── IntersectionObserver — section tracking ───────────────────────────
  useEffect(() => {
    if (prefersReduced) return;

    // Position dog at hero on mount
    posRef.current.x = xForSection(0);
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = `translateX(${posRef.current.x}px) translateY(0px)`;
    }

    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id, idx) => {
      const el = document.getElementById(id as string);
      if (!el) return;

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
              if (
                idx !== currentSectionIdx.current &&
                idx !== targetSectionIdx.current
              ) {
                targetSectionIdx.current = idx;
                // Small delay so rapid scroll doesn't trigger a dozen jumps
                setTimeout(() => {
                  if (targetSectionIdx.current === idx) {
                    startJump(idx);
                  }
                }, 350);
              }
            }
          });
        },
        { threshold: 0.35 },
      );

      obs.observe(el);
      observers.push(obs);
    });

    armSleepTimer();

    return () => {
      observers.forEach((o) => o.disconnect());
      if (sleepTimer.current) clearTimeout(sleepTimer.current);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [prefersReduced, sectionIds, xForSection, startJump, armSleepTimer]);

  // ── Cursor proximity detection ─────────────────────────────────────────
  useEffect(() => {
    if (prefersReduced || isTouch) return;

    const onMouseMove = (e: MouseEvent) => {
      if (isHovered.current) return;
      const el = dogRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const dogCX = rect.left + rect.width / 2;
      const dogCY = rect.top + rect.height / 2;
      const dx = e.clientX - dogCX;
      const dy = e.clientY - dogCY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const now = Date.now();
      if (
        dist < PROXIMITY_RADIUS &&
        stateRef.current !== 'barking' &&
        stateRef.current !== 'noticing' &&
        now - lastBarkTime.current > BARK_COOLDOWN_MS
      ) {
        // Notice → bark
        applyState('noticing');
        setShowNotice(true);
        if (noticeShowTimer.current) clearTimeout(noticeShowTimer.current);
        noticeShowTimer.current = setTimeout(() => {
          setShowNotice(false);
          applyState('barking');
          setShowBark(true);
          playBark();
          lastBarkTime.current = Date.now();
          if (barkShowTimer.current) clearTimeout(barkShowTimer.current);
          barkShowTimer.current = setTimeout(() => {
            setShowBark(false);
            if (!isHovered.current) {
              applyState('idle');
              armSleepTimer();
            }
          }, 1200);
        }, 500);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (barkShowTimer.current) clearTimeout(barkShowTimer.current);
      if (noticeShowTimer.current) clearTimeout(noticeShowTimer.current);
    };
  }, [prefersReduced, isTouch, applyState, armSleepTimer]);

  // ── Click handler ──────────────────────────────────────────────────────
  const handleClick = useCallback(() => {
    playBark();
    if (stateRef.current === 'sleeping') applyState('idle');
    setShowBark(true);
    if (barkShowTimer.current) clearTimeout(barkShowTimer.current);
    barkShowTimer.current = setTimeout(() => {
      setShowBark(false);
    }, 800);
    // Quick bounce
    const el = wrapperRef.current;
    if (!el || isJumping.current) return;
    const startY = performance.now();
    const bounce = (now: number) => {
      const t = (now - startY) / 320;
      if (t >= 1) {
        el.style.transform = `translateX(${posRef.current.x}px) translateY(0px)`;
        return;
      }
      const y = -28 * Math.sin(t * Math.PI);
      el.style.transform = `translateX(${posRef.current.x}px) translateY(${y}px)`;
      requestAnimationFrame(bounce);
    };
    requestAnimationFrame(bounce);
  }, [applyState]);

  // ── Hover handlers ─────────────────────────────────────────────────────
  const handleMouseEnter = useCallback(() => {
    isHovered.current = true;
    if (!isJumping.current) {
      applyState('hoveredPause');
    }
    if (sleepTimer.current) clearTimeout(sleepTimer.current);
  }, [applyState]);

  const handleMouseLeave = useCallback(() => {
    isHovered.current = false;
    if (!isJumping.current) {
      applyState('idle');
      armSleepTimer();
    }
  }, [applyState, armSleepTimer]);

  // ── Reduced motion: render static dog ─────────────────────────────────
  if (prefersReduced) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 12,
          left: 60,
          zIndex: 30,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <StaticDog />
      </div>
    );
  }

  // ─── CSS state class ────────────────────────────────────────────────
  const stateClass = `pixel-pet-${dogState}`;

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        bottom: 10,
        left: 0,
        zIndex: 30,
        transformOrigin: 'bottom center',
        willChange: 'transform',
        pointerEvents: 'none', // wrapper is non-interactive
      }}
      aria-hidden="true"
    >
      {/* Dog — interactive target */}
      <div
        ref={dogRef}
        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        title="Click me!"
      >
        {/* Speech bubble — bark */}
        {showBark && (
          <div className="pixel-pet-speech-bark">
            <span>woof!</span>
          </div>
        )}
        {/* Speech bubble — notice */}
        {showNotice && (
          <div className="pixel-pet-speech-notice">
            <span>!</span>
          </div>
        )}

        {/* Direction wrapper */}
        <div
          style={{
            transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
            transition: 'transform 0.15s ease',
          }}
        >
          <div
            className={`pixel-pet-body ${stateClass}`}
            style={{ width: DOG_W, height: DOG_H, position: 'relative' }}
          >
            {/* Sleeping Zzz */}
            {dogState === 'sleeping' && (
              <div className="pixel-pet-zzz" aria-hidden="true">
                Z
              </div>
            )}

            <DogSvg state={dogState} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Dog SVG ───────────────────────────────────────────────────────────
const DogSvg = ({ state }: { state: DogState }) => {
  const isSleeping = state === 'sleeping';
  const isAlert = state === 'noticing' || state === 'barking';

  return (
    <svg
      viewBox="0 0 16 16"
      style={{ width: '100%', height: '100%' }}
      className="pixel-pet-svg"
    >
      {/* Tail */}
      <g className="pixel-pet-tail">
        <rect x="1" y="5" width="1" height="4" fill="currentColor" />
        <rect x="0" y="4" width="1" height="1" fill="currentColor" />
      </g>

      {/* Body */}
      <rect x="2" y="7" width="7" height="5" fill="currentColor" />

      {/* Head */}
      <rect x="9" y="5" width="6" height="5" fill="currentColor" />

      {/* Ears — left + right */}
      <g className="pixel-pet-ears">
        <rect x="10" y="3" width="2" height="2" fill="currentColor" />
        <rect x="13" y="3" width="2" height="2" fill="currentColor" />
      </g>

      {/* Eyes — open */}
      {!isSleeping && (
        <g>
          {/* Normal eye */}
          <rect x="10" y="6" width="1" height={isAlert ? 2 : 1} fill="white" />
          <rect x="13" y="6" width="1" height={isAlert ? 2 : 1} fill="white" />
        </g>
      )}

      {/* Eyes — closed/sleeping */}
      {isSleeping && (
        <g>
          <rect x="10" y="7" width="1" height="1" fill="white" />
          <rect x="13" y="7" width="1" height="1" fill="white" />
        </g>
      )}

      {/* Nose */}
      {isAlert && (
        <rect x="14" y="9" width="1" height="1" fill="white" opacity="0.7" />
      )}

      {/* Legs — walking */}
      <g className="pixel-pet-legs-standing">
        <rect x="3" y="12" width="2" height="2" fill="currentColor" />
        <rect x="6" y="12" width="2" height="2" fill="currentColor" />
      </g>
      <g className="pixel-pet-legs-walking">
        <rect x="2" y="12" width="2" height="2" fill="currentColor" />
        <rect x="7" y="12" width="2" height="2" fill="currentColor" />
      </g>
    </svg>
  );
};

// Minimal static dog for reduced-motion
const StaticDog = () => (
  <svg viewBox="0 0 16 16" style={{ width: 36, height: 36 }} aria-hidden="true">
    <rect x="1" y="5" width="1" height="4" fill="currentColor" />
    <rect x="0" y="4" width="1" height="1" fill="currentColor" />
    <rect x="2" y="7" width="7" height="5" fill="currentColor" />
    <rect x="9" y="5" width="6" height="5" fill="currentColor" />
    <rect x="10" y="3" width="2" height="2" fill="currentColor" />
    <rect x="13" y="3" width="2" height="2" fill="currentColor" />
    <rect x="10" y="6" width="1" height="1" fill="white" />
    <rect x="13" y="6" width="1" height="1" fill="white" />
    <rect x="3" y="12" width="2" height="2" fill="currentColor" />
    <rect x="6" y="12" width="2" height="2" fill="currentColor" />
  </svg>
);

export default PixelPet;
