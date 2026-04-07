import { useState, useEffect, useRef } from 'react';
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

const roles = [
  'Flutter Developer',
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

  // Matrix-style rain effect using requestAnimationFrame + prefers-reduced-motion check
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip animation for users who prefer reduced motion
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
    
    // Structure each drop with depth data
    const dropObjects = Array.from({ length: columns }, () => ({
      y: Math.random() * -100,
      depth: Math.random(), // 0 to 1
      speed: 0,
      char: '',
    }));

    // Initialize speeds based on depth
    dropObjects.forEach(drop => {
      drop.speed = 1 + drop.depth * 2; // Further is slower
    });

    let lastFrameTime = 0;
    const frameInterval = 50; 
    let animationId: number;

    const draw = (timestamp: number) => {
      animationId = requestAnimationFrame(draw);

      if (timestamp - lastFrameTime < frameInterval) return;
      lastFrameTime = timestamp;

      // Clear with slight trail
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      dropObjects.forEach((drop, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Depth-based styles
        const currentFontSize = fontSize * (0.5 + drop.depth * 0.7);
        const opacity = 0.03 + drop.depth * 0.12;
        
        ctx.font = `${currentFontSize}px monospace`;
        
        // Lead character
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 1.5})`;
        ctx.fillText(char, i * fontSize, drop.y * fontSize);

        // Trail character
        if (drop.y > 1) {
          const trailChar = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
          ctx.fillText(trailChar, i * fontSize, (drop.y - 1) * fontSize);
        }

        // Move and reset
        drop.y += drop.speed;
        
        if (drop.y * fontSize > canvas.height && Math.random() > 0.97) {
          drop.y = -5;
          drop.depth = Math.random(); // Randomize depth for next pass
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

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative px-6 overflow-hidden pb-12">
      {/* Matrix rain canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Top-left code comment */}
      <div className="absolute top-28 left-6 md:left-10 z-10 hidden md:block">
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
      <div className="absolute top-28 right-6 md:right-10 z-10 hidden md:block">
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
        {/* Name */}
        <h1
          className="heading-brutal leading-[0.85]"
          style={{ fontSize: 'clamp(65px, 13vw, 140px)' }}
        >
          <div className="glitch-text" data-text="Durga Vara">
            Durga Vara
          </div>
          <br />
          <div className="glitch-text" data-text="Prasad.">
            <span className="text-foreground/20">Prasad.</span>
          </div>
        </h1>

        {/* Typewriter role */}
        <div className="mt-6 h-8 flex items-center justify-center">
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
          {[
            'Flutter',
            'React',
            'TypeScript',
            'Firebase',
            'Blockchain',
            'Node.js',
          ].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 font-mono text-xs border-2 border-foreground/40 text-foreground/80 font-medium tracking-wider hover:bg-foreground hover:text-background transition-all duration-300 cursor-default rounded-none"
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
              <Magnetic key={link.id} strength={0.3}>
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
            );
          })}
        </div>

        {/* Resume button */}
        <div className="mt-10">
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
      <div className="absolute bottom-10 left-6 md:left-10 z-10">
        <span className="text-foreground text-xs tracking-[0.2em] uppercase font-mono font-medium">
          {PROFILE.website}
        </span>
      </div>

      {/* Bottom-right stats */}
      <div className="absolute bottom-10 right-6 md:right-10 z-10 hidden md:block">
        <div className="font-mono text-xs text-foreground text-right leading-relaxed font-medium">
          <p>const experience = "2+ years";</p>
          <p>const projects = 10;</p>
          <p>const passion = Infinity;</p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown className="w-5 h-5 text-foreground/60 animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;
