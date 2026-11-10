import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Sparkles } from 'lucide-react';
import { useTheme, type SiteTheme } from '@/context/ThemeContext';
import { playClick, playHover } from '@/hooks/useSoundEffects';

interface ThemeOption {
  id: SiteTheme;
  label: string;
  shortLabel: string;
  description: string;
  swatch: [string, string];
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'comic',
    label: 'Retro Comic Press',
    shortLabel: 'Comic',
    description: 'Deep black, white & mustard gold',
    swatch: ['#171717', '#D9B45B'],
  },
  {
    id: 'default',
    label: 'Neo-Brutalist',
    shortLabel: 'Classic',
    description: 'Clean monochrome & paper grain',
    swatch: ['#F5F5F5', '#171717'],
  },
  {
    id: 'halloween',
    label: 'Halloween Spirit',
    shortLabel: 'Spooky',
    description: 'Monochrome with pumpkin & bats',
    swatch: ['#111111', '#FF7518'],
  },
];

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme, isComic, isHalloween } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentTheme =
    THEME_OPTIONS.find((opt) => opt.id === theme) ?? THEME_OPTIONS[0];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    const onScroll = () => setOpen(false);

    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll);
    };
  }, [open]);

  const handleSelect = (nextTheme: SiteTheme) => {
    playClick();
    setTheme(nextTheme);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        data-nav-trigger="true"
        onClick={() => {
          playClick();
          setOpen((prev) => !prev);
        }}
        onMouseEnter={playHover}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Select theme (current: ${currentTheme.label})`}
        title={`Theme: ${currentTheme.label}`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-2 border-2 transition-all duration-200 active:scale-95 rounded-none font-mono text-[10px] font-black uppercase tracking-wider select-none ${
          isComic
            ? 'border-[#D9D9D9] bg-[#171717] text-[#FFFFFF] shadow-[3px_3px_0px_#D9B45B] hover:border-[#D9B45B] hover:text-[#D9B45B]'
            : isHalloween
              ? 'border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:border-[#FF7518] hover:shadow-[4px_4px_0px_0px_#FF7518]'
              : 'border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]'
        }`}
      >
        <ThemeIcon theme={theme} />
        <span className="hidden sm:inline">{currentTheme.shortLabel}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Theme Options"
          className={`absolute right-0 mt-2.5 w-60 p-2 z-50 rounded-none border-2 animate-in fade-in slide-in-from-top-2 duration-150 ${
            isComic
              ? 'bg-[#FFFFFF] border-[#171717] text-[#171717] shadow-[6px_6px_0px_#D9B45B]'
              : isHalloween
                ? 'bg-white border-black text-black shadow-[6px_6px_0px_#FF7518]'
                : 'bg-white border-black text-black shadow-[6px_6px_0px_rgba(0,0,0,1)]'
          }`}
        >
          <div
            className={`px-2 py-1.5 mb-1.5 border-b font-mono text-[9px] font-black uppercase tracking-[0.2em] ${
              isComic
                ? 'border-[#D9D9D9] text-[#888888]'
                : 'border-black/10 text-black/50'
            }`}
          >
            Select Theme
          </div>

          <div className="space-y-1">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = opt.id === theme;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isSelected}
                  onClick={() => handleSelect(opt.id)}
                  onMouseEnter={playHover}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-left transition-colors rounded-none border ${
                    isSelected
                      ? isComic
                        ? 'bg-[#D9B45B] border-[#171717] text-[#171717]'
                        : isHalloween
                          ? 'bg-black border-black text-[#FF7518]'
                          : 'bg-black border-black text-white'
                      : isComic
                        ? 'bg-transparent border-transparent text-[#171717] hover:bg-[#D9D9D9]'
                        : 'bg-transparent border-transparent text-black hover:bg-black/5'
                  }`}
                >
                  {/* Dual swatch badge */}
                  <span className="flex shrink-0 border border-black/30">
                    <span
                      className="w-2.5 h-5"
                      style={{ backgroundColor: opt.swatch[0] }}
                    />
                    <span
                      className="w-2.5 h-5"
                      style={{ backgroundColor: opt.swatch[1] }}
                    />
                  </span>

                  <span className="flex-1 min-w-0">
                    <span className="block font-mono text-[11px] font-black uppercase tracking-wider leading-tight">
                      {opt.label}
                    </span>
                    <span
                      className={`block text-[10px] leading-tight mt-0.5 truncate ${
                        isSelected
                          ? isComic
                            ? 'text-[#171717]/80'
                            : 'opacity-75'
                          : isComic
                            ? 'text-[#888888]'
                            : 'text-black/50'
                      }`}
                    >
                      {opt.description}
                    </span>
                  </span>

                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const ThemeIcon = ({ theme }: { theme: SiteTheme }) => {
  if (theme === 'comic') {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none">
        <polygon
          points="12,1.5 14.8,7.5 21.5,5.5 17.5,11 22.5,15.5 16,16.8 16.5,22.5 12,18 7.5,22.5 8,16.8 1.5,15.5 6.5,11 2.5,5.5 9.2,7.5"
          fill="#D9B45B"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />
      </svg>
    );
  }

  if (theme === 'halloween') {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none">
        <path
          d="M11 2 C11 0 13 0 14 3"
          stroke="#22C55E"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <ellipse
          cx="12"
          cy="14"
          rx="9"
          ry="7.5"
          fill="#FF7518"
          stroke="#000"
          strokeWidth="1.2"
        />
      </svg>
    );
  }

  return <Sparkles className="w-3.5 h-3.5 shrink-0" />;
};

export default ThemeSelector;
