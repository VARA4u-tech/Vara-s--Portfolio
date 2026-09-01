/**
 * PixelPet — Living website mascot.
 *
 * Architecture:
 *  - position: absolute within the page (scrolls with content, not fixed to viewport).
 *  - Single useEffect owns the entire state machine — avoids hook dep-cycle issues.
 *  - Patrols randomly between sections every 90 seconds.
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
// Dog size scales with viewport: larger on desktop, comfortably tappable on mobile
const getDogSize = () => {
  const vw = window.innerWidth;
  if (vw < 480) return 52; // phone — extra large for easy tap
  if (vw < 768) return 48; // tablet portrait
  return 44; // desktop
};
const BARK_COOLDOWN_MS = 12_000;
const PROXIMITY_PX = 150;
const SECTION_CHANGE_INTERVAL_MS = 90_000; // 90 seconds in each section
const SLEEP_AFTER_MS = 15_000;

// ─── Component ───────────────────────────────────────────────────────────────
const PixelPet = () => {
  // Only 6 pieces of React state — everything else lives in refs inside the
  // single useEffect to avoid hook dependency cycles.
  const [dogState, setDogState] = useState<DogState>('idle');
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [showBark, setShowBark] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dogSize, setDogSize] = useState(44); // responsive px size

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
  const setShowTipRef = useRef(setShowTip);
  const setVisibleRef = useRef(setVisible);
  const setDogSizeRef = useRef(setDogSize);

  // ── Main state-machine effect ───────────────────────────────────────────
  useEffect(() => {
    // ── Guards ──────────────────────────────────────────────────────────
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    const isTouch = window.matchMedia('(hover: none)').matches;
    const isSmall = () => window.innerWidth < 768; // phone / tablet portrait

    // ── Reactive dog size (recalculates on resize) ────────────────────────
    let DOG_W = getDogSize();
    let DOG_H = DOG_W;
    setDogSizeRef.current(DOG_W);

    // ── Local mutable state (lives inside the effect closure) ────────────
    let currentSection: SectionId | 'custom' = 'hero';
    let isAnimating = false;
    let isHovered = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartLeft = 0;
    let dragStartTop = 0;
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

    let hasGrabbedLocal = localStorage.getItem('site_pet_grabbed') === 'true';

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
      // Safe margins: larger on mobile so the dog clears the edge padding
      const safeL = isSmall() ? 16 : 24;
      const safeR = window.innerWidth - DOG_W - (isSmall() ? 16 : 24);
      const left = safeL + Math.random() * Math.max(0, safeR - safeL);
      return { top, left };
    };

    // Re-anchor the dog when the window is resized / orientation changes
    const onResize = () => {
      DOG_W = getDogSize();
      DOG_H = DOG_W;
      setDogSizeRef.current(DOG_W);

      if (!isAnimating) {
        // Clamp current left position to new viewport width
        const maxLeft = window.innerWidth - DOG_W - (isSmall() ? 16 : 24);
        if (posLeft > maxLeft) {
          posLeft = maxLeft;
          const el = wrapperRef.current;
          if (el) el.style.left = `${posLeft}px`;
        }
      }
    };
    window.addEventListener('resize', onResize, { passive: true });

    // ── Patrol scheduler ─────────────────────────────────────────────────
    const schedulePatrol = () => {
      if (patrolTimer) clearTimeout(patrolTimer);
      const delay = SECTION_CHANGE_INTERVAL_MS;
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

    // ── Continuous Walk Loop ──────────────────────────────────────────────
    // After each step the dog pauses briefly, then picks the next target and
    // walks again — creating nonstop natural movement within the section.
    // Calling startWalkLoop() or resumeWalkLoop() always re-enters safely.

    const startWalkLoop = () => {
      if (wanderTimer) clearTimeout(wanderTimer);
      // Small initial delay so the dog doesn't immediately start walking
      const initialDelay = 800 + Math.random() * 1_200;
      wanderTimer = setTimeout(doWalk, initialDelay);
    };

    const resumeWalkLoop = () => {
      if (
        isAnimating ||
        isHovered ||
        isDragging ||
        dogStateLocal === 'sleeping'
      )
        return;
      if (wanderTimer) clearTimeout(wanderTimer);
      // Pause between walks: 1–3 s
      const pauseMs = 1_000 + Math.random() * 2_000;
      wanderTimer = setTimeout(doWalk, pauseMs);
    };

    const doWalk = () => {
      // Interrupt guards
      if (isHovered || isDragging || dogStateLocal === 'sleeping') return;
      if (jumpQueued) return; // section jump is pending

      const el = wrapperRef.current;
      if (!el) return;

      // Pick target: bias toward the opposite edge so the dog actually
      // traverses the full width rather than clustering in the middle.
      const safeL = isSmall() ? 16 : 24;
      const safeR = window.innerWidth - DOG_W - (isSmall() ? 16 : 24);
      const range = Math.max(0, safeR - safeL);

      // Alternate between left-biased and right-biased targets for natural
      // back-and-forth feel; add jitter so it never looks mechanical.
      const leftBias = safeL + Math.random() * range * 0.35;
      const rightBias = safeR - Math.random() * range * 0.35;
      const targetLeft = posLeft < (safeL + safeR) / 2 ? rightBias : leftBias;

      const dx = targetLeft - posLeft;

      // Skip if nearly the same spot (can happen on very narrow screens)
      if (Math.abs(dx) < (isSmall() ? 15 : 30)) {
        resumeWalkLoop();
        return;
      }

      setDirectionRef.current(dx >= 0 ? 'right' : 'left');
      applyState('walking');
      isAnimating = true;
      if (sleepTimer) clearTimeout(sleepTimer);

      // Natural walking speed with slight randomness each step
      const dist = Math.abs(dx);
      const baseSpeed = isSmall() ? 38 : 50; // px/s
      const speed = baseSpeed * (0.85 + Math.random() * 0.3);
      const walkDuration = (dist / speed) * 1_000;
      const start = performance.now();

      const frame = (now: number) => {
        // Abort mid-walk if something more important happens
        if (isHovered || isDragging || dogStateLocal === 'sleeping') {
          el.style.transform = 'none';
          el.style.left = `${posLeft + dx * Math.min(1, (now - start) / walkDuration)}px`;
          posLeft = parseFloat(el.style.left);
          isAnimating = false;
          return;
        }

        const elapsed = now - start;
        if (elapsed < walkDuration) {
          const t = elapsed / walkDuration;
          el.style.transform = `translateX(${dx * t}px)`;
          rafId = requestAnimationFrame(frame);
        } else {
          // Commit final position
          el.style.transform = 'none';
          el.style.left = `${targetLeft}px`;
          posLeft = targetLeft;
          isAnimating = false;

          if (jumpQueued) {
            // A section jump was requested mid-walk — honour it now
            const q = jumpQueued;
            jumpQueued = null;
            doJump(q);
          } else {
            applyState('idle');
            armSleepTimer();
            resumeWalkLoop(); // immediately queue the next step
          }
        }
      };

      rafId = requestAnimationFrame(frame);
    };

    // ── Jump animation ────────────────────────────────────────────────────
    const doJump = (target: SectionId | { top: number; left: number }) => {
      if (isAnimating) {
        // Only queue section jumps, discard custom click jumps if busy
        if (typeof target === 'string') jumpQueued = target;
        return;
      }

      let targetPos: { top: number; left: number } | null = null;
      let targetId: SectionId | 'custom' = 'custom';

      if (typeof target === 'string') {
        targetPos = getSectionPos(target);
        targetId = target;
      } else {
        targetPos = target;
      }

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
      // Arc height: taller for long trips; capped lower on mobile (performance)
      const arcH = isSmall()
        ? Math.min(60 + dist * 0.15, 200)
        : Math.min(100 + dist * 0.28, 400);

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
            if (targetId !== 'custom') {
              schedulePatrol();
            } else {
              // If it was a custom click jump, wait a bit before resuming patrol
              setTimeout(() => schedulePatrol(), SECTION_CHANGE_INTERVAL_MS);
            }
            startWalkLoop(); // resume continuous walking in the new section
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
            resumeWalkLoop(); // continue walking after bark
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

      const T_RISE = 200; // ms going up
      const T_FALL = 160; // ms coming down
      const T_SQSH = 80; // ms squash on landing
      const T_SPRNG = 120; // ms spring back
      const T_TOTAL = T_RISE + T_FALL + T_SQSH + T_SPRNG;
      const hopHeight = 55; // px

      const start = performance.now();

      const frame = (now: number) => {
        if (isAnimating) {
          el.style.transform = 'none';
          return;
        }
        const e = now - start;

        if (e < T_RISE) {
          // Ease-out upward
          const t = 1 - Math.pow(1 - e / T_RISE, 2);
          el.style.transform = `translateY(${-hopHeight * t}px)`;
        } else if (e < T_RISE + T_FALL) {
          // Ease-in downward
          const t = (e - T_RISE) / T_FALL;
          const eased = t * t;
          el.style.transform = `translateY(${-hopHeight * (1 - eased)}px)`;
        } else if (e < T_RISE + T_FALL + T_SQSH) {
          // Landing squash
          const t = (e - T_RISE - T_FALL) / T_SQSH;
          const squashY = 1 - 0.3 * Math.sin(t * Math.PI);
          const squashX = 1 + 0.2 * Math.sin(t * Math.PI);
          el.style.transform = `scaleY(${squashY}) scaleX(${squashX})`;
        } else if (e < T_TOTAL) {
          // Spring recovery
          const t = (e - T_RISE - T_FALL - T_SQSH) / T_SPRNG;
          const eased = 1 - Math.pow(1 - t, 3);
          const scaleY = 0.7 + 0.3 * eased;
          const scaleX = 1.2 - 0.2 * eased;
          el.style.transform = `scaleY(${scaleY}) scaleX(${scaleX})`;
        } else {
          el.style.transform = 'none';
          return; // done — no more rAF
        }

        rafId = requestAnimationFrame(frame);
      };
      rafId = requestAnimationFrame(frame);
    };

    // ── Event handlers (exposed via refs so JSX can call them) ────────────
    onClickRef.current = () => {
      if (isDragging) return;
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
      if (!isDragging && dogStateLocal !== 'jumping' && !hasGrabbedLocal) {
        setShowTipRef.current(true);
      }
      if (!isAnimating) applyState('hoveredPause');
      if (sleepTimer) clearTimeout(sleepTimer);
      if (patrolTimer) clearTimeout(patrolTimer);
    };

    onLeaveRef.current = () => {
      isHovered = false;
      setShowTipRef.current(false);
      if (!isAnimating) {
        applyState('idle');
        armSleepTimer();
        if (!patrolTimer) schedulePatrol();
        resumeWalkLoop(); // restart continuous walking after hover
      }
    };

    // ── Touch: tap-to-bark (fire via onClickRef, but also support touchend) ──
    let onTouchEnd: ((e: TouchEvent) => void) | null = null;
    if (isTouch) {
      onTouchEnd = (e: TouchEvent) => {
        e.preventDefault(); // avoid ghost click delay
        onClickRef.current();
      };
      // Attach directly to the dogRef element
      const dogEl = dogRef.current;
      if (dogEl)
        dogEl.addEventListener('touchend', onTouchEnd, { passive: false });
    }

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

    // ── Drag & Drop ──────────────────────────────────────────────────────
    const onPointerMoveDrag = (e: PointerEvent) => {
      if (!isDragging) return;
      const el = wrapperRef.current;
      if (!el) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      el.style.left = `${dragStartLeft + dx}px`;
      el.style.top = `${dragStartTop + dy}px`;
    };

    const onPointerUpDrag = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      const el = wrapperRef.current;
      if (el) {
        el.style.transition = 'opacity 0.4s ease';
        posLeft = parseFloat(el.style.left || '0');
        posTop = parseFloat(el.style.top || '0');
      }
      window.removeEventListener('pointermove', onPointerMoveDrag);
      window.removeEventListener('pointerup', onPointerUpDrag);

      applyState('idle');
      armSleepTimer();
      schedulePatrol();
      resumeWalkLoop();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return; // Left click/touch only
      const target = e.target as HTMLElement;
      if (!target.closest('.pixel-pet-body')) return;

      isDragging = true;
      setShowTipRef.current(false);
      if (!hasGrabbedLocal) {
        hasGrabbedLocal = true;
        localStorage.setItem('site_pet_grabbed', 'true');
      }

      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragStartLeft = posLeft;
      dragStartTop = posTop;

      clearAllTimers();
      isAnimating = false;
      applyState('hoveredPause');

      const el = wrapperRef.current;
      if (el) {
        el.style.transition = 'none';
      }

      window.addEventListener('pointermove', onPointerMoveDrag);
      window.addEventListener('pointerup', onPointerUpDrag);
    };

    // Attach to window so we can catch drags even if cursor slips off
    const dogEl = dogRef.current;
    if (dogEl) {
      dogEl.addEventListener('pointerdown', onPointerDown);
      // Disable native drag behavior
      dogEl.addEventListener('dragstart', (e) => e.preventDefault());
    }

    // ── Follow Click ──────────────────────────────────────────────────────
    const onGlobalClick = (e: MouseEvent) => {
      if (isDragging || isHovered) return;
      const target = e.target as HTMLElement;
      // Ignore clicks on links, buttons, interactive elements, or the dog itself
      if (
        target.closest('button, a, input, textarea, select, [role="button"]') ||
        target.closest('.pixel-pet-body') ||
        target.closest('.pixel-pet-speech-bark') ||
        target.closest('.pixel-pet-speech-notice') ||
        target.closest('#mobile-nav-menu')
      ) {
        return;
      }

      const toLeft = e.clientX + window.scrollX - DOG_W / 2;
      const toTop = e.clientY + window.scrollY - DOG_H / 2;

      // Clear jump queue and initiate jump to custom pos
      jumpQueued = null;
      doJump({ top: toTop, left: toLeft });
    };
    window.addEventListener('click', onGlobalClick);

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
      startWalkLoop(); // begin continuous walking immediately

      // On touch devices, there's no "hover" to show the tooltip, so we show it briefly on first load
      if (isTouch && !hasGrabbedLocal) {
        setShowTipRef.current(true);
        setTimeout(() => setShowTipRef.current(false), 4000);
      }
    }, 600); // small delay lets layout settle after loading screen exits

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      clearTimeout(init);
      clearAllTimers();
      if (onMouseMove) window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('click', onGlobalClick);
      window.removeEventListener('pointermove', onPointerMoveDrag);
      window.removeEventListener('pointerup', onPointerUpDrag);

      if (dogEl) {
        if (onTouchEnd) dogEl.removeEventListener('touchend', onTouchEnd);
        dogEl.removeEventListener('pointerdown', onPointerDown);
      }
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
          touchAction: 'none',
        }}
        onClick={() => onClickRef.current()}
        onMouseEnter={() => onEnterRef.current()}
        onMouseLeave={() => onLeaveRef.current()}
        title="Click me!"
      >
        {/* Speech bubbles */}
        {showTip && !showBark && !showNotice && (
          <div
            className="pixel-pet-speech-bark"
            style={{ padding: '4px 10px', fontSize: '10px' }}
          >
            <span>Drag me!</span>
          </div>
        )}
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
            style={{ width: dogSize, height: dogSize, position: 'relative' }}
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
      {/* Belly Shading (semi-transparent black for depth) */}
      <rect
        x="2"
        y="10"
        width="7"
        height="2"
        fill="black"
        opacity="0.15"
        className="dark:opacity-30"
      />
      {/* Head */}
      <rect x="9" y="5" width="6" height="5" fill="currentColor" />
      {/* Snout Details */}
      <rect
        x="13"
        y="8"
        width="2"
        height="2"
        fill="black"
        opacity="0.1"
        className="dark:opacity-20"
      />
      <rect
        x="14"
        y="8"
        width="1"
        height="1"
        fill="black"
        opacity="0.5"
        className="dark:fill-white dark:opacity-80"
      />
      {/* Ears */}
      <g className="pixel-pet-ears">
        <rect x="10" y="3" width="2" height="2" fill="currentColor" />
        <rect x="13" y="3" width="2" height="2" fill="currentColor" />
        {/* Inner Ear shading */}
        <rect
          x="10"
          y="3"
          width="1"
          height="2"
          fill="black"
          opacity="0.2"
          className="dark:opacity-40"
        />
        <rect
          x="13"
          y="3"
          width="1"
          height="2"
          fill="black"
          opacity="0.2"
          className="dark:opacity-40"
        />
      </g>
      {/* Collar (Red) */}
      <rect x="7" y="7" width="2" height="5" fill="#ef4444" />
      <rect x="8" y="9" width="1" height="1" fill="#fbbf24" />{' '}
      {/* Collar Tag */}
      {/* Eyes open */}
      {!isSleeping && (
        <g>
          <rect
            x="10"
            y="6"
            width="1"
            height={isAlert ? 2 : 1}
            fill="white"
            className="dark:fill-black"
          />
          <rect
            x="13"
            y="6"
            width="1"
            height={isAlert ? 2 : 1}
            fill="white"
            className="dark:fill-black"
          />
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
            className="dark:fill-black"
            opacity={isJumping ? 0.5 : 1}
          />
          <rect
            x="13"
            y="7"
            width="1"
            height="1"
            fill="white"
            className="dark:fill-black"
            opacity={isJumping ? 0.5 : 1}
          />
        </g>
      )}
      {/* Nose highlight when alert */}
      {isAlert && (
        <rect
          x="14"
          y="9"
          width="1"
          height="1"
          fill="white"
          opacity="0.7"
          className="dark:fill-black"
        />
      )}
      {/* Legs */}
      <g className="pixel-pet-legs-standing">
        <rect x="3" y="12" width="2" height="2" fill="currentColor" />
        <rect x="6" y="12" width="2" height="2" fill="currentColor" />
        {/* Shadow on back legs */}
        <rect
          x="2"
          y="11"
          width="2"
          height="2"
          fill="black"
          opacity="0.2"
          className="dark:opacity-40"
        />
      </g>
      <g className="pixel-pet-legs-walking">
        <rect x="2" y="12" width="2" height="2" fill="currentColor" />
        <rect x="7" y="12" width="2" height="2" fill="currentColor" />
        <rect
          x="1"
          y="11"
          width="2"
          height="2"
          fill="black"
          opacity="0.2"
          className="dark:opacity-40"
        />
      </g>
    </svg>
  );
};

export default PixelPet;
