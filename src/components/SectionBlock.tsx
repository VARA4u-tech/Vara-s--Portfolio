import { useRef, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { useScrambleText } from '@/hooks/useScrambleText';
import { useComic, useHalloween } from '@/context/ThemeContext';

interface SectionBlockProps {
  id: string;
  title: string;
  children: ReactNode;
}

const COMIC_CHAPTER_KICKERS: Record<string, string> = {
  about: '01 // ORIGIN & PHILOSOPHY',
  education: '02 // ACADEMIC FOUNDATIONS',
  experience: '03 // CAREER CHRONICLES',
  achievements: '04 // CERTIFICATES & HONORS',
  projects: '05 // SELECTED ARCHIVE',
  skills: '06 // TECHNICAL ARSENAL',
  contact: '07 // DIRECT SIGNAL',
};

const SectionBlock = ({ id, title, children }: SectionBlockProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { isComic } = useComic();
  const { isHalloween } = useHalloween();
  const { ref: titleRef, scramble } = useScrambleText<HTMLHeadingElement>({
    duration: 750,
    fps: 28,
  });

  useGSAPContext(
    () => {
      const section = sectionRef.current;
      if (!section) return;

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

  const kicker = COMIC_CHAPTER_KICKERS[id];

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative max-w-6xl mx-auto px-6 py-16 md:py-32"
    >
      {isComic && kicker && (
        <div className="mb-4">
          <span className="comic-editorial-kicker">
            <span className="text-[#D9B45B]">◆</span>
            <span>{kicker}</span>
          </span>
        </div>
      )}

      <div className="overflow-hidden mb-12">
        <h2
          ref={titleRef}
          className="gsap-section-title section-title pb-2 inline-block"
        >
          {title}
          <span className={isHalloween ? 'text-[#FF7518]' : ''}>.</span>
        </h2>
        {isHalloween && (
          <div aria-hidden="true" className="mt-2 flex items-center gap-1.5">
            <span className="h-1 w-12 bg-[#FF7518]" />
            <span className="h-1 w-2 bg-black" />
          </div>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
};

export default SectionBlock;
