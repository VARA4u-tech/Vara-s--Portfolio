import React, { useState, useRef, useEffect } from 'react';
import {
  SlidersHorizontal,
  Dog,
  ShieldCheck,
  Volume2,
  VolumeX,
} from 'lucide-react';
import useSoundEffects, { playClick, playHover } from '@/hooks/useSoundEffects';
import { useTheme } from '@/context/ThemeContext';

export const PreferencesPopover: React.FC = () => {
  const { isComic, isHalloween } = useTheme();
  const { setMasterVolume } = useSoundEffects();

  const [open, setOpen] = useState(false);
  const [isPetVisible, setIsPetVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedPet = localStorage.getItem('site_pet_visible');
    if (savedPet === 'false') {
      setIsPetVisible(false);
    }

    const savedMuted = localStorage.getItem('site_muted');
    if (savedMuted === 'true') {
      setIsMuted(true);
      setMasterVolume(0);
    }
  }, [setMasterVolume]);

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

  const togglePet = () => {
    const nextState = !isPetVisible;
    setIsPetVisible(nextState);
    localStorage.setItem('site_pet_visible', String(nextState));
    window.dispatchEvent(
      new CustomEvent('pet-toggle', { detail: { visible: nextState } }),
    );
    playClick();
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setMasterVolume(nextMuted ? 0 : 0.8);
    localStorage.setItem('site_muted', String(nextMuted));
    if (!nextMuted) {
      setTimeout(() => playClick(), 50);
    }
  };

  const companionLabel = isComic ? 'Hero Assistant' : 'PixelPet Companion';
  const CompanionIcon = isComic ? ShieldCheck : Dog;

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
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Site preferences (Companion and Sound)"
        title="Preferences"
        className={`p-2 border-2 transition-all duration-200 active:scale-95 rounded-none relative ${
          isComic
            ? 'border-[#D9D9D9] bg-[#FFFFFF] text-[#171717] shadow-[3px_3px_0px_#888888] hover:border-[#D9B45B] hover:shadow-[3px_3px_0px_#B58B32]'
            : isHalloween
              ? 'border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:border-[#FF7518] hover:shadow-[4px_4px_0px_0px_#FF7518]'
              : 'border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]'
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        {/* Subtle dot if muted or companion hidden */}
        {(isMuted || !isPetVisible) && (
          <span
            className={`absolute -top-1 -right-1 w-2 h-2 border ${
              isComic
                ? 'bg-[#D9B45B] border-[#171717]'
                : 'bg-[#FF7518] border-black'
            }`}
          />
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Preferences"
          className={`absolute right-0 mt-2.5 w-60 p-2.5 z-50 rounded-none border-2 animate-in fade-in slide-in-from-top-2 duration-150 ${
            isComic
              ? 'bg-[#FFFFFF] border-[#171717] text-[#171717] shadow-[6px_6px_0px_#D9B45B]'
              : isHalloween
                ? 'bg-white border-black text-black shadow-[6px_6px_0px_#FF7518]'
                : 'bg-white border-black text-black shadow-[6px_6px_0px_rgba(0,0,0,1)]'
          }`}
        >
          <div
            className={`px-2 py-1.5 mb-2 border-b font-mono text-[9px] font-black uppercase tracking-[0.2em] ${
              isComic
                ? 'border-[#D9D9D9] text-[#888888]'
                : 'border-black/10 text-black/50'
            }`}
          >
            Preferences
          </div>

          <div className="space-y-1.5">
            {/* Companion Toggle Row */}
            <button
              type="button"
              onClick={togglePet}
              onMouseEnter={playHover}
              aria-pressed={isPetVisible}
              className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 border transition-colors rounded-none ${
                isComic
                  ? 'border-[#D9D9D9] hover:border-[#171717] hover:bg-[#D9D9D9]/50 text-[#171717]'
                  : 'border-black/10 hover:border-black hover:bg-black/5 text-black'
              }`}
            >
              <span className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider">
                <CompanionIcon className="w-4 h-4 shrink-0" />
                <span>{companionLabel}</span>
              </span>
              <span
                className={`px-1.5 py-0.5 font-mono text-[9px] font-black uppercase border ${
                  isPetVisible
                    ? isComic
                      ? 'bg-[#D9B45B] text-[#171717] border-[#171717]'
                      : 'bg-black text-white border-black'
                    : isComic
                      ? 'bg-[#D9D9D9] text-[#888888] border-[#888888]'
                      : 'bg-black/10 text-black/50 border-black/20'
                }`}
              >
                {isPetVisible ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Sound Toggle Row */}
            <button
              type="button"
              onClick={toggleSound}
              onMouseEnter={playHover}
              aria-pressed={!isMuted}
              className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 border transition-colors rounded-none ${
                isComic
                  ? 'border-[#D9D9D9] hover:border-[#171717] hover:bg-[#D9D9D9]/50 text-[#171717]'
                  : 'border-black/10 hover:border-black hover:bg-black/5 text-black'
              }`}
            >
              <span className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider">
                {isMuted ? (
                  <VolumeX className="w-4 h-4 shrink-0" />
                ) : (
                  <Volume2 className="w-4 h-4 shrink-0" />
                )}
                <span>Sound FX</span>
              </span>
              <span
                className={`px-1.5 py-0.5 font-mono text-[9px] font-black uppercase border ${
                  !isMuted
                    ? isComic
                      ? 'bg-[#D9B45B] text-[#171717] border-[#171717]'
                      : 'bg-black text-white border-black'
                    : isComic
                      ? 'bg-[#D9D9D9] text-[#888888] border-[#888888]'
                      : 'bg-black/10 text-black/50 border-black/20'
                }`}
              >
                {isMuted ? 'MUTED' : 'ON'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferencesPopover;
