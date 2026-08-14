import { useRef, useState, useEffect } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { gsap } from '@/lib/gsap';
import {
  Terminal,
  Cpu,
  Database,
  Globe,
  Layers,
  Wifi,
  Code,
  Braces,
} from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [canEnter, setCanEnter] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });

  // Track mouse position for custom white cursor
  useEffect(() => {
    const onMove = (e: MouseEvent) =>
      setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Calculate initial log count
  const isSmall =
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  const logCount = isSmall ? 4 : 8;
  const initialLogs = Array.from({ length: logCount }).map(
    () => 'WAITING_FOR_DATA_STREAM...',
  );

  const generateLogs = () => {
    const processes = [
      'MEM_ALLOC',
      'NODE_BOOT',
      'SYS_INIT',
      'REACT_MOUNT',
      'GSAP_TWEEN',
      'UI_RENDER',
      'DATA_FETCH',
      'AUTH_CHECK',
    ];
    return Array.from({ length: logCount }).map(
      (_, i) =>
        `0x${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0')
          .toUpperCase()} : ${processes[i]}`,
    );
  };

  const playEnterSound = () => {
    try {
      const audio = new Audio(`${import.meta.env.BASE_URL}loading-sound.mpeg`);
      audio.play().catch((e) => console.log('Audio playback blocked:', e));
    } catch (e) {
      console.log('Audio playback failed:', e);
    }
  };

  const handleEnter = () => {
    if (!canEnter) return;

    // Play the sci-fi enter sound
    playEnterSound();

    // Hide the button immediately
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: 'power2.in',
      });
    }

    // Exit sequence - push all text content up and fade out
    gsap.to('.content-wrapper', {
      yPercent: -15,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.inOut',
      force3D: true,
    });

    // Stagger the 4 vertical background columns up
    gsap.to('.bg-col', {
      yPercent: -100,
      duration: 1.2,
      stagger: 0.08,
      ease: 'expo.inOut',
      force3D: true,
      delay: 0.2,
      onComplete: () => {
        onComplete();
      },
    });
  };

  useGSAPContext(
    () => {
      // Attempt to play the custom audio (will only play if user has previously interacted)
      const audio = new Audio(`${import.meta.env.BASE_URL}loading-sound.mpeg`);
      audio.play().catch((e) => console.log('Audio autoplay blocked:', e));

      const tl = gsap.timeline({
        onComplete: () => {
          // Animation done — show the enter button
          setCanEnter(true);
          if (buttonRef.current) {
            gsap.fromTo(
              buttonRef.current,
              { opacity: 0, y: 20, scale: 0.95 },
              { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
            );
          }
        },
      });

      // 1. Initial short wait
      tl.to({}, { duration: 0.2 });

      // 2. Animate the counter (0 to 100) using a smooth GSAP ease
      const counter = { val: 0 };
      tl.to(
        counter,
        {
          val: 100,
          duration: 2.2,
          ease: 'power4.inOut',
          onUpdate: () => {
            const currentVal = Math.round(counter.val);

            // Direct DOM manipulation to avoid React re-renders for better performance
            if (counterRef.current) {
              counterRef.current.innerText = currentVal
                .toString()
                .padStart(3, '0');
            }

            // Update the tech logs rapidly, but not every single frame
            if (currentVal % 2 === 0 && logsContainerRef.current) {
              const newLogs = generateLogs();
              const logElements = logsContainerRef.current.children;
              for (let i = 0; i < newLogs.length; i++) {
                if (logElements[i]) {
                  (logElements[i] as HTMLElement).innerText = newLogs[i];
                }
              }
            }
          },
        },
        'start',
      );

      // 3. Stagger the main letters up from clipping masks
      tl.from(
        '.main-char',
        {
          y: '100%',
          duration: 1.2,
          stagger: 0.04,
          ease: 'expo.out',
          force3D: true,
        },
        'start+=0.2',
      );

      // 4. Fade in the small pixel/terminal details (HUD)
      tl.from(
        '.pixel-detail',
        {
          opacity: 0,
          y: 10,
          duration: 1,
          stagger: 0.1,
          ease: 'power2.out',
          force3D: true,
        },
        'start+=0.4',
      );

      // 5. Tech Icons DROP in (gravity/bounce effect)
      tl.from(
        '.tech-icon',
        {
          opacity: 0,
          y: -150,
          rotation: () => Math.random() * 60 - 30,
          duration: 1.5,
          stagger: 0.08,
          ease: 'bounce.out',
          force3D: true,
        },
        'start+=0.6',
      );

      // 6. Logs slide in
      tl.from(
        '.log-line',
        {
          opacity: 0,
          x: 20,
          duration: 0.6,
          stagger: 0.04,
          ease: 'power2.out',
          force3D: true,
        },
        'start+=0.5',
      );
    },
    containerRef,
    [],
  );

  // Helper to split text for GSAP staggering
  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="main-char inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999]"
      style={{ cursor: 'none' }}
    >
      {/* Custom white cursor — visible on dark loading background */}
      {cursorPos.x > 0 && (
        <div
          className="pointer-events-none fixed z-[10002]"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Outer ring */}
          <div
            className="absolute rounded-full border border-white/70"
            style={{
              width: 22,
              height: 22,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          {/* Inner dot */}
          <div
            className="absolute rounded-full bg-white"
            style={{
              width: 5,
              height: 5,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      )}
      {/* 4 Background Columns for cinematic transition */}
      <div className="absolute inset-0 flex w-full h-full">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-col flex-1 h-full bg-zinc-950 -ml-[2px] first:ml-0"
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="content-wrapper absolute inset-0 flex flex-col justify-between p-4 sm:p-8 lg:p-16 text-zinc-100 overflow-hidden">
        {/* Pixel Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* TOP HUD: Fills the empty space at the top */}
        <div className="relative z-10 w-full flex justify-between items-start font-mono text-[8px] sm:text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest sm:tracking-[0.2em] mb-4 lg:mb-0">
          <div className="flex flex-col gap-1 md:gap-2 pixel-detail">
            <span>SYS_VER: 1.0.4</span>
            <span className="hidden sm:inline">AUTH: VERIFIED</span>
          </div>
          <div className="flex flex-col items-end gap-1 md:gap-2 pixel-detail text-right">
            <span className="flex items-center justify-end gap-1.5 sm:gap-2 text-primary">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse" />
              SYS_ONLINE
            </span>
            <span className="hidden sm:inline">
              LAT: 17.3850 N, LON: 78.4867 E
            </span>
            <span className="sm:hidden">LAT: 17.3850 N</span>
          </div>
        </div>

        {/* Middle Body: Left Titles, Right Tech Data */}
        <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-start lg:items-center w-full mt-4 lg:mt-0 space-y-8 lg:space-y-0">
          {/* Left: Titles */}
          <div className="flex-1 flex flex-col justify-center w-full">
            <div className="overflow-hidden mb-1 md:mb-2">
              <div className="pixel-detail text-[10px] md:text-sm text-primary uppercase tracking-[0.2em] font-mono">
                [ INITIALIZING_SYSTEM_CORE ]
              </div>
            </div>

            <div className="overflow-hidden">
              <h1 className="text-[12vw] sm:text-[14vw] lg:text-[8rem] leading-none font-bold tracking-tighter uppercase font-sans">
                {splitText('VARA^S_')}
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1 className="text-[12vw] sm:text-[14vw] lg:text-[8rem] leading-none font-bold tracking-tighter uppercase font-sans text-zinc-500 flex items-center">
                {splitText('PORTFOLIO')}
                <span className="pixel-detail inline-block w-[0.2em] h-[0.7em] lg:w-[0.5em] lg:h-[0.8em] bg-white align-middle ml-2 lg:ml-4 animate-pulse" />
              </h1>
            </div>

            {/* Enter Button — Moved below the title for central visibility */}
            <div className="mt-8 sm:mt-12 pointer-events-none">
              <button
                ref={buttonRef}
                onClick={handleEnter}
                style={{ opacity: 0, pointerEvents: canEnter ? 'auto' : 'none' }}
                className="pointer-events-auto group flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-zinc-100 text-zinc-950 font-bold font-mono text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                [ ENTER_PORTFOLIO ]
              </button>
            </div>
          </div>

          {/* Right: Tech Details (Stacked on Mobile/Tablet, Row on Desktop) */}
          <div className="flex flex-col items-start lg:items-end justify-center w-full lg:w-1/3 lg:pr-8 space-y-6 lg:space-y-12">
            {/* Rapidly changing system logs */}
            <div
              ref={logsContainerRef}
              className="font-mono text-[9px] md:text-xs text-primary/60 tracking-[0.1em] md:tracking-[0.2em] leading-relaxed text-left lg:text-right opacity-80"
            >
              {initialLogs.map((log, i) => (
                <div key={i} className="log-line">
                  {log}
                </div>
              ))}
            </div>

            {/* Tech Icons Grid (8 columns on mobile/tablet, 4 on desktop) */}
            <div className="grid grid-cols-8 lg:grid-cols-4 gap-3 md:gap-6 text-zinc-400 w-full lg:w-auto">
              <Cpu className="tech-icon w-5 h-5 md:w-7 md:h-7" />
              <Database className="tech-icon w-5 h-5 md:w-7 md:h-7" />
              <Globe className="tech-icon w-5 h-5 md:w-7 md:h-7" />
              <Layers className="tech-icon w-5 h-5 md:w-7 md:h-7" />
              <Wifi className="tech-icon w-5 h-5 md:w-7 md:h-7" />
              <Code className="tech-icon w-5 h-5 md:w-7 md:h-7" />
              <Braces className="tech-icon w-5 h-5 md:w-7 md:h-7" />
              <Terminal className="tech-icon w-5 h-5 md:w-7 md:h-7" />
            </div>
          </div>
        </div>

        {/* Bottom Footer Area */}
        <div className="relative z-10 flex justify-between items-end w-full gap-2">
          <div className="flex flex-col items-start gap-2 md:gap-4 min-w-0 flex-shrink">
            <div className="overflow-hidden">
              <div className="pixel-detail text-[8px] sm:text-[10px] md:text-sm tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.3em] uppercase text-zinc-400 font-mono whitespace-nowrap">
                CREATIVE_DEVELOPER.exe
              </div>
            </div>
          </div>

          {/* Massive Percentage Counter */}
          <div className="text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12rem] leading-none font-bold tabular-nums tracking-tighter text-zinc-100 font-sans flex items-baseline flex-shrink-0">
            <span ref={counterRef}>000</span>
            <span className="text-base sm:text-2xl md:text-4xl lg:text-6xl text-zinc-600 ml-1 lg:ml-4 mb-1 lg:mb-8">
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
