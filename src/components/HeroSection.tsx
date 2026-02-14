import { useState, useEffect, useRef } from "react";
import { Github, Linkedin, Twitter, Mail, ChevronDown } from "lucide-react";

const roles = [
  "Flutter Developer",
  "React Engineer",
  "Blockchain Builder",
  "Full-Stack Creator",
];

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
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

  // Matrix-style rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "01{}[]<>/*#=+-;:.abcdefghijklmnopqrstuvwxyz";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];

        // Lead character — brighter
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Trail character — slightly dimmer
        if (drops[i] > 1) {
          const trailChar = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
          ctx.fillText(trailChar, i * fontSize, (drops[i] - 1) * fontSize);
        }

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.97) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 60);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative px-6 overflow-hidden">
      {/* Matrix rain canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* Top-left code comment */}
      <div className="absolute top-28 left-6 md:left-10 z-10 hidden md:block">
        <p className="font-mono text-xs text-foreground/60 leading-relaxed font-medium">
          // portfolio.tsx
          <br />
          // version: 3.0.0
          <br />
          // status: production
          <br />
          // last_build: {new Date().toISOString().split("T")[0]}
        </p>
      </div>

      {/* Top-right line numbers */}
      <div className="absolute top-28 right-6 md:right-10 z-10 hidden md:block">
        <p className="font-mono text-xs text-foreground/40 leading-relaxed text-right font-medium">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="block">
              {String(i + 1).padStart(3, "0")}
            </span>
          ))}
        </p>
      </div>

      {/* Main content */}
      <div className="text-center relative z-10">
        {/* Tag line */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-foreground/30 bg-background/80 backdrop-blur-md shadow-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <span className="font-mono text-xs text-foreground/90 tracking-[0.15em] uppercase font-medium">
            Available for work
          </span>
        </div>

        {/* Name */}
        <h1
          className="heading-brutal leading-[0.85]"
          style={{ fontSize: "clamp(48px, 10vw, 130px)" }}
        >
          Durga Vara
          <br />
          <span className="text-foreground/20">Prasad.</span>
        </h1>

        {/* Typewriter role */}
        <div className="mt-6 h-8 flex items-center justify-center">
          <span className="font-mono text-sm md:text-base tracking-[0.2em] text-foreground/50">
            {"< "}
          </span>
          <span className="font-mono text-sm md:text-base tracking-[0.15em] text-foreground/70 font-medium">
            {displayText}
          </span>
          <span
            className={`font-mono text-sm md:text-base text-foreground/70 ${
              cursorVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            |
          </span>
          <span className="font-mono text-sm md:text-base tracking-[0.2em] text-foreground/50">
            {" />"}
          </span>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 justify-center mt-8 max-w-md mx-auto">
          {[
            "Flutter",
            "React",
            "TypeScript",
            "Firebase",
            "Blockchain",
            "Node.js",
          ].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 font-mono text-xs border-2 border-foreground/40 text-foreground/80 font-medium tracking-wider hover:bg-foreground hover:text-background transition-all duration-300 cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Social links */}
        <div className="flex gap-4 justify-center mt-10">
          {[
            {
              Icon: Github,
              href: "https://github.com/VARA4u-tech",
              label: "GitHub",
            },
            {
              Icon: Linkedin,
              href: "https://linkedin.com/in/vara4u",
              label: "LinkedIn",
            },
            {
              Icon: Twitter,
              href: "https://twitter.com/vara4u",
              label: "Twitter",
            },
            { Icon: Mail, href: "mailto:contact@vara.dev", label: "Email" },
          ].map(({ Icon, href, label }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="group relative inline-flex items-center justify-center p-3 border-2 border-black bg-white text-black transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-black hover:text-white"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        {/* Resume button */}
        <div className="mt-10">
          <a
            href="/resume.pdf"
            download
            className="group relative inline-flex items-center gap-2 px-8 py-4 border-2 border-black bg-black text-white text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:bg-white hover:text-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <span>Download Resume</span>
            <span className="w-2 h-2 border-r-2 border-b-2 border-current rotate-45 -translate-y-[1px] group-hover:translate-y-[1px] transition-transform duration-300"></span>
          </a>
        </div>
      </div>

      {/* Bottom-left info */}
      <div className="absolute bottom-10 left-6 md:left-10 z-10">
        <span className="text-foreground/80 text-xs tracking-[0.2em] uppercase font-mono font-medium">
          www.prasad.dev
        </span>
      </div>

      {/* Bottom-right stats */}
      <div className="absolute bottom-10 right-6 md:right-10 z-10 hidden md:block">
        <div className="font-mono text-xs text-foreground/80 text-right leading-relaxed font-medium">
          <p>const experience = "2+ years";</p>
          <p>const projects = 10;</p>
          <p>const passion = Infinity;</p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown className="w-5 h-5 text-foreground/30 animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;
