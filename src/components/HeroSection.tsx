import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { playClick, playHover } from '@/hooks/useSoundEffects';
import { useScrambleText } from '@/hooks/useScrambleText';
import {
  Github,
  Linkedin,
  Mail,
  ChevronDown,
  InstagramIcon,
  BookOpen,
  Eye,
  Download,
} from 'lucide-react';
import Magnetic from './Magnetic';
import { PROFILE, SOCIAL_LINKS } from '@/data/constants';
import { gsap } from '@/lib/gsap';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import ResumeModal from './ResumeModal';

const roles = [
  'Vibe Coder',
  'React Engineer',
  'Blockchain Builder',
  'Full-Stack Creator',
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  instagram: InstagramIcon,
  blog: BookOpen,
  email: Mail,
};

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const assembleCanvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  // Scramble for hero name — fires after pixel assembly settles
  const { ref: scrambleLine1Ref, scramble: scrambleLine1 } =
    useScrambleText<HTMLDivElement>({ duration: 600, fps: 30 });
  const { ref: scrambleLine2Ref, scramble: scrambleLine2 } =
    useScrambleText<HTMLDivElement>({ duration: 500, fps: 30 });

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // ── Pixel Particle Assembly — hero name flies in from screen edges ──
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

    const PARTICLE_COUNT = 90;
    const ASSEMBLE_DURATION = 1300; // ms
    const FADE_DURATION = 220;

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

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => {
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
      const spread = 200;
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
        const t = Math.min((now - start) / ASSEMBLE_DURATION, 1);

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
        const ft = Math.min((now - fadeStart) / FADE_DURATION, 1);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── GSAP Hero Entrance Timeline ──
  useGSAPContext(
    () => {
      // On mobile/tablet: skip the 1.65s wait (no particle assembly)
      // On desktop: wait for particle assembly to finish (~1.6s)
      const isMobileOrTablet = window.innerWidth <= 1024;
      const tl = gsap.timeline({ delay: isMobileOrTablet ? 0.4 : 1.65 });

      // Typewriter container
      tl.from('.gsap-role', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
      });

      // Tech tags stagger — use opacity+y only (no scale on flex span children)
      tl.from(
        '.gsap-tag',
        {
          opacity: 0,
          y: 18,
          stagger: 0.07,
          duration: 0.55,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        },
        '-=0.3',
      );

      // Social icons pop in
      tl.from(
        '.gsap-social',
        {
          opacity: 0,
          scale: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: 'back.out(2)',
        },
        '-=0.2',
      );

      // Resume button slides up
      tl.from(
        '.gsap-resume',
        { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out' },
        '-=0.3',
      );

      // Corner decorations
      tl.from(
        '.gsap-corner',
        {
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.5',
      );

      // Scroll chevron
      tl.from('.gsap-chevron', { opacity: 0, y: -10, duration: 0.6 }, '-=0.3');
    },
    heroRef,
    [],
  );

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const currentRole = roles[roleIndex];
    const typeSpeed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentRole.slice(0, displayText.length + 1));
        if (displayText.length === currentRole.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentRole.slice(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  // Matrix-style rain effect — runs on all screen sizes with perf tiering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    const w = window.innerWidth;
    const isPhone = w <= 480;
    const isTablet = w > 480 && w <= 1024;
    const isDesktop = w > 1024;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // ── Performance tiers ──────────────────────────────────────────
    // Phone:   12 columns, 15fps, tiny chars, DPR capped at 1
    // Tablet:  20 columns, 20fps, medium chars, DPR capped at 1
    // Desktop: full columns, 33fps, full char set, native DPR
    const dpr = isDesktop ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    const COLS    = isPhone ? 12 : isTablet ? 20 : 0; // 0 = auto on desktop
    const FPS     = isPhone ? 15 : isTablet ? 20 : 33;
    const FRAME_MS = 1000 / FPS;

    // Minimal char set on mobile for faster Math.random index lookups
    const chars = isPhone
      ? '01アイウエオカキクケコ'
      : isTablet
        ? '01{}[]アイウ/*#=+-'
        : '01{}[]<>/*#=+-;:.abcdefghijklmnopqrstuvwxyz';

    const fontSize = isPhone ? 12 : isTablet ? 13 : 14;

    const setSize = () => {
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      canvas.width  = cssW * dpr;
      canvas.height = cssH * dpr;
      canvas.style.width  = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      if (dpr !== 1) ctx.scale(dpr, dpr);
    };
    setSize();

    // Column stride — auto on desktop, fixed count on mobile/tablet
    const colStride = COLS > 0
      ? Math.floor(window.innerWidth / COLS)
      : fontSize;
    const columns = COLS > 0 ? COLS : Math.floor(window.innerWidth / colStride);

    interface Drop { y: number; depth: number; speed: number }
    const drops: Drop[] = Array.from({ length: columns }, () => ({
      y: Math.random() * -50,
      depth: Math.random(),
      speed: isPhone
        ? 0.6 + Math.random() * 0.8          // very slow on phone
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

      const cw = canvas.width  / dpr;
      const ch = canvas.height / dpr;

      // Fade trail — less transparent on mobile = faster visual reset
      ctx.fillStyle = isPhone
        ? 'rgba(255,255,255,0.10)'
        : isTablet
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(255,255,255,0.06)';
      ctx.fillRect(0, 0, cw, ch);

      const charLen = chars.length;
      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const char = chars[(Math.random() * charLen) | 0];
        const fSize = isPhone
          ? fontSize
          : fontSize * (0.5 + drop.depth * 0.7);
        const opacity = isPhone
          ? 0.18 + drop.depth * 0.25
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
    const onVisibility = () => { paused = document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    // ── Pause when hero is out of viewport (IntersectionObserver) ─
    let io: IntersectionObserver | null = null;
    const hero = canvas.parentElement;
    if (hero && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        ([entry]) => { paused = !entry.isIntersecting; },
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
  }, []);

  // Keep itemVariants for any remaining Framer Motion elements
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      ref={heroRef}
      className="min-h-screen flex flex-col justify-center items-center relative px-6 overflow-hidden pb-12"
    >
      {/* Matrix rain background */}
      <motion.canvas
        ref={canvasRef}
        style={{ y: y1 }}
        className="absolute inset-0 z-0 pointer-events-none opacity-60"
        aria-hidden="true"
      />

      {/* Pixel particle assembly canvas — full screen, above everything briefly */}
      <canvas
        ref={assembleCanvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          pointerEvents: 'none',
        }}
      />

      {/* Top-left code comment */}
      <div className="gsap-corner absolute top-28 left-6 md:left-10 z-10 hidden md:block">
        <p className="font-mono text-xs text-foreground/90 leading-relaxed font-medium">
          // portfolio.tsx
          <br />
          // version: 3.0.0
          <br />
          // status: production
          <br />
          // last_build: {new Date().toISOString().split('T')[0]}
        </p>
      </div>

      {/* Top-right line numbers */}
      <div className="gsap-corner absolute top-28 right-6 md:right-10 z-10 hidden md:block">
        <p className="font-mono text-xs text-foreground/80 leading-relaxed text-right font-medium">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="block">
              {String(i + 1).padStart(3, '0')}
            </span>
          ))}
        </p>
      </div>

      {/* Main content */}
      <div className="text-center relative z-10 pt-24 md:pt-20">
        {/* Name — GSAP animates each line */}
        <h1
          ref={nameRef}
          className="heading-brutal leading-[0.85] overflow-hidden"
          style={{ fontSize: 'clamp(65px, 13vw, 140px)' }}
        >
          <div
            ref={scrambleLine1Ref}
            className="gsap-name-line glitch-text"
            data-text="Durga Vara"
          >
            Durga Vara
          </div>
          <br />
          <div
            ref={scrambleLine2Ref}
            className="gsap-name-line glitch-text"
            data-text="Prasad."
          >
            <span className="text-foreground/20">Prasad.</span>
          </div>
        </h1>

        {/* Typewriter role */}
        <div className="gsap-role mt-6 h-8 flex items-center justify-center">
          <span className="font-mono text-xs md:text-sm tracking-[0.2em] text-foreground/50">
            {'< '}
          </span>
          <span className="font-mono text-xs md:text-sm tracking-[0.15em] text-foreground/70 font-medium">
            {displayText}
          </span>
          <span
            className={`font-mono text-xs md:text-sm text-foreground/70 ${
              cursorVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            |
          </span>
          <span className="font-mono text-xs md:text-sm tracking-[0.2em] text-foreground/50">
            {' />'}
          </span>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 justify-center mt-8 max-w-md mx-auto">
          {['Flutter', 'React', 'TypeScript', 'Firebase', 'AI', 'Node.js'].map(
            (tech) => (
              <span
                key={tech}
                className="gsap-tag inline-block px-3 py-1 font-mono text-xs border-2 border-foreground/40 text-foreground/80 font-medium tracking-wider hover:bg-foreground hover:text-background transition-colors duration-300 cursor-default rounded-none"
                onMouseEnter={playHover}
              >
                {tech}
              </span>
            ),
          )}
        </div>

        {/* Social links */}
        <div className="flex gap-4 justify-center mt-10">
          {SOCIAL_LINKS.map((link) => {
            const Icon = ICON_MAP[link.id];
            if (!Icon) return null;
            return (
              <div key={link.id} className="gsap-social">
                <Magnetic strength={0.3}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    onClick={playClick}
                    className="group relative inline-flex items-center justify-center p-3 border-2 border-black bg-white text-black transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-black hover:text-white rounded-none"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                </Magnetic>
              </div>
            );
          })}
        </div>

        {/* Resume buttons — View (opens modal) + Download */}
        <div className="gsap-resume mt-10 flex flex-wrap items-center justify-center gap-3">
          {/* Primary: View Resume */}
          <Magnetic strength={0.1}>
            <button
              onClick={() => {
                playClick();
                setIsResumeOpen(true);
              }}
              aria-label="View resume PDF preview"
              className="group relative inline-flex items-center gap-2 px-8 py-4 border-2 border-black bg-black text-white text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:bg-white hover:text-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none"
            >
              <Eye className="w-4 h-4" />
              <span>View Resume</span>
            </button>
          </Magnetic>

          {/* Secondary: Direct Download */}
          <Magnetic strength={0.1}>
            <a
              href="/resume.pdf"
              download="Durga_Vara_Prasad_Resume.pdf"
              onClick={playClick}
              aria-label="Download resume as PDF"
              className="group relative inline-flex items-center gap-2 px-6 py-4 border-2 border-black bg-white text-black text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] rounded-none"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </a>
          </Magnetic>
        </div>
      </div>

      {/* Resume PDF Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        resumeUrl="/resume.pdf"
        downloadName="Durga_Vara_Prasad_Resume.pdf"
      />

      {/* Bottom-left info */}
      <div className="gsap-corner absolute bottom-10 left-6 md:left-10 z-10">
        <span className="text-foreground text-xs tracking-[0.2em] uppercase font-mono font-medium">
          {PROFILE.website}
        </span>
      </div>

      {/* Bottom-right stats */}
      <div className="gsap-corner absolute bottom-10 right-6 md:right-10 z-10 hidden md:block">
        <div className="font-mono text-xs text-foreground text-right leading-relaxed font-medium">
          <p>const experience = "1+ years";</p>
          <p>const projects = 11;</p>
          <p>const passion = Infinity;</p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="gsap-chevron absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown className="w-5 h-5 text-foreground/60 animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;
