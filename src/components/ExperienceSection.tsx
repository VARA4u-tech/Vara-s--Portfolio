import SectionBlock from './SectionBlock';
import { ScrollReveal } from './ui/ScrollReveal';
import { useComic, useHalloween } from '@/context/ThemeContext';

const experiences = [
  {
    role: 'Frontend Developer (Freelance)',
    company: 'AOTMS LMS Portal',
    chapter: 'EP. 03',
    period: '08 Feb 2026 – 28 Apr 2026',
    description:
      '🚀 Freelance Project – Successfully architected and delivered an end-to-end, enterprise-grade Learning Management System. Engineered responsive interfaces and real-time state management using React, TypeScript, Node.js, Express, and MongoDB. Key milestones: ✦ Scalable modular frontend architecture ✦ Role-based dashboards ✦ High client satisfaction with zero post-launch regressions.',
  },
  {
    role: 'MERN Stack Developer (Freelance)',
    company: 'Academy of Tech Masters (AOTMS)',
    chapter: 'EP. 02',
    period: '23 Dec 2025 – 23 Jan 2026',
    description:
      '🚀 Freelance Project – Successfully delivered a real-world client portal using the MERN stack (MongoDB, Express, React, Node.js). Key milestones: ✦ Developing scalable API endpoints and UI modules ✦ Team collaboration and Git workflows ✦ Delivering production-grade features ahead of deadlines.',
  },
  {
    role: 'Generative AI & Prompt Engineering Intern',
    company: 'Blackbuck Engineers',
    chapter: 'EP. 01',
    period: 'May 2025 – Jul 2025',
    description:
      'Completed an intensive 120-hour internship focused on LLMs, structured Prompt Engineering, and Generative AI workflows. Developed domain expertise in prompt templating, fine-tuning task pipelines, and integrating intelligent agentic features into full-stack software applications.',
  },
];

const ExperienceSection = () => {
  const { isComic } = useComic();
  const { isHalloween } = useHalloween();

  return (
    <SectionBlock id="experience" title="Experience">
      <ScrollReveal animation="stagger-fade-up" className="space-y-12">
        {experiences.map((exp, i) => {
          const isLatest = i === 0;

          return (
            <article
              key={exp.role}
              className={`relative pl-8 md:pl-0 border-l md:border-l-0 md:grid md:grid-cols-[1fr_2fr] md:gap-8 pb-12 last:pb-0 ${
                isComic
                  ? 'border-[#888888]'
                  : isHalloween
                    ? 'border-[#FF7518]/35'
                    : 'border-black/20'
              }`}
            >
              <div
                className={`md:text-right md:pr-8 md:border-r relative ${
                  isComic
                    ? 'md:border-[#888888]'
                    : isHalloween
                      ? 'md:border-[#FF7518]/35'
                      : 'border-black/20'
                }`}
              >
                {/* Desktop Timeline Node */}
                <div
                  className={`hidden md:block absolute top-1.5 rounded-none ${
                    isComic
                      ? `-right-[7px] w-[13px] h-[13px] border-2 border-[#171717] rotate-45 ${
                          isLatest ? 'bg-[#D9B45B]' : 'bg-[#FFFFFF]'
                        }`
                      : isHalloween
                        ? `-right-[6px] w-[11px] h-[11px] border border-black ${
                            isLatest ? 'bg-[#FF7518]' : 'bg-black'
                          }`
                        : '-right-[5px] w-[9px] h-[9px] bg-black'
                  }`}
                />
                {/* Mobile Timeline Node */}
                <div
                  className={`md:hidden absolute top-1.5 rounded-none ${
                    isComic
                      ? `-left-[7px] w-[13px] h-[13px] border-2 border-[#171717] rotate-45 ${
                          isLatest ? 'bg-[#D9B45B]' : 'bg-[#FFFFFF]'
                        }`
                      : isHalloween
                        ? `-left-[6px] w-[11px] h-[11px] border border-black ${
                            isLatest ? 'bg-[#FF7518]' : 'bg-black'
                          }`
                        : '-left-[5px] w-[9px] h-[9px] bg-black'
                  }`}
                />

                <div className="flex items-center gap-2 md:justify-end mb-1.5 flex-wrap">
                  {isComic && (
                    <span
                      className={`${
                        isLatest ? 'comic-badge-gold' : 'comic-badge-concrete'
                      } text-[9px] px-2 py-0.5`}
                    >
                      {exp.chapter}
                    </span>
                  )}
                  <time
                    className={`block font-mono text-xs tracking-widest uppercase ${
                      isComic
                        ? 'text-[#D9D9D9]'
                        : isHalloween
                          ? 'text-[#FF7518] font-bold'
                          : 'text-foreground/60'
                    }`}
                  >
                    {exp.period}
                  </time>
                </div>
                <h3
                  className={`font-bold text-base md:text-lg ${
                    isComic ? 'text-[#FFFFFF]' : ''
                  }`}
                >
                  {exp.company}
                </h3>
              </div>

              <div
                className={`mt-2 md:mt-0 ${
                  isComic ? 'comic-panel-white p-5 md:p-6' : ''
                }`}
              >
                <h4
                  className={`text-base font-bold md:hidden mb-2 ${
                    isComic ? 'text-[#171717]' : 'text-foreground'
                  }`}
                >
                  {exp.role}
                </h4>
                <h4
                  className={`text-lg font-bold hidden md:block mb-3 ${
                    isComic ? 'text-[#171717]' : 'text-foreground'
                  }`}
                >
                  {exp.role}
                </h4>
                <p
                  className={`text-sm leading-relaxed ${
                    isComic ? 'text-[#171717]/85 font-normal' : 'body-text'
                  }`}
                >
                  {exp.description}
                </p>
              </div>
            </article>
          );
        })}
      </ScrollReveal>
    </SectionBlock>
  );
};

export default ExperienceSection;
