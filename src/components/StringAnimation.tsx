import { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface StringAnimationProps {
  className?: string;
}

const StringAnimation = ({ className = '' }: StringAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { top, left, width } = containerRef.current.getBoundingClientRect();

    const x = e.clientX - left;
    const y = e.clientY - top;

    controls.set({ d: `M 0 50 Q ${x} ${y} ${width} 50` });
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    const { width } = containerRef.current.getBoundingClientRect();

    controls.start({
      d: `M 0 50 Q ${width / 2} 50 ${width} 50`,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 10,
        mass: 1,
      },
    });
  };

  // Set initial width and handle resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updatePath = () => {
      if (!containerRef.current) return;
      const { width } = containerRef.current.getBoundingClientRect();
      controls.set({ d: `M 0 50 Q ${width / 2} 50 ${width} 50` });
    };

    updatePath();

    window.addEventListener('resize', updatePath);
    return () => window.removeEventListener('resize', updatePath);
  }, [controls]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-[100px] flex items-center justify-center cursor-pointer relative z-10 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg className="w-full h-full pointer-events-none">
        <motion.path
          animate={controls}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-foreground/20"
        />
      </svg>
    </div>
  );
};

export default StringAnimation;
