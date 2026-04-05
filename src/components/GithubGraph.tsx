import React from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import TiltCard from './ui/TiltCard';
import { playHover } from '@/hooks/useSoundEffects';

const GithubGraph = () => {
  return (
    <div className="w-full">
      <TiltCard
        className="w-full max-w-4xl mx-auto hidden md:block" // Tilt only for medium screens and up
        maxTilt={8}
        perspective={1500}
        scale={1.02}
      >
        <GraphContent />
      </TiltCard>
      
      {/* Static version for mobile/tablet without tilt for stability */}
      <div className="md:hidden w-full">
        <GraphContent isMobile />
      </div>
    </div>
  );
};

const GraphContent = ({ isMobile }: { isMobile?: boolean }) => (
  <div
    onMouseEnter={!isMobile ? playHover : undefined}
    className="border-4 border-black p-4 md:p-8 bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
  >
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b-2 border-black pb-4">
      <h3 className="font-mono text-xl font-bold uppercase tracking-tighter">
        GitHub Activity_
      </h3>
      <div className="flex items-center gap-2 font-mono text-[10px] text-black/50 uppercase">
        <span className="w-2 h-2 bg-green-500 animate-pulse" />
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
              light: ['#e5e5e5', '#a3a3a3', '#737373', '#404040', '#171717'],
            }}
            blockSize={isMobile ? 10 : 12}
            blockMargin={isMobile ? 3 : 4}
            fontSize={isMobile ? 10 : 12}
          />
        </div>
      </div>
      
      {/* Mobile Scroll Hint */}
      <div className="md:hidden flex items-center justify-center gap-2 mt-2 text-[10px] font-mono text-black/40 uppercase">
        <span>← Swipe to view →</span>
      </div>
    </div>

    <div className="mt-6 flex items-center justify-between font-mono text-[10px] uppercase text-black/60">
      <div className="flex items-center gap-4">
        <span>Total Contributions:</span>
        <span className="font-black text-black">1.2K+</span>
      </div>
      <div className="hidden sm:block">
        // Real-time contributions
      </div>
    </div>
  </div>
);

export default GithubGraph;
