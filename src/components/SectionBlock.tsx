import { useRef, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { useScrambleText } from '@/hooks/useScrambleText';

interface SectionBlockProps {
  id: string;
  title: string;
  children: ReactNode;
}

const SectionBlock = ({ id, title, children }: SectionBlockProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, scramble } = useScrambleText<HTMLHeadingElement>({
    duration: 750,
    fps: 28,
  });

  useGSAPContext(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // Detect mobile/tablet — reduce motion intensity for performance
      const isMobile = window.matchMedia('(max-width: 768px)').matches;

      // Section title — slides in from left + triggers scramble
      gsap.fromTo(
        section.querySelector('.gsap-section-title'),
        { opacity: 0, x: isMobile ? -20 : -40 },
        {
          opacity: 1,
          x: 0,
          duration: isMobile ? 0.6 : 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 88%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
            once: true,
            onEnter: () => {
              // Fire scramble 200ms after slide starts — feels like decoding
              setTimeout(scramble, 200);
            },
          },
        },
      );

      // Children content — fade + rise
      gsap.fromTo(
        section.querySelector('.gsap-section-content'),
        { opacity: 0, y: isMobile ? 30 : 50 },
        {
          opacity: 1,
          y: 0,
          duration: isMobile ? 0.7 : 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
            once: true,
          },
        },
      );
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
      <h2
        ref={titleRef}
        className="gsap-section-title section-title mb-12"
      >
        {title}.
      </h2>
      <div className="gsap-section-content">{children}</div>
    </section>
  );
};

export default SectionBlock;
