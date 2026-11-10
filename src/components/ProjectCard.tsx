import { useState, useRef, useCallback, useEffect } from 'react';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from './ui/badge';
import { playClick, playHover } from '@/hooks/useSoundEffects';
import { gsap } from '@/lib/gsap';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { useHalloween, useComic } from '@/context/ThemeContext';

interface Project {
  title: string;
  isNew?: boolean;
  badge?: string;
  tagline?: string;
  description: string;
  tags: string[];
  categories: { key: string; label: string }[];
  githubUrl: string;
  liveUrl?: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

type HoverZone = 'left' | 'right' | null;

interface CursorPos {
  x: number;
  y: number;
}

export const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const { isHalloween } = useHalloween();
  const { isComic } = useComic();
  const [hoverZone, setHoverZone] = useState<HoverZone>(null);
  const [cursorPos, setCursorPos] = useState<CursorPos>({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false,
  );
  const cardRef = useRef<HTMLDivElement>(null);

  // Track breakpoint for tag count — avoids reading window during render
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useGSAPContext(
    () => {
      if (!cardRef.current) return;

      // Subtle parallax for the background number
      gsap.to(cardRef.current.querySelector('.parallax-number'), {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    },
    cardRef,
    [],
  );

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midpoint = rect.width / 2;
    const newZone: HoverZone = x < midpoint ? 'left' : 'right';

    setCursorPos({ x, y });
    setHoverZone((prev) => (prev !== newZone ? newZone : prev));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoverZone(null);
  }, []);

  const hasLive = Boolean(project.liveUrl);

  const handleZoneClick = (zone: HoverZone) => {
    if (!zone) return;
    playClick();
    if (zone === 'left') {
      window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
    } else if (zone === 'right' && project.liveUrl) {
      window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Determine badge config based on zone
  const isSource = hoverZone === 'left' || (hoverZone === 'right' && !hasLive);

  return (
    <div
      ref={cardRef}
      className="project-card-wrapper w-full h-full relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={playHover}
      style={{ cursor: hoverZone ? 'none' : 'default' }}
    >
      <div
        className={[
          'group w-full h-full relative border-2 px-5 py-8 md:px-6 md:py-10 flex flex-col justify-between transition-all duration-200 ease-out rounded-none min-h-[420px] md:min-h-[480px]',
          isComic
            ? 'comic-panel-white'
            : isHalloween
              ? 'border-black bg-white shadow-brutal-3d hover:border-[#FF7518] hover:shadow-[8px_8px_0px_0px_#FF7518] hover:-translate-x-2 hover:-translate-y-2 active:translate-x-1 active:translate-y-1 active:!shadow-none'
              : 'border-black bg-white shadow-brutal-3d hover:shadow-brutal-3d-hover hover:-translate-x-2 hover:-translate-y-2 active:translate-x-1 active:translate-y-1 active:!shadow-none',
        ].join(' ')}
        onClick={() => handleZoneClick(hoverZone)}
      >
        {/* Parallax Background Number Container */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div
            className={`parallax-number absolute -right-4 -bottom-20 text-[14rem] font-black transition-all duration-500 leading-none select-none ${
              isComic
                ? 'text-[#171717]/[0.05] group-hover:text-[#B58B32]/[0.14] group-hover:scale-105'
                : 'text-black/[0.03] group-hover:text-black/[0.06] group-hover:scale-105'
            }`}
          >
            {(index + 1).toString().padStart(2, '0')}
          </div>
        </div>

        {/* CRT pixel scanline overlay */}
        <div aria-hidden="true" className="pixel-scanline-overlay z-0" />

        {/* Subtle half-zone tint */}
        <div
          aria-hidden="true"
          className="zone-half-tint z-0"
          style={{
            background:
              hoverZone === 'left'
                ? 'linear-gradient(to right, rgba(23,23,23,0.04) 0%, transparent 100%)'
                : hoverZone === 'right'
                  ? isComic
                    ? 'linear-gradient(to left, rgba(217,180,91,0.12) 0%, transparent 100%)'
                    : 'linear-gradient(to left, rgba(10,10,30,0.06) 0%, transparent 100%)'
                  : 'transparent',
            transition: 'background 0.3s ease',
          }}
        />

        {/* Cursor-following badge */}
        <AnimatePresence>
          {hoverZone && (
            <motion.div
              key={hoverZone}
              aria-hidden="true"
              className={`cursor-zone-badge ${isSource ? 'badge-source' : 'badge-live'}`}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15, ease: 'easeOut' as const }}
              style={{
                left: cursorPos.x,
                top: cursorPos.y,
              }}
            >
              {isSource ? (
                <>
                  <Github className="badge-icon" strokeWidth={1.8} />
                  <span className="badge-label">Source Code</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="badge-icon" strokeWidth={1.8} />
                  <span className="badge-label">Live Demo</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zone split indicator lines */}
        {hoverZone && (
          <div aria-hidden="true" className="zone-split-line z-0" />
        )}

        {/* "Latest Work" / Featured Archive badge */}
        {(project.badge || project.isNew) && (
          <div
            className={`absolute -top-3 right-2 md:-right-3 px-2.5 py-1 text-[8px] md:text-[9px] font-black uppercase tracking-widest border-2 z-20 transition-transform whitespace-nowrap ${
              isComic
                ? 'border-[#D9B45B] bg-[#171717] text-[#D9B45B] shadow-[3px_3px_0px_#B58B32]'
                : 'border-black bg-black text-white rotate-0 md:rotate-3 hover:rotate-0 origin-top-right'
            }`}
          >
            {isHalloween ? '🎃 ' : ''}
            {isComic && project.isNew
              ? '◆ FEATURED ISSUE'
              : project.badge || 'Latest Work'}
          </div>
        )}

        {/* ── Card Content ── */}
        <div className="relative z-10">
          {/* Comic Archival Plate Header Strip */}
          {isComic && (
            <div className="w-full flex items-center justify-between px-2.5 py-1 mb-4 border border-[#171717] bg-[#D9D9D9] text-[#171717] font-mono text-[9px] font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <span className="text-[#B58B32]">◆</span>
                <span>ARCHIVE #{String(index + 1).padStart(2, '0')}</span>
              </span>
              <span className="text-[#171717]/70">EDITION 2026</span>
            </div>
          )}

          {/* Category dots */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.categories.map((cat) => (
              <span
                key={cat.key}
                title={cat.label}
                className={`font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border ${
                  isComic
                    ? 'border-[#171717] bg-[#FFFFFF] text-[#171717] font-bold'
                    : 'border-black/10 bg-black/4 text-foreground/50'
                }`}
              >
                {cat.label}
              </span>
            ))}
          </div>

          <div
            className={`flex justify-between items-start ${project.tagline ? 'mb-2' : 'mb-6'}`}
          >
            <h3
              className={`font-black leading-tight text-xl transition-colors duration-200 ${
                isComic
                  ? 'text-[#171717] group-hover:text-[#B58B32]'
                  : 'text-foreground'
              }`}
            >
              {project.title}
            </h3>
          </div>

          {project.tagline && (
            <p
              className={`font-mono text-[10px] md:text-xs font-bold mb-4 uppercase tracking-widest ${
                isComic ? 'text-[#888888]' : 'text-foreground/50'
              }`}
            >
              {project.tagline}
            </p>
          )}

          <p
            className={`mb-6 md:mb-8 leading-relaxed text-xs line-clamp-4 md:line-clamp-6 ${
              isComic
                ? 'text-[#171717]/85 font-normal'
                : 'body-text font-normal text-foreground/80'
            }`}
          >
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-5 md:mb-6">
            {project.tags.slice(0, isMobile ? 5 : 8).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-none transition-colors duration-200 ${
                  isComic
                    ? 'border border-[#888888] bg-[#D9D9D9] text-[#171717] group-hover:border-[#171717] group-hover:bg-[#171717] group-hover:text-[#D9B45B]'
                    : 'border border-black/5 bg-black/5 group-hover:bg-black group-hover:text-white'
                }`}
              >
                {tag}
              </Badge>
            ))}
            {project.tags.length > 8 && (
              <span
                className={`text-[9px] font-bold ${
                  isComic ? 'text-[#888888]' : 'opacity-30'
                }`}
              >
                +{project.tags.length - 8}
              </span>
            )}
          </div>
        </div>

        {/* ── Mobile / Touch: fallback buttons ── */}
        <div className="mobile-action-buttons mt-auto flex gap-3 relative z-10">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              playClick();
            }}
            aria-label={`View ${project.title} source code on GitHub`}
            className={`mobile-card-btn transition-all duration-200 active:scale-95 ${
              isComic
                ? 'border-[#171717] bg-[#FFFFFF] text-[#171717] font-bold hover:bg-[#D9D9D9]'
                : 'border-black bg-white text-foreground hover:bg-black hover:text-white'
            }`}
          >
            <Github className="w-4 h-4 flex-shrink-0" />
            <span>Source</span>
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                playClick();
              }}
              aria-label={`View ${project.title} live demo`}
              className={`mobile-card-btn transition-all duration-200 active:scale-95 ${
                isComic
                  ? 'border-[#171717] bg-[#D9B45B] text-[#171717] font-black shadow-[3px_3px_0px_#B58B32] hover:bg-[#B58B32]'
                  : 'border-black bg-black text-white hover:bg-white hover:text-black'
              }`}
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
