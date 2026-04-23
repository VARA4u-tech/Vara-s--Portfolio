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

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

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

    dropObjects.forEach(drop => {
      drop.speed = 1 + drop.depth * 2;
    });

    let lastFrameTime = 0;
    const frameInterval = 50; 
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
        const opacity = 0.03 + drop.depth * 0.12;
        
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] },
    },
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative px-6 overflow-hidden pb-12">
      <motion.canvas
        ref={canvasRef}
        style={{ y: y1 }}
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
        aria-hidden="true"
      />

      {/* Background decoration */}
      <motion.div 
        style={{ y: y2, opacity }}
        className="absolute top-[15%] left-[5%] text-[15vw] font-bold text-foreground/5 pointer-events-none z-0 hidden lg:block"
      >
        DURGA.
      </motion.div>

      {/* Top-left code comment */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute top-28 left-6 md:left-10 z-10 hidden md:block"
      >
        <p className="font-mono text-xs text-foreground/90 leading-relaxed font-medium">
          // portfolio.tsx
          <br />
          // version: 3.0.0
          <br />
          // status: production
          <br />
          // last_build: {new Date().toISOString().split('T')[0]}
        </p>
      </motion.div>

      {/* Top-right line numbers */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute top-28 right-6 md:right-10 z-10 hidden md:block"
      >
        <p className="font-mono text-xs text-foreground/80 leading-relaxed text-right font-medium">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="block">
              {String(i + 1).padStart(3, '0')}
            </span>
          ))}
        </p>
      </motion.div>

      {/* Main content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        className="text-center relative z-10 pt-24 md:pt-20"
      >
        {/* Name */}
        <motion.h1
          variants={itemVariants}
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
        </motion.h1>

        {/* Typewriter role */}
        <motion.div variants={itemVariants} className="mt-6 h-8 flex items-center justify-center">
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
        </motion.div>

        {/* Tech tags */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-2 justify-center mt-8 max-w-md mx-auto">
          {[
            'Flutter',
            'React',
            'TypeScript',
            'Firebase',
            'Blockchain',
            'Node.js',
          ].map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="px-3 py-1 font-mono text-xs border-2 border-foreground/40 text-foreground/80 font-medium tracking-wider hover:bg-foreground hover:text-background transition-all duration-300 cursor-default rounded-none"
              onMouseEnter={playHover}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {/* Social links */}
        <motion.div variants={itemVariants} className="flex gap-4 justify-center mt-10">
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
        </motion.div>

        {/* Resume button */}
        <motion.div variants={itemVariants} className="mt-10">
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
        </motion.div>
      </motion.div>

      {/* Bottom-left info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-6 md:left-10 z-10"
      >
        <span className="text-foreground text-xs tracking-[0.2em] uppercase font-mono font-medium">
          {PROFILE.website}
        </span>
      </motion.div>

      {/* Bottom-right stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 right-6 md:right-10 z-10 hidden md:block"
      >
        <div className="font-mono text-xs text-foreground text-right leading-relaxed font-medium">
          <p>const experience = "2+ years";</p>
          <p>const projects = 10;</p>
          <p>const passion = Infinity;</p>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
      >
        <ChevronDown className="w-5 h-5 text-foreground/60 animate-bounce" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
