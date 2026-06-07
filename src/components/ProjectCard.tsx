import { useState, useRef, useCallback } from 'react';
import { Github, ExternalLink, ArrowUpRight, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from './ui/badge';
import { playClick, playHover } from '@/hooks/useSoundEffects';

interface Project {
  title: string;
  isNew?: boolean;
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

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const [hoverZone, setHoverZone] = useState<HoverZone>(null);
  const [cursorPos, setCursorPos] = useState<CursorPos>({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

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
  const isLive = hoverZone === 'right' && hasLive;

  return (
    <div
      ref={cardRef}
      className="project-card-wrapper w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={playHover}
      style={{ cursor: hoverZone ? 'none' : 'default' }}
    >
      <div
        className={[
          'w-full h-full relative border-2 border-black px-5 py-8 md:px-6 md:py-10 flex flex-col justify-between',
          'shadow-brutal-3d hover:shadow-brutal-3d-hover transition-all duration-500',
          'bg-white rounded-none min-h-[420px] md:min-h-[480px] overflow-hidden',
        ].join(' ')}
        onClick={() => handleZoneClick(hoverZone)}
      >
        {/* CRT pixel scanline overlay */}
        <div aria-hidden="true" className="pixel-scanline-overlay" />

        {/* ── Subtle half-zone tint (very faint, doesn't cover content) ── */}
        <div
          aria-hidden="true"
          className="zone-half-tint"
          style={{
            background:
              hoverZone === 'left'
                ? 'linear-gradient(to right, rgba(0,0,0,0.04) 0%, transparent 100%)'
                : hoverZone === 'right'
                  ? 'linear-gradient(to left, rgba(10,10,30,0.06) 0%, transparent 100%)'
                  : 'transparent',
            transition: 'background 0.3s ease',
          }}
        />

        {/* ── Cursor-following badge ── */}
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

        {/* ── Zone split indicator lines (very subtle) ── */}
        {hoverZone && <div aria-hidden="true" className="zone-split-line" />}

        {/* ── "Latest Work" badge ── */}
        {project.isNew && (
          <div className="absolute -top-3 -right-3 bg-black text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 border-black z-20 rotate-3 hover:rotate-0 transition-transform">
            LATEST WORK
          </div>
        )}

        {/* ── Card Content ── */}
        <div className="relative z-10">
          {/* Category dots */}
          <div className="flex gap-1.5 mb-4">
            {project.categories.map((cat) => (
              <span
                key={cat.key}
                title={cat.label}
                className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border border-black/10 bg-black/4 text-foreground/50"
              >
                {cat.label}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-start mb-6">
            <h3 className="font-black text-foreground leading-tight text-xl">
              {project.title}
            </h3>
          </div>

          <p className="body-text mb-6 md:mb-8 font-normal leading-relaxed text-foreground/80 text-xs line-clamp-4 md:line-clamp-6">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-5 md:mb-6">
            {project.tags
              .slice(
                0,
                typeof window !== 'undefined' && window.innerWidth < 640
                  ? 5
                  : 8,
              )
              .map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="font-mono text-[9px] font-bold border border-black/5 bg-black/5 px-2 py-0.5 rounded-none"
                >
                  {tag}
                </Badge>
              ))}
            {project.tags.length > 8 && (
              <span className="text-[9px] font-bold opacity-30">
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
            className="mobile-card-btn border-black bg-white text-foreground hover:bg-black hover:text-white active:scale-95"
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
              className="mobile-card-btn border-black bg-black text-white hover:bg-white hover:text-black active:scale-95"
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
