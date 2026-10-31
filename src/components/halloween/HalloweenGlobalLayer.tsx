import React from 'react';
import { useHalloween } from './HalloweenContext';
import SpiderWeb from './SpiderWeb';
import FlyingBats from './FlyingBats';
import SpookyAtmosphere from './SpookyAtmosphere';
import FloatingGhost from './FloatingGhost';
import './halloween.css';

export const HalloweenGlobalLayer: React.FC = () => {
  const { isHalloween } = useHalloween();

  if (!isHalloween) return null;

  return (
    <>
      {/* Ambient glowing embers / particles */}
      <SpookyAtmosphere />

      {/* Occasional flying bats soaring across screen */}
      <FlyingBats />

      {/* Fixed subtle spiderwebs on top-left and top-right viewport edges */}
      <div className="fixed top-0 left-0 right-0 pointer-events-none z-30 overflow-hidden h-40">
        <SpiderWeb position="top-left" size={130} />
        <SpiderWeb position="top-right" size={150} withSpider={true} />
      </div>

      {/* Floating Ghost Easter Egg Companion (Bottom right corner) */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40">
        <FloatingGhost size={46} interactive={true} />
      </div>
    </>
  );
};

export default HalloweenGlobalLayer;

