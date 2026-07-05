import { useRef, ReactNode } from 'react';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { gsap } from '@/lib/gsap';

interface ScrollRevealProps {
  children: ReactNode;
  animation?:
    | 'fade-up'
    | 'fade-in'
    | 'scale-up'
    | 'mask-up'
    | 'stagger-fade-up';
  duration?: number;
  delay?: number;
  stagger?: number;
  className?: string;
  triggerOffset?: string;
}

export const ScrollReveal = ({
  children,
  animation = 'fade-up',
  duration = 0.8,
  delay = 0,
  stagger = 0.1,
  className = '',
  triggerOffset = 'top 85%',
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAPContext(
    () => {
      const el = containerRef.current;
      if (!el) return;

      if (animation === 'fade-up') {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: triggerOffset,
              once: true,
            },
          },
        );
      } else if (animation === 'fade-in') {
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration,
            delay,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: triggerOffset,
              once: true,
            },
          },
        );
      } else if (animation === 'scale-up') {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.9, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration,
            delay,
            ease: 'back.out(1.5)',
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: triggerOffset,
              once: true,
            },
          },
        );
      } else if (animation === 'mask-up') {
        const child = el.firstElementChild;
        if (child) {
          gsap.fromTo(
            child,
            { y: '100%' },
            {
              y: '0%',
              duration: 1.2,
              delay,
              ease: 'expo.out',
              force3D: true,
              scrollTrigger: {
                trigger: el,
                start: triggerOffset,
                once: true,
              },
            },
          );
        }
      } else if (animation === 'stagger-fade-up') {
        const childrenElements = el.children;
        gsap.fromTo(
          childrenElements,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            stagger,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: triggerOffset,
              once: true,
            },
          },
        );
      }
    },
    containerRef,
    [animation],
  );

  if (animation === 'mask-up') {
    return (
      <div ref={containerRef} className={`overflow-hidden ${className}`}>
        <div className="inline-block">{children}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};
