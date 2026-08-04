import { useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import useSoundEffects from '@/hooks/useSoundEffects';

const PixelPet = () => {
  const controls = useAnimationControls();
  const jumpControls = useAnimationControls();
  const { playBark } = useSoundEffects();
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [state, setState] = useState<'walking' | 'idle' | 'sleeping' | 'looking'>('idle');

  useEffect(() => {
    let isActive = true;

    const patrol = async () => {
      // Small initial delay
      await new Promise((r) => setTimeout(r, 1000));
      
      while (isActive) {
        // Idle for a moment
        setState('idle');
        await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));
        if (!isActive) break;

        // Walk right
        setDirection('right');
        setState('walking');
        await controls.start({
          x: ['0vw', 'calc(100vw - 80px)'],
          transition: { duration: 12 + Math.random() * 4, ease: 'linear' },
        });
        if (!isActive) break;

        // Stop and look at user
        setState('looking');
        await new Promise((r) => setTimeout(r, 3000));
        if (!isActive) break;

        // Walk left
        setDirection('left');
        setState('walking');
        await controls.start({
          x: ['calc(100vw - 80px)', '0vw'],
          transition: { duration: 12 + Math.random() * 4, ease: 'linear' },
        });
        if (!isActive) break;

        // Sleep at the edge
        setState('sleeping');
        await new Promise((r) => setTimeout(r, 3000 + Math.random() * 2000));
        if (!isActive) break;
      }
    };

    patrol();
    return () => {
      isActive = false;
    };
  }, [controls]);

  return (
    <motion.div
      className="absolute bottom-full left-0 z-20 pointer-events-auto cursor-pointer mb-[-2px]"
      animate={controls}
      initial={{ x: '0vw' }}
      style={{ transformOrigin: 'bottom center' }}
      onClick={() => {
        playBark();
        jumpControls.start({
          y: [0, -35, 0],
          transition: { duration: 0.35, ease: 'circOut' }
        });
        if (state === 'sleeping') setState('idle');
      }}
      title="Touch to jump!"
    >
      <style>
        {`
          .pixel-pet-walking .pixel-legs-standing {
            animation: pet-step 0.25s infinite;
          }
          .pixel-pet-walking .pixel-legs-walking {
            animation: pet-step 0.25s infinite 0.125s;
            opacity: 0;
          }
          .pixel-pet-idle .pixel-legs-walking,
          .pixel-pet-sleeping .pixel-legs-walking {
            display: none;
          }
          .pixel-pet-sleeping .pixel-eye-open {
            display: none;
          }
          .pixel-pet-sleeping .pixel-eye-closed {
            display: block;
          }
          .pixel-pet-idle .pixel-eye-closed,
          .pixel-pet-walking .pixel-eye-closed,
          .pixel-pet-looking .pixel-eye-closed {
            display: none;
          }
          .pixel-pet-sleeping .pixel-z {
            animation: float-z 2.5s infinite linear;
            opacity: 0;
          }
          @keyframes pet-step {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
          }
          @keyframes float-z {
            0% { transform: translateY(0) scale(0.5); opacity: 0; }
            20% { opacity: 1; }
            80% { transform: translateY(-12px) scale(1.2); opacity: 0; }
            100% { opacity: 0; }
          }
        `}
      </style>

      <motion.div animate={jumpControls} className="relative ml-4 md:ml-8">
        {/* Tooltip when looking */}
        {state === 'looking' && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-sm font-black font-mono animate-bounce select-none pointer-events-none z-30">
            ?
          </div>
        )}

        <div style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}>
          <div
            className={`relative transition-transform duration-300 w-9 h-9 md:w-10 md:h-10 ${
              state === 'walking'
                ? 'pixel-pet-walking -translate-y-1'
                : state === 'sleeping'
                  ? 'pixel-pet-sleeping translate-y-1'
                  : state === 'looking'
                    ? 'pixel-pet-looking'
                    : 'pixel-pet-idle'
            }`}
          >
          {/* Zzz animation when sleeping */}
          {state === 'sleeping' && (
            <div className="absolute -top-4 -right-1 text-xs font-black font-mono pixel-z select-none">
              Z
            </div>
          )}

          <svg viewBox="0 0 16 16" className="w-full h-full text-black drop-shadow-sm">
            {/* Ears */}
            <rect x="10" y="3" width="2" height="2" fill="currentColor" />
            <rect x="13" y="3" width="2" height="2" fill="currentColor" />
            {/* Head */}
            <rect x="9" y="5" width="6" height="5" fill="currentColor" />
            
            {/* Eyes - Open */}
            <g className="pixel-eye-open">
              <rect x="10" y="6" width="1" height="1" fill="white" />
              <rect x="13" y="6" width="1" height="1" fill="white" />
            </g>
            {/* Eyes - Closed (Sleeping) */}
            <g className="pixel-eye-closed">
              <rect x="10" y="7" width="1" height="1" fill="white" />
              <rect x="13" y="7" width="1" height="1" fill="white" />
            </g>

            {/* Body */}
            <rect x="2" y="7" width="7" height="5" fill="currentColor" />
            {/* Tail */}
            <rect x="1" y="5" width="1" height="4" fill="currentColor" />
            <rect x="0" y="4" width="1" height="1" fill="currentColor" />

            {/* Legs */}
            <g className="pixel-legs-standing">
              <rect x="3" y="12" width="2" height="2" fill="currentColor" />
              <rect x="6" y="12" width="2" height="2" fill="currentColor" />
            </g>
            <g className="pixel-legs-walking">
              <rect x="2" y="12" width="2" height="2" fill="currentColor" />
              <rect x="7" y="12" width="2" height="2" fill="currentColor" />
            </g>
          </svg>
        </div>
      </div>
      </motion.div>
    </motion.div>
  );
};

export default PixelPet;
