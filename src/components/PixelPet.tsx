/**
 * PixelPet — Living website mascot.
 *
 * Architecture:
 *  - position: absolute within the page (scrolls with content, not fixed to viewport).
 *  - Single useEffect owns the entire state machine — avoids hook dep-cycle issues.
 *  - Patrols randomly between sections every 10-22 seconds.
 *  - Jump: 4-phase RAF animation (anticipate → arc → land → recover).
 *  - Idle: CSS breathing animation on the body div.
 *  - Cursor proximity → notice ("!") → bark → cooldown (desktop).
 *  - Tap → bark (mobile).
 *  - Hover → pause all movement; resume on leave.
 *  - Sleep after 14s idle; wake on click.
 *  - prefers-reduced-motion: no motion at all.
 *  - Mobile / touch: no cursor events; simplified arc animation.
 */

import { useEffect, useRef, useState } from 'react';
import { playBark } from '@/hooks/useSoundEffects';

// ─── Section config ─────────────────────────────────────────────────────────
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

type SectionId = (typeof SECTION_IDS)[number];

// ─── Dog visual states ───────────────────────────────────────────────────────
type DogState =
  | 'idle'
  | 'walking'
  | 'jumping'
  | 'noticing'
  | 'barking'
  | 'hoveredPause'
  | 'sleeping';

// ─── Tuning constants ────────────────────────────────────────────────────────
const DOG_W = 44;
const DOG_H = 44;
const BARK_COOLDOWN_MS = 12_000;
const PROXIMITY_PX = 150;
const STAY_MIN_MS = 600_000; // 10 minutes minimum in each section
const STAY_JITTER_MS = 60_000; // ±60 s of natural randomness
const SLEEP_AFTER_MS = 15_000;

