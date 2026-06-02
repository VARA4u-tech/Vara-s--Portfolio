import { useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useGSAPContext } from '@/hooks/useGSAPContext';

interface SectionBlockProps {
  id: string;
  title: string;
  children: ReactNode;
}

const SectionBlock = ({ id, title, children }: SectionBlockProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPContext(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // Detect mobile/tablet — reduce motion intensity for performance
      const isMobile = window.matchMedia('(max-width: 768px)').matches;

      // Section title — slides in from left
      gsap.from(section.querySelector('.gsap-section-title'), {
        opacity: 0,
        x: isMobile ? -20 : -40, // gentler on mobile
        duration: isMobile ? 0.6 : 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 88%',    // fire a bit earlier on all devices
          end: 'top 55%',
          toggleActions: 'play none none reverse',
          // Prevents flicker when ScrollTrigger recalculates on orientation change
          invalidateOnRefresh: true,
        },
      });

      // Children content — fade + rise
      gsap.from(section.querySelector('.gsap-section-content'), {
        opacity: 0,
        y: isMobile ? 30 : 50, // lighter y offset on mobile
        duration: isMobile ? 0.7 : 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          end: 'top 45%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        },
      });
    },
    sectionRef,
    [id],
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className="max-w-6xl mx-auto px-6 py-16 md:py-32"
    >
      <h2 className="gsap-section-title section-title mb-12">{title}.</h2>
      <div className="gsap-section-content">{children}</div>
    </section>
  );
};

export default SectionBlock;
