import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check, Sparkles, X } from 'lucide-react';
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
    id: 'default',
    label: 'Neo-Brutalist',
    shortLabel: 'Classic',
    description: 'Clean monochrome & paper grain',
    swatch: ['#F5F5F5', '#171717'],
  },
  {
    id: 'comic',
    label: 'Retro Comic Press',
    shortLabel: 'Comic',
    description: 'Deep black, white & mustard gold',
    swatch: ['#171717', '#D9B45B'],
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
  const [showHint, setShowHint] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentTheme =
    THEME_OPTIONS.find((opt) => opt.id === theme) ?? THEME_OPTIONS[0];

  const dismissHint = useCallback(() => {
    setShowHint(false);
    try {
      localStorage.setItem('site_theme_hint_dismissed', 'true');
      window.dispatchEvent(new Event('theme-hint-dismissed'));
    } catch {
      // safe fallback
    }
  }, []);

  // Subtle first-time onboarding tip: appears after loading screen settles
  useEffect(() => {
    try {
      if (
        localStorage.getItem('site_theme_hint_dismissed') === 'true' ||
        localStorage.getItem('site_theme') === 'halloween' ||
        localStorage.getItem('site_theme') === 'comic'
      ) {
        return;
      }
    } catch {
      return;
    }

    // Delay until loading screen completes (~3.4s)
    const timer = setTimeout(() => {
      setShowHint(true);
    }, 3400);

    // Auto-dismiss after 11s so it never lingers
    const autoDismiss = setTimeout(() => {
      setShowHint(false);
    }, 14400);

    const onDismiss = () => setShowHint(false);
    window.addEventListener('theme-hint-dismissed', onDismiss);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoDismiss);
      window.removeEventListener('theme-hint-dismissed', onDismiss);
    };
  }, []);

  const getHintMessage = () => {
    if (theme === 'halloween') {
      return (
        <>
          Enjoying{' '}
          <strong className="font-black text-[#FF7518]">
            Halloween Spirit
          </strong>
          ? Click here to switch back to{' '}
          <strong className="font-black">Classic</strong> or try{' '}
          <strong className="font-black">Comic Press</strong>!
        </>
      );
    }
    if (theme === 'comic') {
      return (
        <>
          In <strong className="font-black text-[#D9B45B]">Comic Press</strong>{' '}
          edition? Click here to switch back to{' '}
          <strong className="font-black">Classic</strong> or try{' '}
          <strong className="font-black">Halloween</strong>!
        </>
      );
    }
    return (
      <>
        Click here to explore the{' '}
        <strong className="font-black">Retro Comic Press</strong> &amp;{' '}
        <strong className="font-black">Halloween Spirit</strong> editions!
      </>
    );
  };

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
    dismissHint();
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
          dismissHint();
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

      {/* Responsive First-Time Onboarding Tooltip Callout */}
      {showHint && !open && (
        <div
          role="status"
          aria-live="polite"
          className={`absolute right-0 top-full mt-2.5 w-60 sm:w-64 p-3 z-50 rounded-none border-2 animate-in fade-in slide-in-from-top-2 duration-300 ${
            isComic
              ? 'bg-[#171717] border-[#D9B45B] text-[#FFFFFF] shadow-[5px_5px_0px_#B58B32]'
              : isHalloween
                ? 'bg-[#0B0B0B] border-[#FF7518] text-[#F5F5F5] shadow-[5px_5px_0px_#FF7518]'
                : 'bg-white border-black text-black shadow-[5px_5px_0px_rgba(0,0,0,1)]'
          }`}
        >
          {/* Top Notch Arrow pointing to theme button */}
          <div
            aria-hidden="true"
            className={`absolute -top-1.5 right-4 sm:right-8 w-3 h-3 rotate-45 border-t-2 border-l-2 ${
              isComic
                ? 'bg-[#171717] border-[#D9B45B]'
                : isHalloween
                  ? 'bg-[#0B0B0B] border-[#FF7518]'
                  : 'bg-white border-black'
            }`}
          />

          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-current/15">
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isComic
                      ? 'bg-[#D9B45B]'
                      : isHalloween
                        ? 'bg-[#FF7518]'
                        : 'bg-green-500'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isComic
                      ? 'bg-[#D9B45B]'
                      : isHalloween
                        ? 'bg-[#FF7518]'
                        : 'bg-green-600'
                  }`}
                />
              </span>
              <span
                className={
                  isComic
                    ? 'text-[#D9B45B]'
                    : isHalloween
                      ? 'text-[#FF7518]'
                      : ''
                }
              >
                Switch Theme
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dismissHint();
              }}
              aria-label="Dismiss theme notification"
              className="p-0.5 hover:opacity-60 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Content */}
          <p className="mt-2 text-[11px] leading-snug font-medium opacity-90">
            {getHintMessage()}
          </p>

          {/* Action Trigger */}
          <div className="mt-2.5 flex items-center justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playClick();
                dismissHint();
                setOpen(true);
              }}
              className={`px-2.5 py-1 font-mono text-[9px] font-black uppercase tracking-wider border transition-all active:scale-95 ${
                isComic
                  ? 'bg-[#D9B45B] text-[#171717] border-[#D9B45B] hover:bg-[#B58B32]'
                  : isHalloween
                    ? 'bg-[#FF7518] text-black border-[#FF7518] hover:bg-white'
                    : 'bg-black text-white border-black hover:bg-neutral-800'
              }`}
            >
              {theme === 'default' ? 'Explore Themes →' : 'Switch Theme →'}
            </button>
          </div>
        </div>
      )}

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