// ─── Component ───────────────────────────────────────────────────────────────
const PixelPet = () => {
  // Only 5 pieces of React state — everything else lives in refs inside the
  // single useEffect to avoid hook dependency cycles.
  const [dogState, setDogState] = useState<DogState>('idle');
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [showBark, setShowBark] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [visible, setVisible] = useState(false);

  // DOM refs
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dogRef = useRef<HTMLDivElement>(null);

  // Handler bridge — lets the effect write handlers that the JSX can call
  const onClickRef = useRef<() => void>(() => undefined);
  const onEnterRef = useRef<() => void>(() => undefined);
  const onLeaveRef = useRef<() => void>(() => undefined);

  // Stable setters (React guarantees these never change)
  const setDogStateRef = useRef(setDogState);
  const setDirectionRef = useRef(setDirection);
  const setShowBarkRef = useRef(setShowBark);
  const setShowNoticeRef = useRef(setShowNotice);
  const setVisibleRef = useRef(setVisible);

  // ── Main state-machine effect ───────────────────────────────────────────
  useEffect(() => {
    // ── Guards ──────────────────────────────────────────────────────────
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    const isTouch = window.matchMedia('(hover: none)').matches;

    // ── Local mutable state (lives inside the effect closure) ────────────
    let currentSection: SectionId = 'hero';
    let isAnimating = false;
    let isHovered = false;
    let lastBarkTime = 0;
    let dogStateLocal: DogState = 'idle';
    // Absolute page-coordinate resting position
    let posTop = 0;
    let posLeft = 0;

    let patrolTimer: ReturnType<typeof setTimeout> | null = null;
    let wanderTimer: ReturnType<typeof setTimeout> | null = null;
    let sleepTimer: ReturnType<typeof setTimeout> | null = null;
    let barkTimer: ReturnType<typeof setTimeout> | null = null;
    let noticeTimer: ReturnType<typeof setTimeout> | null = null;
    let rafId = 0;
    let jumpQueued: SectionId | null = null;

    // ── Helpers ──────────────────────────────────────────────────────────
    const applyState = (s: DogState) => {
      dogStateLocal = s;
      setDogStateRef.current(s);
    };

    const clearAllTimers = () => {
      if (patrolTimer) clearTimeout(patrolTimer);
      if (wanderTimer) clearTimeout(wanderTimer);
      if (sleepTimer) clearTimeout(sleepTimer);
      if (barkTimer) clearTimeout(barkTimer);
      if (noticeTimer) clearTimeout(noticeTimer);
      cancelAnimationFrame(rafId);
    };

    const armSleepTimer = () => {
      if (sleepTimer) clearTimeout(sleepTimer);
      sleepTimer = setTimeout(() => {
        if (!isAnimating && !isHovered) applyState('sleeping');
      }, SLEEP_AFTER_MS);
    };

    // Compute where the dog rests in a given section (document coordinates)
    const getSectionPos = (
      sectionId: string,
    ): { top: number; left: number } | null => {
      const el = document.getElementById(sectionId);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY;
      // Dog sits 20px above the section's bottom edge
      const top = rect.top + scrollY + rect.height - DOG_H - 20;
      // Random horizontal position with safe margins
      const safeL = 24;
      const safeR = window.innerWidth - DOG_W - 24;
      const left = safeL + Math.random() * Math.max(0, safeR - safeL);
      return { top, left };
    };

    // ── Patrol scheduler ─────────────────────────────────────────────────
    const schedulePatrol = () => {
      if (patrolTimer) clearTimeout(patrolTimer);
      const delay = STAY_MIN_MS + Math.random() * STAY_JITTER_MS;
      patrolTimer = setTimeout(() => {
        if (isHovered || isAnimating) {
          schedulePatrol(); // retry
          return;
        }
        const options = SECTION_IDS.filter((id) => id !== currentSection);
        const next = options[Math.floor(Math.random() * options.length)];
        doJump(next);
      }, delay);
    };

    // ── Wander (Walk) scheduler ─────────────────────────────────────────
    const scheduleWander = () => {
      if (wanderTimer) clearTimeout(wanderTimer);
      wanderTimer = setTimeout(() => {
        if (!isAnimating && !isHovered && dogStateLocal !== 'sleeping') {
          doWalk();
        } else {
          scheduleWander();
        }
      }, 15_000 + Math.random() * 20_000); // Walk every 15-35s
    };

    const doWalk = () => {
      if (isAnimating || isHovered) {
        scheduleWander();
        return;
      }

      const el = wrapperRef.current;
      if (!el) return;

      const sectionEl = document.getElementById(currentSection);
      if (!sectionEl) {
        scheduleWander();
        return;
      }

      // Pick a new horizontal position within the current section
      const safeL = 24;
      const safeR = window.innerWidth - DOG_W - 24;
      const targetLeft = safeL + Math.random() * Math.max(0, safeR - safeL);
      
      const fromLeft = posLeft;
      const dx = targetLeft - fromLeft;
      
      // If distance is too small, skip walking
      if (Math.abs(dx) < 40) {
        scheduleWander();
        return;
      }
      
      setDirectionRef.current(dx >= 0 ? 'right' : 'left');
      applyState('walking');
      isAnimating = true;
      if (sleepTimer) clearTimeout(sleepTimer);
      
      // Speed: ~45 pixels per second
      const dist = Math.abs(dx);
      const walkDuration = (dist / 45) * 1000;
      const start = performance.now();
      
      const frame = (now: number) => {
        const elapsed = now - start;
        if (elapsed < walkDuration) {
          const t = elapsed / walkDuration;
          const currentX = dx * t;
          el.style.transform = `translateX(${currentX}px)`;
          rafId = requestAnimationFrame(frame);
        } else {
          el.style.transform = 'none';
          el.style.left = `${targetLeft}px`;
          posLeft = targetLeft;
          isAnimating = false;
          
          if (jumpQueued) {
            const q = jumpQueued;
            jumpQueued = null;
            doJump(q);
          } else {
            applyState('idle');
            armSleepTimer();
            scheduleWander();
          }
        }
      };
      
      rafId = requestAnimationFrame(frame);
    };

    // ── Jump animation ────────────────────────────────────────────────────
    const doJump = (targetId: SectionId) => {
      if (isAnimating) {
        jumpQueued = targetId;
        return;
      }

      const targetPos = getSectionPos(targetId);
      if (!targetPos) {
        schedulePatrol();
        return;
      }

      const el = wrapperRef.current;
      if (!el) return;

      const fromLeft = posLeft;
      const fromTop = posTop;
      const toLeft = targetPos.left;
      const toTop = targetPos.top;

      const dx = toLeft - fromLeft;
      const dy = toTop - fromTop;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Arc height: taller for longer journeys
      const arcH = Math.min(100 + dist * 0.28, 400);

      setDirectionRef.current(dx >= 0 ? 'right' : 'left');
      applyState('jumping');
      isAnimating = true;
      if (sleepTimer) clearTimeout(sleepTimer);
      if (patrolTimer) clearTimeout(patrolTimer);

      // Reduced arc on mobile for performance
      const T_ANT = 120;
      const T_ARC = isTouch
        ? Math.min(400 + dist * 0.08, 700)
        : Math.min(500 + dist * 0.1, 900);
      const T_LAND = 90;
      const T_REC = 140;
      const T_TOTAL = T_ANT + T_ARC + T_LAND + T_REC;

      const start = performance.now();

      const frame = (now: number) => {
        const e = now - start;

        if (e < T_ANT) {
          // Anticipation crouch
          const t = e / T_ANT;
          const scaleY = 1 - 0.15 * Math.sin(t * Math.PI);
          const sinkY = 4 * Math.sin(t * Math.PI);
          el.style.transform = `translateX(0px) translateY(${sinkY}px) scaleY(${scaleY})`;
        } else if (e < T_ANT + T_ARC) {
          // Parabolic arc
          const t = (e - T_ANT) / T_ARC;
          // ease-in-out quad for horizontal travel
          const eX = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          const arcOffset = -arcH * Math.sin(t * Math.PI);
          const curX = dx * eX;
          const curY = dy * eX + arcOffset;
          el.style.transform = `translateX(${curX}px) translateY(${curY}px)`;
        } else if (e < T_ANT + T_ARC + T_LAND) {
          // Landing squash
          const t = (e - T_ANT - T_ARC) / T_LAND;
          const scaleY = 1 - 0.24 * Math.sin(t * Math.PI);
          const scaleX = 1 + 0.15 * Math.sin(t * Math.PI);
          el.style.transform = `translateX(${dx}px) translateY(${dy}px) scaleY(${scaleY}) scaleX(${scaleX})`;
        } else if (e < T_TOTAL) {
          // Spring recover
          const t = (e - T_ANT - T_ARC - T_LAND) / T_REC;
          const eased = 1 - Math.pow(1 - t, 3);
          const scaleY = 0.76 + 0.24 * eased;
          const scaleX = 1.15 - 0.15 * eased;
          el.style.transform = `translateX(${dx}px) translateY(${dy}px) scaleY(${scaleY}) scaleX(${scaleX})`;
        } else {
          // ── Commit new position ──────────────────────────────────────
          el.style.transform = 'none';
          el.style.top = `${toTop}px`;
          el.style.left = `${toLeft}px`;
          posTop = toTop;
          posLeft = toLeft;
          currentSection = targetId;
          isAnimating = false;

          const queued = jumpQueued;
          jumpQueued = null;

          if (queued && queued !== targetId) {
            // A new section was requested mid-flight — honor it after a short rest
            setTimeout(() => doJump(queued), 400);
          } else {
            applyState('idle');
            armSleepTimer();
            schedulePatrol();
            scheduleWander();
          }
          return;
        }

        rafId = requestAnimationFrame(frame);
      };

      rafId = requestAnimationFrame(frame);
    };

    // ── Bark / notice sequence ────────────────────────────────────────────
    const triggerNoticeAndBark = () => {
      if (
        isHovered ||
        dogStateLocal === 'barking' ||
        dogStateLocal === 'noticing' ||
        Date.now() - lastBarkTime < BARK_COOLDOWN_MS
      )
        return;

      applyState('noticing');
      setShowNoticeRef.current(true);
      if (sleepTimer) clearTimeout(sleepTimer);

      if (noticeTimer) clearTimeout(noticeTimer);
      noticeTimer = setTimeout(() => {
        setShowNoticeRef.current(false);
        applyState('barking');
        setShowBarkRef.current(true);
        playBark();
        lastBarkTime = Date.now();

        if (barkTimer) clearTimeout(barkTimer);
        barkTimer = setTimeout(() => {
          setShowBarkRef.current(false);
          if (!isHovered) {
            applyState('idle');
            armSleepTimer();
          }
        }, 1_000);
      }, 550);
    };

    // ── Quick Hop Animation ───────────────────────────────────────────────
    const doHop = () => {
      // Don't interrupt a big section jump or walk
      if (isAnimating) return;
      const el = wrapperRef.current;
      if (!el) return;

      const hopDuration = 350; // ms
      const hopHeight = 35; // px
      const start = performance.now();

      const frame = (now: number) => {
        // Abort if a section jump started
        if (isAnimating) {
          el.style.transform = 'none';
          return;
        }
        const elapsed = now - start;
        if (elapsed < hopDuration) {
          const t = elapsed / hopDuration;
          const y = -hopHeight * Math.sin(t * Math.PI);
          el.style.transform = `translateY(${y}px)`;
          rafId = requestAnimationFrame(frame);
        } else {
          el.style.transform = 'none';
        }
      };
      rafId = requestAnimationFrame(frame);
    };

    // ── Event handlers (exposed via refs so JSX can call them) ────────────
    onClickRef.current = () => {
      if (dogStateLocal === 'sleeping') {
        applyState('idle');
        armSleepTimer();
      }
      const now = Date.now();
      if (now - lastBarkTime > 1_500) {
        playBark();
        lastBarkTime = now;
        applyState('barking');
        setShowBarkRef.current(true);
        doHop();
        if (barkTimer) clearTimeout(barkTimer);
        barkTimer = setTimeout(() => {
          setShowBarkRef.current(false);
          if (!isHovered) applyState('idle');
        }, 900);
      }
    };

    onEnterRef.current = () => {
      isHovered = true;
      if (!isAnimating) applyState('hoveredPause');
      if (sleepTimer) clearTimeout(sleepTimer);
      if (patrolTimer) clearTimeout(patrolTimer);
    };

    onLeaveRef.current = () => {
      isHovered = false;
      if (!isAnimating) {
        applyState('idle');
        armSleepTimer();
        if (!patrolTimer) schedulePatrol();
        if (!wanderTimer) scheduleWander();
      }
    };

    // ── Cursor proximity (desktop only) ──────────────────────────────────
    let onMouseMove: ((e: MouseEvent) => void) | null = null;
    if (!isTouch) {
      onMouseMove = (e: MouseEvent) => {
        if (isHovered || isAnimating) return;
        const el = dogRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
        if (dist < PROXIMITY_PX) triggerNoticeAndBark();
      };
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    // ── Initialize ────────────────────────────────────────────────────────
    const init = setTimeout(() => {
      const startPos = getSectionPos('hero');
      const el = wrapperRef.current;
      if (!startPos || !el) return;

      el.style.top = `${startPos.top}px`;
      el.style.left = `${startPos.left}px`;
      posTop = startPos.top;
      posLeft = startPos.left;
      currentSection = 'hero';

      setVisibleRef.current(true);
      applyState('idle');
      armSleepTimer();
      schedulePatrol();
      scheduleWander();
    }, 600); // small delay lets layout settle after loading screen exits

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      clearTimeout(init);
      clearAllTimers();
      if (onMouseMove) window.removeEventListener('mousemove', onMouseMove);
    };
  }, []); // ← intentionally empty: the effect owns its entire lifecycle

  // ── JSX ────────────────────────────────────────────────────────────────
  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 25,
        transformOrigin: 'bottom center',
        willChange: 'transform, top, left',
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    >
      {/* Interactive inner shell — pointer-events re-enabled here only */}
      <div
        ref={dogRef}
        style={{
          pointerEvents: 'auto',
          cursor: 'pointer',
          position: 'relative',
        }}
        onClick={() => onClickRef.current()}
        onMouseEnter={() => onEnterRef.current()}
        onMouseLeave={() => onLeaveRef.current()}
        title="Click me!"
      >
        {/* Speech bubbles */}
        {showBark && (
          <div className="pixel-pet-speech-bark">
            <span>woof!</span>
          </div>
        )}
        {showNotice && (
          <div className="pixel-pet-speech-notice">
            <span>!</span>
          </div>
        )}

        {/* Flip wrapper for direction */}
        <div
          style={{
            transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
            transition: 'transform 0.15s ease',
          }}
        >
          <div
            className={`pixel-pet-body pixel-pet-${dogState}`}
            style={{ width: DOG_W, height: DOG_H, position: 'relative' }}
          >
            {/* Zzz float */}
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

// ─── Dog SVG ─────────────────────────────────────────────────────────────────
const DogSvg = ({ state }: { state: DogState }) => {
  const isSleeping = state === 'sleeping';
  const isAlert = state === 'noticing' || state === 'barking';
  const isJumping = state === 'jumping';

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

      {/* Ears */}
      <g className="pixel-pet-ears">
        <rect x="10" y="3" width="2" height="2" fill="currentColor" />
        <rect x="13" y="3" width="2" height="2" fill="currentColor" />
      </g>

      {/* Eyes open */}
      {!isSleeping && (
        <g>
          <rect x="10" y="6" width="1" height={isAlert ? 2 : 1} fill="white" />
          <rect x="13" y="6" width="1" height={isAlert ? 2 : 1} fill="white" />
        </g>
      )}

      {/* Eyes closed (sleeping / mid-jump squint) */}
      {(isSleeping || isJumping) && (
        <g>
          <rect
            x="10"
            y="7"
            width="1"
            height="1"
            fill="white"
            opacity={isJumping ? 0.5 : 1}
          />
          <rect
            x="13"
            y="7"
            width="1"
            height="1"
            fill="white"
            opacity={isJumping ? 0.5 : 1}
          />
        </g>
      )}

      {/* Nose highlight when alert */}
      {isAlert && (
        <rect x="14" y="9" width="1" height="1" fill="white" opacity="0.7" />
      )}

      {/* Legs */}
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

export default PixelPet;
