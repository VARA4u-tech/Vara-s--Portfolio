import React from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import TiltCard from './ui/TiltCard';
import { playHover } from '@/hooks/useSoundEffects';
import { useComic, useHalloween } from '@/context/ThemeContext';

const GithubGraph = () => {
  const { isComic } = useComic();
  const { isHalloween } = useHalloween();

  return (
    <div className="w-full">
      <TiltCard
        className="w-full max-w-4xl mx-auto hidden md:block"
        maxTilt={8}
        perspective={1500}
        scale={1.02}
      >
        <GraphContent isComic={isComic} isHalloween={isHalloween} />
      </TiltCard>

      {/* Static version for mobile/tablet without tilt for stability */}
      <div className="md:hidden w-full">
        <GraphContent isMobile isComic={isComic} isHalloween={isHalloween} />
      </div>
    </div>
  );
};

const GraphContent = ({
  isMobile,
  isComic,
  isHalloween,
}: {
  isMobile?: boolean;
  isComic?: boolean;
  isHalloween?: boolean;
}) => (
  <div
    onMouseEnter={!isMobile ? playHover : undefined}
    className={`border-4 p-4 md:p-8 transition-all duration-300 ${
      isComic
        ? 'border-[#D9D9D9] bg-[#FFFFFF] text-[#171717] shadow-[5px_5px_0px_#B58B32] md:shadow-[8px_8px_0px_#D9B45B]'
        : isHalloween
          ? 'border-black bg-white text-black shadow-[4px_4px_0px_0px_#FF7518] md:shadow-[8px_8px_0px_0px_#FF7518]'
          : 'border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
    }`}
  >
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b-2 pb-4 ${
        isComic ? 'border-[#171717]' : 'border-black'
      }`}
    >
      <h3 className="font-mono text-xl font-bold uppercase tracking-tighter text-[#171717]">
        GitHub Activity_
      </h3>
      <div
        className={`flex items-center gap-2 font-mono text-[10px] uppercase ${
          isComic ? 'text-[#888888]' : 'text-black/50'
        }`}
      >
        <span
          className={`w-2 h-2 ${
            isComic
              ? 'bg-[#D9B45B]'
              : isHalloween
                ? 'bg-[#FF7518] animate-pulse'
                : 'bg-green-500 animate-pulse'
          }`}
        />
        Synced with GitHub Server
      </div>
    </div>

    <div className="relative group/scroll">
      <div className="flex justify-start md:justify-center overflow-x-auto pb-4 scrollbar-hide snap-x cursor-grab active:cursor-grabbing">
        <div className="min-w-[600px] md:min-w-0 transition-transform">
          <GitHubCalendar
            username="VARA4u-tech"
            colorScheme="light"
            style={{
              fontFamily: 'monospace',
            }}
            theme={{
              light: isComic
                ? ['#D9D9D9', '#888888', '#171717', '#B58B32', '#D9B45B']
                : isHalloween
                  ? ['#f3f4f6', '#fed7aa', '#fdba74', '#fb923c', '#ff7518']
                  : ['#e5e5e5', '#a3a3a3', '#737373', '#404040', '#171717'],
            }}
            blockSize={isMobile ? 10 : 12}
            blockMargin={isMobile ? 3 : 4}
            fontSize={isMobile ? 10 : 12}
          />
        </div>
      </div>

      {/* Mobile Scroll Hint */}
      <div
        className={`md:hidden flex items-center justify-center gap-2 mt-2 text-[10px] font-mono uppercase ${
          isComic ? 'text-[#888888]' : 'text-black/40'
        }`}
      >
        <span>← Swipe to view →</span>
      </div>
    </div>

    <div
      className={`mt-6 flex items-center justify-between font-mono text-[10px] uppercase ${
        isComic ? 'text-[#888888]' : 'text-black/60'
      }`}
    >
      <div className="flex items-center gap-4">
        <span>Total Contributions:</span>
        <span className="font-black text-[#171717]">1.2K+</span>
      </div>
      <div className="hidden sm:block">// Real-time contributions</div>
    </div>
  </div>
);

export default GithubGraph;
