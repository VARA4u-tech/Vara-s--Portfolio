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

      // Section title — slides in from left with an underline draw
      gsap.from(section.querySelector('.gsap-section-title'), {
        opacity: 0,
        x: -40,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      });

      // Children content — fade + parallax rise tied to scroll
      gsap.from(section.querySelector('.gsap-section-content'), {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'top 40%',
          toggleActions: 'play none none reverse',
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
