import React from 'react';

interface ComicActionLinesProps {
  className?: string;
  opacity?: number;
}

/**
 * Art-directed black-and-white illustrated comic panels with Mustard Gold
 * directional speed-lines and clean halftone geometric plates.
 * Built solely with static vector SVG primitives for crisp rendering on low-end mobile.
 */
export const ComicActionLines: React.FC<ComicActionLinesProps> = ({
  className = '',
  opacity = 0.24,
}) => {
  // 24 architectural radial lines (lightweight DOM count, zero animation loops)
  const rays = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 360) / 24 + 7.5;
    const rad = (angle * Math.PI) / 180;
    const innerR = i % 4 === 0 ? 195 : 230;
    const outerR = i % 3 === 0 ? 780 : 640;
    return {
      x1: 500 + Math.cos(rad) * innerR,
      y1: 500 + Math.sin(rad) * innerR,
      x2: 500 + Math.cos(rad) * outerR,
      y2: 500 + Math.sin(rad) * outerR,
      isGold: i === 2 || i === 8 || i === 14 || i === 20,
      isDarkGold: i === 5 || i === 17,
    };
  });

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="comic-hero-halftone"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="3" cy="3" r="1.4" fill="#888888" fillOpacity="0.45" />
          </pattern>
        </defs>

        {/* Architectural Ink Comic Panel Frames (B&W Illustrated Layout) */}
        <g fill="none">
          <rect
            x="48"
            y="84"
            width="904"
            height="832"
            stroke="#888888"
            strokeWidth="1.5"
            strokeOpacity="0.45"
          />
          <rect
            x="64"
            y="100"
            width="240"
            height="190"
            stroke="#D9D9D9"
            strokeWidth="1"
            strokeOpacity="0.22"
          />
          <rect
            x="696"
            y="700"
            width="240"
            height="196"
            stroke="#D9D9D9"
            strokeWidth="1"
            strokeOpacity="0.22"
          />
          {/* Subtle corner halftone plates */}
          <rect
            x="64"
            y="100"
            width="240"
            height="190"
            fill="url(#comic-hero-halftone)"
          />
          <rect
            x="696"
            y="700"
            width="240"
            height="196"
            fill="url(#comic-hero-halftone)"
          />
        </g>

        {/* Geometric Pop-Art Ring Framing Behind Title */}
        <circle
          cx="500"
          cy="495"
          r="260"
          fill="none"
          stroke="#888888"
          strokeWidth="1"
          strokeDasharray="6 10"
          strokeOpacity="0.45"
        />
        <circle
          cx="500"
          cy="495"
          r="335"
          fill="none"
          stroke="#D9B45B"
          strokeWidth="1"
          strokeOpacity="0.35"
        />

        {/* Directional Action Lines: Industrial Gray + Selective Mustard Gold */}
        <g>
          {rays.map((ray, idx) => (
            <line
              key={idx}
              x1={ray.x1}
              y1={ray.y1}
              x2={ray.x2}
              y2={ray.y2}
              stroke={
                ray.isGold
                  ? '#D9B45B'
                  : ray.isDarkGold
                    ? '#B58B32'
                    : '#888888'
              }
              strokeOpacity={ray.isGold ? 0.85 : ray.isDarkGold ? 0.65 : 0.35}
              strokeWidth={ray.isGold ? 2.2 : ray.isDarkGold ? 1.8 : 1}
            />
          ))}
        </g>

        {/* Minimal Geometric Pop-Art Corner Anchors */}
        <polygon
          points="940,96 952,96 952,108"
          fill="#D9B45B"
          fillOpacity="0.85"
        />
        <polygon
          points="48,904 60,904 48,892"
          fill="#D9B45B"
          fillOpacity="0.85"
        />
      </svg>
    </div>
  );
};

export default ComicActionLines;
