import React from 'react';
import { useComic } from '@/context/ThemeContext';
import ComicAtmosphere from './ComicAtmosphere';
import ComicSkylinePatrol from './ComicSkylinePatrol';
import ComicCornerFrames from './ComicCornerFrames';
import ComicImpactBursts from './ComicImpactBursts';
import './comic.css';

/**
 * Global ambient & superhero fiction layer for the Retro Comic Press theme.
 * Pairs strictly with the 6-color Noir Gold & Ink palette, honors reduced motion,
 * and stays completely unobtrusive across desktop and mobile viewports.
 */
export const ComicGlobalLayer: React.FC = () => {
  const { isComic } = useComic();

  if (!isComic) return null;

  return (
    <>
      {/* Subtle vintage print halftone screen across viewport */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-10 comic-halftone-screen select-none"
      />

      {/* Ambient 4-point comic star glints, ink flecks & speed dashes */}
      <ComicAtmosphere />

      {/* Occasional superhero silhouettes soaring across the skyline */}
      <ComicSkylinePatrol />

      {/* Editorial halftone corner plates & Hero Signal crosshair beacon */}
      <ComicCornerFrames />

      {/* Tactile onomatopoeia action bursts on interactive clicks/taps */}
      <ComicImpactBursts />

      {/* Minimal lower-margin print crop marks on wide screens */}
      <div
        aria-hidden="true"
        className="hidden xl:block fixed inset-5 pointer-events-none z-20 select-none"
      >
        <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#B58B32]/70" />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#B58B32]/70" />
      </div>
    </>
  );
};

export default ComicGlobalLayer;
