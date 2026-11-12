import { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { playWhoosh } from '@/hooks/useSoundEffects';
import { useLenis } from 'lenis/react';
import { useHalloween } from '@/context/ThemeContext';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isHalloween } = useHalloween();

  const lenis = useLenis(({ scroll, progress }) => {
    setProgress(progress * 100);
    setVisible(scroll > 400);
  });

  // Circle configuration
  const size = 48;
  const strokeWidth = 3;
  const center = size / 2;
  const radius = center - strokeWidth - 2; // -2 for padding
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={() => {
        playWhoosh();
        lenis?.scrollTo(0, {
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }}
      className={`fixed bottom-6 left-6 z-50 group transition-all duration-500 ease-out ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <div
        className={`relative flex items-center justify-center bg-background/80 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 ${
          isHalloween ? 'hover:shadow-[0_0_12px_rgba(255,117,24,0.45)]' : ''
        }`}
      >
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-foreground/10"
          />
          {/* Progress Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-100 ${
              isHalloween ? 'text-[#FF7518]' : 'text-foreground'
            }`}
          />
        </svg>

        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ArrowUp
            className={`w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300 ${
              isHalloween
                ? 'text-black group-hover:text-[#FF7518]'
                : 'text-foreground/80'
            }`}
          />
        </div>
      </div>
    </button>
  );
};

export default ScrollToTop;
