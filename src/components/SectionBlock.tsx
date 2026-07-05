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

      // Section title — masked slide-up + triggers scramble
      gsap.fromTo(
        section.querySelector('.gsap-section-title'),
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 1.2,
          ease: 'expo.out',
          force3D: true,
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            once: true, // we trigger it only once as requested
            onEnter: () => {
              // Fire scramble 200ms after slide starts
              setTimeout(scramble, 200);
            },
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
      <div className="overflow-hidden mb-12">
        <h2
          ref={titleRef}
          className="gsap-section-title section-title pb-2 inline-block"
        >
          {title}.
        </h2>
      </div>
      <div>{children}</div>
    </section>
  );
};

export default SectionBlock;
