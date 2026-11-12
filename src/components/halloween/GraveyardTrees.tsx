import React from 'react';
import { useHalloween } from './HalloweenContext';

interface GraveyardTreesProps {
  variant?: 'hero' | 'finale';
  className?: string;
}

/**
 * Lightweight vector spooky graveyard tree silhouettes with subtle Tombstones,
 * crooked iron pickets, and warm #FF7518 lantern/owl-eye accents.
 * GPU-friendly (CSS transform-only sway), zero horizontal overflow, reduced-motion safe.
 */
export const GraveyardTrees: React.FC<GraveyardTreesProps> = ({
  variant = 'hero',
  className = '',
}) => {
  const { isHalloween, prefersReducedMotion } = useHalloween();

  if (!isHalloween) return null;

  const isHero = variant === 'hero';
  const swayClass = prefersReducedMotion ? '' : 'graveyard-tree-sway';
  const swayAltClass = prefersReducedMotion ? '' : 'graveyard-tree-sway-alt';

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden select-none ${
        isHero ? 'z-[1]' : 'z-0'
      } ${className}`}
    >
      <div className="relative w-full flex items-end justify-between">
        {/* Left Spooky Oak & Tombstone Silhouette */}
        <svg
          viewBox="0 0 260 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`block shrink-0 ${
            isHero
              ? 'w-32 sm:w-48 md:w-64 lg:w-72 opacity-20 sm:opacity-25'
              : 'w-28 sm:w-40 md:w-52 opacity-15 sm:opacity-20'
          }`}
        >
          {/* Ground Mound */}
          <path
            d="M0 220 L0 202 Q70 190 155 205 Q210 212 260 220 Z"
            fill="#0B0B0B"
          />

          {/* Crooked Iron Fence Pickets (Desktop/Tablet visual edge) */}
          <g stroke="#0B0B0B" strokeWidth="2.5" strokeLinecap="round">
            <line x1="158" y1="210" x2="156" y2="180" />
            <line x1="176" y1="212" x2="177" y2="182" />
            <line x1="194" y1="214" x2="193" y2="186" />
            <line x1="152" y1="192" x2="202" y2="195" strokeWidth="2" />
            <line x1="152" y1="203" x2="204" y2="205" strokeWidth="2" />
          </g>

          {/* Tilted Tombstone */}
          <g transform="rotate(-7 132 195)">
            <path
              d="M116 206 L116 172 Q130 156 144 172 L144 206 Z"
              fill="#0B0B0B"
            />
            <line
              x1="130"
              y1="170"
              x2="130"
              y2="186"
              stroke="#FF7518"
              strokeWidth="2"
            />
            <line
              x1="124"
              y1="176"
              x2="136"
              y2="176"
              stroke="#FF7518"
              strokeWidth="2"
            />
          </g>

          {/* Main Gnarled Spooky Tree */}
          <g className={swayClass}>
            {/* Trunk & Roots */}
            <path
              d="M22 212 Q42 185 45 142 Q47 104 38 72 L52 72 Q62 102 64 140 Q68 182 92 212 Z"
              fill="#0B0B0B"
            />
            {/* Twisted Left Branches */}
            <path d="M46 112 Q24 94 12 68 Q22 86 44 102 Z" fill="#0B0B0B" />
            <path d="M26 88 Q10 78 2 62 Q16 74 30 84 Z" fill="#0B0B0B" />
            {/* Twisted Upper Crown & Fingers */}
            <path
              d="M42 78 Q34 48 16 24 Q34 40 46 66 Q50 38 66 12 Q57 42 54 70 Q76 48 106 32 Q80 56 58 80 Z"
              fill="#0B0B0B"
            />
            {/* Creeping Right Bough */}
            <path
              d="M56 108 Q96 86 138 64 Q112 88 94 96 Q118 92 146 88 Q110 102 60 120 Z"
              fill="#0B0B0B"
            />
            {/* Subtle Hanging Wisp */}
            <path
              d="M114 82 Q112 96 115 108"
              stroke="#0B0B0B"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M128 74 Q129 89 126 101"
              stroke="#0B0B0B"
              strokeWidth="1.4"
              strokeLinecap="round"
            />

            {/* Glowing #FF7518 Owl Eyes Inside Tree Hollow */}
            <ellipse cx="53" cy="128" rx="4.5" ry="6" fill="#171717" />
            <circle cx="51" cy="127" r="1.4" fill="#FF7518" />
            <circle cx="55.5" cy="127" r="1.4" fill="#FF7518" />
          </g>
        </svg>

        {/* Right Haunted Graveyard Tree & Pumpkin Lantern Silhouette */}
        <svg
          viewBox="0 0 260 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`block shrink-0 ${
            isHero
              ? 'w-32 sm:w-48 md:w-64 lg:w-72 opacity-20 sm:opacity-25'
              : 'w-28 sm:w-40 md:w-52 opacity-15 sm:opacity-20'
          }`}
        >
          {/* Ground Mound */}
          <path
            d="M0 220 Q60 212 115 204 Q195 190 260 202 L260 220 Z"
            fill="#0B0B0B"
          />

          {/* Crooked Gravestone Cross */}
          <g transform="rotate(6 120 190)">
            <rect x="115" y="162" width="7" height="44" fill="#0B0B0B" />
            <rect x="104" y="172" width="29" height="6" fill="#0B0B0B" />
          </g>

          {/* Glowing Mini Jack-o'-Lantern at Tree Base */}
          <g transform="translate(148, 189)">
            <path
              d="M9 1 Q10 -3 13 -2"
              stroke="#0B0B0B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <ellipse
              cx="9"
              cy="10"
              rx="10"
              ry="8"
              fill="#FF7518"
              stroke="#0B0B0B"
              strokeWidth="1.5"
            />
            <polygon points="5,8 7,6 8,9" fill="#0B0B0B" />
            <polygon points="10,9 11,6 13,8" fill="#0B0B0B" />
            <path
              d="M5 13 Q9 16 13 13"
              stroke="#0B0B0B"
              strokeWidth="1.4"
              fill="none"
            />
          </g>

          {/* Main Leaning Haunted Tree */}
          <g className={swayAltClass}>
            {/* Trunk & Roots */}
            <path
              d="M172 212 Q196 184 198 142 Q200 104 206 70 L220 72 Q212 108 216 144 Q218 184 242 212 Z"
              fill="#0B0B0B"
            />
            {/* Left Reaching Branches */}
            <path
              d="M202 118 Q162 94 122 68 Q154 80 174 90 Q146 66 126 42 Q162 66 204 104 Z"
              fill="#0B0B0B"
            />
            {/* Upper Forked Crown */}
            <path
              d="M206 76 Q190 42 172 16 Q194 36 210 64 Q218 32 232 10 Q224 40 218 72 Q238 56 254 44 Q236 66 216 86 Z"
              fill="#0B0B0B"
            />
            {/* Low Right Twisted Limb */}
            <path
              d="M214 114 Q236 98 256 76 Q242 102 216 124 Z"
              fill="#0B0B0B"
            />
            {/* Hanging Iron Lantern */}
            <line
              x1="142"
              y1="80"
              x2="142"
              y2="96"
              stroke="#0B0B0B"
              strokeWidth="1.4"
            />
            <polygon points="138,96 146,96 144,106 140,106" fill="#0B0B0B" />
            <rect x="140.5" y="98.5" width="3" height="5" fill="#FF7518" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default GraveyardTrees;
