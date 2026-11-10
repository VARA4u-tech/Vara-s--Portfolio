import React from 'react';
import { useComic } from '@/context/ThemeContext';

/**
 * Editorial Comic Issue Corner Frames & Hero Signal Beacon.
 * Counterpart to Halloween's corner SpiderWebs — tucked cleanly below the navbar
 * on tablet/desktop screens using crisp Ink, Concrete Gray & Mustard Gold geometry.
 */
export const ComicCornerFrames: React.FC = () => {
  const { isComic } = useComic();

  if (!isComic) return null;

  return (
    <div
      aria-hidden="true"
      className="hidden md:block fixed inset-0 pointer-events-none z-20 overflow-hidden select-none"
    >
      {/* Top-Left: Vintage Print Halftone Corner Wedge + Speed Chevrons */}
      <div className="absolute top-20 left-3 lg:left-5 opacity-45">
        <svg
          width="88"
          height="88"
          viewBox="0 0 88 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="comic-corner-dots-l"
              width="7"
              height="7"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1.8" cy="1.8" r="1" fill="#888888" />
            </pattern>
          </defs>
          {/* Corner triangle halftone plate */}
          <polygon points="0,0 74,0 0,74" fill="url(#comic-corner-dots-l)" />
          {/* Registration border L */}
          <polyline
            points="0,68 0,0 68,0"
            stroke="#D9D9D9"
            strokeWidth="1.5"
          />
          <polyline
            points="6,46 6,6 46,6"
            stroke="#D9B45B"
            strokeWidth="1.5"
          />
          {/* Action chevron ticks */}
          <line x1="12" y1="22" x2="22" y2="12" stroke="#D9B45B" strokeWidth="1.6" />
          <line x1="12" y1="30" x2="30" y2="12" stroke="#888888" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Top-Right: Hero Signal Crosshair Crest + Halftone Corner Wedge */}
      <div className="absolute top-20 right-3 lg:right-5 opacity-50">
        <svg
          width="92"
          height="92"
          viewBox="0 0 92 92"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="comic-corner-dots-r"
              width="7"
              height="7"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1.8" cy="1.8" r="1" fill="#888888" />
            </pattern>
          </defs>
          <polygon points="92,0 18,0 92,74" fill="url(#comic-corner-dots-r)" />
          <polyline
            points="24,0 92,0 92,68"
            stroke="#D9D9D9"
            strokeWidth="1.5"
          />
          {/* Subtle Hero Signal Crest Emblem */}
          <g className="comic-signal-pulse" transform="translate(64, 24)">
            <circle
              cx="0"
              cy="0"
              r="14"
              stroke="#D9B45B"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />
            <polygon
              points="0,-8 7,0 0,8 -7,0"
              fill="#171717"
              stroke="#D9B45B"
              strokeWidth="1.4"
            />
            <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default ComicCornerFrames;
