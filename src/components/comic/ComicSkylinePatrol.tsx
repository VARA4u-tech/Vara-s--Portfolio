import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useComic } from '@/context/ThemeContext';

type HeroVariant = 'sentinel' | 'grappler' | 'skywing';

interface PatrolFlight {
  id: number;
  variant: HeroVariant;
  caption: string;
  startX: number;
  startY: number;
  midY: number;
  endX: number;
  endY: number;
  scale: number;
  duration: number;
  facingRight: boolean;
}

const CAPTION_BY_VARIANT: Record<HeroVariant, string[]> = {
  sentinel: ['WHOOSH!', 'UP & AWAY!', 'SONIC BOOM!'],
  grappler: ['THWIP!', 'ZIP!', 'SWING!'],
  skywing: ['ZOOM!', 'NYOOM!', 'LOCKED ON!'],
};

const VARIANTS: HeroVariant[] = ['sentinel', 'grappler', 'skywing'];

/**
 * Periodic aerial superhero silhouettes gliding across the upper Comic canvas.
 * Counterpart to Halloween's FlyingBats, using strict 6-color Noir Gold & Ink SVG art.
 */
export const ComicSkylinePatrol: React.FC = () => {
  const { isComic, prefersReducedMotion } = useComic();
  const [activePatrol, setActivePatrol] = useState<PatrolFlight | null>(null);
  const variantIndexRef = useRef(0);
  const cleanupTimerRef = useRef<number | null>(null);
  const activePatrolRef = useRef<boolean>(false);

  const launchPatrol = useCallback(() => {
    if (typeof window === 'undefined' || document.hidden) return;
    if (activePatrolRef.current) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 640;

    const variant = VARIANTS[variantIndexRef.current % VARIANTS.length];
    variantIndexRef.current += 1;

    const facingRight = Math.random() > 0.42;
    const captions = CAPTION_BY_VARIANT[variant];
    const caption = captions[Math.floor(Math.random() * captions.length)];

    const minY = isMobile ? 76 : 84;
    const maxY = Math.max(minY + 40, Math.min(vh * 0.34, 280));
    const startY = minY + Math.random() * (maxY - minY);
    const endY =
      variant === 'sentinel'
        ? Math.max(minY, startY - (40 + Math.random() * 55))
        : variant === 'grappler'
          ? Math.min(maxY + 40, startY + (Math.random() * 70 - 20))
          : startY + (Math.random() * 50 - 25);

    const midY =
      variant === 'grappler'
        ? (startY + endY) / 2 + (isMobile ? 48 : 76) // Deep pendulum swing dip
        : (startY + endY) / 2 - 22;

    const duration = isMobile
      ? 5.2 + Math.random() * 1.4
      : 6.2 + Math.random() * 1.8;

    const flight: PatrolFlight = {
      id: Date.now(),
      variant,
      caption,
      startX: facingRight ? -130 : vw + 130,
      startY,
      midY,
      endX: facingRight ? vw + 150 : -150,
      endY,
      scale: isMobile ? 0.72 : 0.92 + Math.random() * 0.16,
      duration,
      facingRight,
    };

    activePatrolRef.current = true;
    setActivePatrol(flight);

    if (cleanupTimerRef.current) {
      window.clearTimeout(cleanupTimerRef.current);
    }
    cleanupTimerRef.current = window.setTimeout(() => {
      activePatrolRef.current = false;
      setActivePatrol(null);
    }, (duration + 0.5) * 1000);
  }, []);

  useEffect(() => {
    if (!isComic || prefersReducedMotion) {
      activePatrolRef.current = false;
      setActivePatrol(null);
      return;
    }

    // Launch first hero flyby promptly after entering Comic theme
    const initialTimer = window.setTimeout(launchPatrol, 2600);
    // Repeat periodically without crowding reading flow
    const interval = window.setInterval(launchPatrol, 22000);

    const handleCustomPatrol = () => {
      launchPatrol();
    };
    window.addEventListener('comic-hero-patrol', handleCustomPatrol);

    return () => {
      activePatrolRef.current = false;
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
      window.removeEventListener('comic-hero-patrol', handleCustomPatrol);
      if (cleanupTimerRef.current) {
        window.clearTimeout(cleanupTimerRef.current);
      }
    };
  }, [isComic, prefersReducedMotion, launchPatrol]);

  if (!isComic || prefersReducedMotion) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none"
      aria-hidden="true"
    >
      <AnimatePresence>
        {activePatrol && (
          <motion.div
            key={activePatrol.id}
            className="absolute top-0 left-0 will-change-transform"
            initial={{
              x: activePatrol.startX,
              y: activePatrol.startY,
              opacity: 0,
              scale: activePatrol.scale,
            }}
            animate={{
              x: [
                activePatrol.startX,
                (activePatrol.startX + activePatrol.endX) / 2,
                activePatrol.endX,
              ],
              y: [activePatrol.startY, activePatrol.midY, activePatrol.endY],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: activePatrol.duration,
              ease: 'easeInOut',
            }}
          >
            <div className="relative flex items-center">
              {/* Flip silhouette cleanly along flight direction */}
              <div
                style={{
                  transform: activePatrol.facingRight
                    ? 'scaleX(1)'
                    : 'scaleX(-1)',
                }}
              >
                {activePatrol.variant === 'sentinel' && <SentinelFlyerSvg />}
                {activePatrol.variant === 'grappler' && <GrapplerSwingSvg />}
                {activePatrol.variant === 'skywing' && <SkyWingJetSvg />}
              </div>

              {/* Crisp editorial onomatopoeia micro-caption trailing behind */}
              <span
                className={`absolute -top-5 font-mono text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-[#D9B45B] text-[#171717] border border-[#171717] shadow-[2px_2px_0px_#FFFFFF] whitespace-nowrap ${
                  activePatrol.facingRight ? '-left-8 -rotate-6' : '-right-8 rotate-6'
                }`}
              >
                {activePatrol.caption}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/** 1. Caped Superhero Soaring Horizontally (Gold Cape + White Rim Contrast) */
const SentinelFlyerSvg: React.FC = () => (
  <svg
    width="96"
    height="54"
    viewBox="0 0 96 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Comic speed slipstream lines trailing behind */}
    <line
      x1="2"
      y1="18"
      x2="28"
      y2="18"
      stroke="#888888"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
    <line
      x1="6"
      y1="26"
      x2="34"
      y2="26"
      stroke="#D9B45B"
      strokeWidth="2"
      strokeLinecap="square"
    />
    <line
      x1="10"
      y1="35"
      x2="30"
      y2="35"
      stroke="#D9D9D9"
      strokeWidth="1.2"
      strokeLinecap="square"
    />

    {/* Billowing Mustard Gold Cape */}
    <g className="comic-cape-flutter">
      <path
        d="M54 22 L16 14 L24 27 L14 38 L52 30 Z"
        fill="#D9B45B"
        stroke="#171717"
        strokeWidth="2"
        strokeLinejoin="miter"
      />
      <path d="M50 25 L21 27 L17 34 L48 29 Z" fill="#B58B32" />
    </g>

    {/* Flying Legs & Gold Boots */}
    <path
      d="M36 28 L53 26 L53 32 L36 33 Z"
      fill="#171717"
      stroke="#FFFFFF"
      strokeWidth="1.6"
    />
    <path d="M31 28 L39 27 L39 33 L30 33 Z" fill="#D9B45B" stroke="#171717" strokeWidth="1.4" />

    {/* Armored Torso */}
    <path
      d="M51 22 L70 21 L72 29 L52 32 Z"
      fill="#171717"
      stroke="#FFFFFF"
      strokeWidth="1.8"
    />
    {/* Gold Chest Emblem & Belt */}
    <polygon points="62,23 66,25 62,28 59,25" fill="#D9B45B" />
    <rect x="52" y="24" width="3" height="6" fill="#D9B45B" />

    {/* Extended Hero Lead Punch Arm */}
    <path
      d="M68 21 L88 18 L89 23 L70 26 Z"
      fill="#171717"
      stroke="#FFFFFF"
      strokeWidth="1.6"
    />
    <rect x="83" y="18" width="6" height="5" fill="#D9B45B" stroke="#171717" strokeWidth="1.4" />

    {/* Hero Helmet & White Visor Slit */}
    <path
      d="M67 14 H79 L81 21 H68 Z"
      fill="#FFFFFF"
      stroke="#171717"
      strokeWidth="1.8"
    />
    <polygon points="69,14 73,9 75,14" fill="#D9B45B" stroke="#171717" strokeWidth="1.3" />
    <rect x="74" y="16" width="5" height="2" fill="#171717" />
  </svg>
);

/** 2. Acrobatic Vigilante Swinging From an Angled Grapple Line */
const GrapplerSwingSvg: React.FC = () => (
  <svg
    width="86"
    height="80"
    viewBox="0 0 86 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="overflow-visible"
  >
    {/* Taut diagonal grapple/web line ascending cleanly out of viewport */}
    <line
      x1="58"
      y1="32"
      x2="260"
      y2="-360"
      stroke="#D9D9D9"
      strokeOpacity="0.65"
      strokeWidth="1.4"
    />
    {/* Gold grapple wrist spark */}
    <polygon points="58,32 63,28 60,34" fill="#D9B45B" />

    {/* Curved comic swing motion arcs behind */}
    <path
      d="M10 50 Q 24 62 42 58"
      stroke="#D9B45B"
      strokeWidth="2"
      fill="none"
      strokeDasharray="10 4"
    />
    <path
      d="M14 58 Q 28 68 46 63"
      stroke="#888888"
      strokeWidth="1.3"
      fill="none"
    />

    {/* Trailing Acrobatic Scarf/Cape Accent */}
    <path
      d="M36 42 L18 46 L23 51 L38 47 Z"
      fill="#D9B45B"
      stroke="#171717"
      strokeWidth="1.6"
    />

    {/* Bent Swinging Legs */}
    <path
      d="M32 48 L22 57 L28 61 L37 52 Z"
      fill="#171717"
      stroke="#FFFFFF"
      strokeWidth="1.6"
    />
    <path
      d="M39 50 L46 60 L51 57 L44 47 Z"
      fill="#171717"
      stroke="#FFFFFF"
      strokeWidth="1.6"
    />

    {/* Tucked Vigilante Torso */}
    <path
      d="M35 39 L49 36 L52 48 L36 51 Z"
      fill="#171717"
      stroke="#FFFFFF"
      strokeWidth="1.8"
    />
    {/* Gold utility belt */}
    <rect
      x="36"
      y="46"
      width="13"
      height="3.5"
      transform="rotate(-12 36 46)"
      fill="#D9B45B"
    />

    {/* Upward Grapple Arm */}
    <path
      d="M46 37 L57 29 L60 33 L49 41 Z"
      fill="#171717"
      stroke="#FFFFFF"
      strokeWidth="1.6"
    />

    {/* Hooded/Masked Head with Bright Hero Eye Slits */}
    <circle
      cx="52"
      cy="37"
      r="7"
      fill="#171717"
      stroke="#FFFFFF"
      strokeWidth="1.8"
    />
    <polygon points="50,35 55,34 54,37" fill="#FFFFFF" />
    <polygon points="56,35 58,34 58,37" fill="#D9B45B" />
  </svg>
);

/** 3. Noir Bat-Wing / Retro Hero Sky-Interceptor Gliding */
const SkyWingJetSvg: React.FC = () => (
  <svg
    width="94"
    height="46"
    viewBox="0 0 94 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Dual Mustard Gold & Concrete thruster trails */}
    <line x1="2" y1="19" x2="27" y2="19" stroke="#D9B45B" strokeWidth="2.2" />
    <line x1="6" y1="27" x2="27" y2="27" stroke="#B58B32" strokeWidth="1.8" />
    <line x1="0" y1="23" x2="18" y2="23" stroke="#888888" strokeWidth="1.2" />

    {/* Swept Angular Hero Interceptor Body */}
    <polygon
      points="24,10 50,18 88,23 50,28 24,36 33,23"
      fill="#171717"
      stroke="#FFFFFF"
      strokeWidth="1.8"
      strokeLinejoin="miter"
    />
    {/* Inner concrete armor panel detail */}
    <polygon
      points="36,20 74,23 36,26 40,23"
      fill="#888888"
      fillOpacity="0.45"
    />
    {/* Crisp Mustard Gold Cockpit Canopy */}
    <polygon
      points="53,20 71,23 53,26"
      fill="#D9B45B"
      stroke="#FFFFFF"
      strokeWidth="1"
    />
    {/* Wingtip Gold Accents */}
    <polygon points="24,10 34,13 31,15" fill="#D9B45B" />
    <polygon points="24,36 34,33 31,31" fill="#D9B45B" />
  </svg>
);

export default ComicSkylinePatrol;
