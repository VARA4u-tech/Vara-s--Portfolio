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
import { useMatrixRain } from '@/hooks/useMatrixRain';
import { useParticleAssembly } from '@/hooks/useParticleAssembly';
import { useTypewriter } from '@/hooks/useTypewriter';
import ResumeModal from './ResumeModal';

const roles = [
  'Vibe Coder',
  'React Engineer',
  'Blockchain Builder',
  'Full-Stack Creator',
];

// Computed once at module load — never changes during the session
const BUILD_DATE = new Date().toISOString().split('T')[0];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  instagram: InstagramIcon,
  blog: BookOpen,
  email: Mail,
};

const HeroSection = () => {
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
  useParticleAssembly(assembleCanvasRef, nameRef, scrambleLine1, scrambleLine2);

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

  // Typewriter effect
  const { displayText, cursorVisible } = useTypewriter(roles);

  // Matrix-style rain effect — runs on all screen sizes with perf tiering
  useMatrixRain(canvasRef);

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
        className="matrix-rain-canvas absolute inset-0 z-0 pointer-events-none opacity-60"
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
          // last_build: {BUILD_DATE}
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

        {/* Visually hidden text for screen readers */}
        <span className="sr-only">
          Roles: Vibe Coder, React Engineer, Blockchain Builder, Full-Stack
          Creator
        </span>

        {/* Typewriter role - hidden from screen readers to prevent noise */}
        <div
          className="gsap-role mt-6 h-8 flex items-center justify-center"
          aria-hidden="true"
        >
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
              href="/Durga_Vara_Prasad_Resume.pdf"
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
        resumeUrl="/Durga_Vara_Prasad_Resume.pdf"
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
      <div
        className="gsap-chevron absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
        aria-hidden="true"
      >
        <ChevronDown className="w-5 h-5 text-foreground/60 animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;
