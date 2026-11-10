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
  Twitter,
} from 'lucide-react';
import Magnetic from './Magnetic';
import { PROFILE, SOCIAL_LINKS } from '@/data/constants';
import { PROJECT_COUNT } from '@/data/projects';
import { gsap } from '@/lib/gsap';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { useMatrixRain } from '@/hooks/useMatrixRain';
import { useParticleAssembly } from '@/hooks/useParticleAssembly';
import { useTypewriter } from '@/hooks/useTypewriter';
import ResumeModal from './ResumeModal';
import { useHalloween, useComic } from '@/context/ThemeContext';
import SpiderWeb from './halloween/SpiderWeb';
import ComicBurst from './comic/ComicBurst';
import ComicSpeechBubble from './comic/ComicSpeechBubble';
import ComicActionLines from './comic/ComicActionLines';

const roles = [
  'Full Stack Developer',
  'React.js Engineer',
  'MERN Stack Builder',
  'AI Systems Developer',
];

// Computed once at module load — never changes during the session
const BUILD_DATE = new Date().toISOString().split('T')[0];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  instagram: InstagramIcon,
  blog: BookOpen,
  email: Mail,
  x: Twitter,
};

const HeroSection = () => {
  const { isHalloween } = useHalloween();
  const { isComic } = useComic();
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
      id="hero"
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

      {isHalloween && (
        <div className="pointer-events-none">
          <SpiderWeb position="top-left" size={130} />
          <SpiderWeb position="top-right" size={140} />
        </div>
      )}

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
          {isHalloween && (
            <>
              <br />
              <span className="text-[#FF7518] font-bold">
                // edition: 🎃 halloween
              </span>
            </>
          )}
          {isComic && (
            <>
              <br />
              <span className="text-[#D9B45B] font-bold">
                // edition: 01 — retro comic press
              </span>
            </>
          )}
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

      {/* Illustrated Comic Panels & Mustard Gold Action Lines with Subtle Scroll Parallax */}
      {isComic && (
        <motion.div
          style={{ y: y2 }}
          className="absolute inset-0 pointer-events-none z-0"
          aria-hidden="true"
        >
          <ComicActionLines opacity={0.34} />
        </motion.div>
      )}

      {/* Main content */}
      <div className="text-center relative z-10 pt-24 md:pt-20">
        {/* Minimalist Comic Editorial Lead */}
        {isComic && (
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            <ComicSpeechBubble tail="bottom-left" color="white">
              <span className="text-[#B58B32]">◆</span>
              <span>CODE ARCHITECT // FULL STACK &amp; AI</span>
            </ComicSpeechBubble>
            <ComicBurst
              text="VOL. 01"
              size={48}
              color="gold"
              rotate={0}
              interactive={false}
            />
          </div>
        )}
        {/* Name — GSAP animates each line */}
        <h1
          ref={nameRef}
          className="heading-brutal leading-[0.85] overflow-hidden"
          style={{ fontSize: 'clamp(65px, 13vw, 140px)' }}
        >
          <div
            ref={scrambleLine1Ref}
            className={`gsap-name-line glitch-text ${
              isComic ? 'text-[#FFFFFF] drop-shadow-[3px_3px_0px_#888888]' : ''
            }`}
            data-text="Durga Vara"
          >
            Durga Vara
          </div>
          <br />
          <div
            ref={scrambleLine2Ref}
            className={`gsap-name-line glitch-text ${
              isComic ? 'text-[#D9B45B] drop-shadow-[3px_3px_0px_#B58B32]' : ''
            }`}
            data-text="Prasad."
          >
            <span className={isComic ? 'text-[#D9B45B]' : 'text-foreground/20'}>
              Prasad.
            </span>
          </div>
        </h1>

        {/* Semantic accessibility & search engine subtitle */}
        <h2 className="sr-only">
          Pappuri Durga Vara Prasad – Full Stack Developer, React.js Engineer,
          MERN Stack Developer, and AI Engineer in India.
        </h2>

        {/* Typewriter role - hidden from screen readers to prevent noise */}
        <div
          className="gsap-role mt-6 h-8 flex items-center justify-center"
          aria-hidden="true"
        >
          <span
            className={`font-mono text-xs md:text-sm tracking-[0.2em] ${
              isComic ? 'text-[#D9B45B]' : 'text-foreground/50'
            }`}
          >
            {'< '}
          </span>
          <span
            className={`font-mono text-xs md:text-sm tracking-[0.15em] font-medium ${
              isComic ? 'text-[#FFFFFF]' : 'text-foreground/70'
            }`}
          >
            {displayText}
          </span>
          <span
            className={`font-mono text-xs md:text-sm ${
              isComic ? 'text-[#D9B45B]' : 'text-foreground/70'
            } ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            |
          </span>
          <span
            className={`font-mono text-xs md:text-sm tracking-[0.2em] ${
              isComic ? 'text-[#D9B45B]' : 'text-foreground/50'
            }`}
          >
            {' />'}
          </span>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2.5 justify-center mt-8 max-w-lg mx-auto">
          {[
            'React.js',
            'TypeScript',
            'Node.js',
            'MERN Stack',
            'Generative AI',
            'Tailwind CSS',
          ].map((tech) => (
            <span
              key={tech}
              className={`gsap-tag inline-block px-3 py-1.5 font-mono text-xs border-2 tracking-wider transition-all duration-200 cursor-default rounded-none select-none ${
                isComic
                  ? 'border-[#FFFFFF] bg-[#D9D9D9] text-[#171717] font-bold shadow-[3px_3px_0px_#888888] hover:bg-[#D9B45B] hover:border-[#171717] hover:shadow-[4px_4px_0px_#B58B32] hover:-translate-y-0.5'
                  : 'border-foreground/40 text-foreground/80 font-bold hover:bg-foreground hover:text-background'
              }`}
              onMouseEnter={playHover}
            >
              {tech}
            </span>
          ))}
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
                    className={`group relative inline-flex items-center justify-center p-3 border-2 transition-all duration-200 rounded-none ${
                      isComic
                        ? 'border-[#171717] bg-[#FFFFFF] text-[#171717] shadow-[4px_4px_0px_#B58B32] hover:bg-[#D9B45B] hover:shadow-[5px_5px_0px_#FFFFFF] hover:-translate-y-0.5'
                        : 'border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-black hover:text-white'
                    }`}
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
              className={`group relative inline-flex items-center gap-2 px-8 py-4 border-2 text-sm font-black tracking-[0.2em] uppercase transition-all duration-200 rounded-none ${
                isComic
                  ? 'border-[#FFFFFF] bg-[#D9B45B] text-[#171717] shadow-[5px_5px_0px_0px_#B58B32] hover:bg-[#B58B32] hover:shadow-[6px_6px_0px_0px_#FFFFFF] hover:-translate-y-0.5'
                  : isHalloween
                    ? 'border-black bg-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:bg-white hover:text-black hover:shadow-[8px_8px_0px_0px_#FF7518]'
                    : 'border-black bg-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:bg-white hover:text-black hover:shadow-none'
              }`}
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
              className={`group relative inline-flex items-center gap-2 px-6 py-4 border-2 text-sm font-black tracking-[0.2em] uppercase transition-all duration-200 rounded-none ${
                isComic
                  ? 'border-[#D9D9D9] bg-[#171717] text-[#FFFFFF] shadow-[5px_5px_0px_0px_#888888] hover:border-[#D9B45B] hover:text-[#D9B45B] hover:shadow-[6px_6px_0px_0px_#B58B32] hover:-translate-y-0.5'
                  : 'border-black bg-white text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]'
              }`}
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
          <p>const projects = {PROJECT_COUNT};</p>
          <p>const passion = Infinity;</p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="gsap-chevron absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
        aria-hidden="true"
      >
        <ChevronDown
          className={`w-5 h-5 ${
            isComic
              ? 'text-[#D9B45B]'
              : 'text-foreground/60 animate-bounce'
          }`}
        />
      </div>
    </section>
  );
};

export default HeroSection;
