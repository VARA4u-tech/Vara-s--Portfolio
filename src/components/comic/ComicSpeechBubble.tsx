import React from 'react';
import { playHover } from '@/hooks/useSoundEffects';

export type SpeechBubbleColor = 'white' | 'concrete' | 'black' | 'gold';

interface ComicSpeechBubbleProps {
  children: React.ReactNode;
  tail?: 'bottom-left' | 'top-left' | 'none';
  color?: SpeechBubbleColor;
  className?: string;
  onClick?: () => void;
}

const SURFACE_STYLES: Record<
  SpeechBubbleColor,
  { bg: string; text: string; border: string }
> = {
  white: {
    bg: '#FFFFFF',
    text: '#171717',
    border: '#171717',
  },
  concrete: {
    bg: '#D9D9D9',
    text: '#171717',
    border: '#171717',
  },
  black: {
    bg: '#171717',
    text: '#FFFFFF',
    border: '#D9D9D9',
  },
  gold: {
    bg: '#D9B45B',
    text: '#171717',
    border: '#171717',
  },
};

export const ComicSpeechBubble: React.FC<ComicSpeechBubbleProps> = ({
  children,
  tail = 'bottom-left',
  color = 'white',
  className = '',
  onClick,
}) => {
  const palette = SURFACE_STYLES[color];

  return (
    <div
      onClick={onClick}
      onMouseEnter={onClick ? playHover : undefined}
      style={{
        backgroundColor: palette.bg,
        color: palette.text,
        borderColor: palette.border,
      }}
      className={`comic-speech-bubble ${className}`}
    >
      <div className="flex items-center gap-2 font-mono font-bold uppercase tracking-[0.14em] text-[10px] md:text-xs">
        {children}
      </div>

      {tail === 'bottom-left' && (
        <svg
          width="16"
          height="14"
          viewBox="0 0 16 14"
          aria-hidden="true"
          className="absolute -bottom-[14px] left-5 block pointer-events-none"
        >
          <polygon points="0,0 14,0 2,13" fill={palette.bg} />
          <polyline
            points="1,0 2,13 14,0"
            fill="none"
            stroke={palette.border}
            strokeWidth="2"
            strokeLinejoin="miter"
          />
        </svg>
      )}

      {tail === 'top-left' && (
        <svg
          width="16"
          height="14"
          viewBox="0 0 16 14"
          aria-hidden="true"
          className="absolute -top-[14px] left-5 block pointer-events-none"
        >
          <polygon points="2,1 14,14 0,14" fill={palette.bg} />
          <polyline
            points="1,14 2,1 14,14"
            fill="none"
            stroke={palette.border}
            strokeWidth="2"
            strokeLinejoin="miter"
          />
        </svg>
      )}
    </div>
  );
};

export default ComicSpeechBubble;
