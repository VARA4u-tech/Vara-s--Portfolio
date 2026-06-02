import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { playClick, playHover } from '@/hooks/useSoundEffects';
import {
  Github,
  Linkedin,
  Mail,
  ChevronDown,
  InstagramIcon,
  BookOpen,
} from 'lucide-react';
import Magnetic from './Magnetic';
import { PROFILE, SOCIAL_LINKS } from '@/data/constants';
import { gsap } from '@/lib/gsap';
import { useGSAPContext } from '@/hooks/useGSAPContext';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // ── GSAP Hero Entrance Timeline ──
  useGSAPContext(
    () => {
      const tl = gsap.timeline({ delay: 0.1 });

      // Split name letters into spans for stagger
      const nameLines = heroRef.current?.querySelectorAll('.gsap-name-line');
      if (nameLines && nameLines.length > 0) {
        tl.from(nameLines, {
          opacity: 0,
          y: 80,
          skewY: 4,
          stagger: 0.12,
          duration: 1,
          ease: 'power4.out',
        });
      }

      // Typewriter container
      tl.from(
        '.gsap-role',
        { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' },
        '-=0.4',
      );

      // Tech tags stagger
      tl.from(
        '.gsap-tag',
        {
          opacity: 0,
          scale: 0.7,
          y: 10,
          stagger: 0.07,
          duration: 0.5,
          ease: 'back.out(1.7)',
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

  // Matrix-style rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = '01{}[]<>/*#=+-;:.abcdefghijklmnopqrstuvwxyz';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    const dropObjects = Array.from({ length: columns }, () => ({
      y: Math.random() * -100,
      depth: Math.random(),
      speed: 0,
      char: '',
    }));

    dropObjects.forEach((drop) => {
      drop.speed = 1.5 + drop.depth * 3.5;
    });

    let lastFrameTime = 0;
    const frameInterval = 30;
    let animationId: number;

    const draw = (timestamp: number) => {
      animationId = requestAnimationFrame(draw);

      if (timestamp - lastFrameTime < frameInterval) return;
      lastFrameTime = timestamp;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      dropObjects.forEach((drop, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const currentFontSize = fontSize * (0.5 + drop.depth * 0.7);
        const opacity = 0.05 + drop.depth * 0.25;

        ctx.font = `${currentFontSize}px monospace`;
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 1.5})`;
        ctx.fillText(char, i * fontSize, drop.y * fontSize);

        if (drop.y > 1) {
          const trailChar = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
          ctx.fillText(trailChar, i * fontSize, (drop.y - 1) * fontSize);
        }

        drop.y += drop.speed;

        if (drop.y * fontSize > canvas.height && Math.random() > 0.97) {
          drop.y = -5;
          drop.depth = Math.random();
          drop.speed = 1 + drop.depth * 2;
        }
      });
    };

    animationId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
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
      <motion.canvas
        ref={canvasRef}
        style={{ y: y1 }}
        className="absolute inset-0 z-0 pointer-events-none opacity-60"
        aria-hidden="true"
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
          className="heading-brutal leading-[0.85] overflow-hidden"
          style={{ fontSize: 'clamp(65px, 13vw, 140px)' }}
        >
          <div className="gsap-name-line glitch-text" data-text="Durga Vara">
            Durga Vara
          </div>
          <br />
          <div className="gsap-name-line glitch-text" data-text="Prasad.">
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
                className="gsap-tag px-3 py-1 font-mono text-xs border-2 border-foreground/40 text-foreground/80 font-medium tracking-wider hover:bg-foreground hover:text-background transition-all duration-300 cursor-default rounded-none"
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

        {/* Resume button */}
        <div className="gsap-resume mt-10">
          <Magnetic strength={0.1}>
            <a
              href="/resume.pdf"
              download="Durga_Vara_Prasad_Resume.pdf"
              onClick={playClick}
              className="group relative inline-flex items-center gap-2 px-8 py-4 border-2 border-black bg-black text-white text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:bg-white hover:text-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none"
            >
              <span>Download Resume</span>
              <span className="w-2 h-2 border-r-2 border-b-2 border-current rotate-45 -translate-y-[1px] group-hover:translate-y-[1px] transition-transform duration-300"></span>
            </a>
          </Magnetic>
        </div>
      </div>

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
