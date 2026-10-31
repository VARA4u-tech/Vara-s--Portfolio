import SectionBlock from './SectionBlock';
import { ScrollReveal } from './ui/ScrollReveal';

const experiences = [
  {
    role: 'Frontend Developer (Freelance)',
    company: 'AOTMS LMS Portal',
    period: '08 Feb 2026 – 28 Apr 2026',
    description:
      '🚀 Freelance Project – Successfully architected and delivered an end-to-end, enterprise-grade Learning Management System. Engineered responsive interfaces and real-time state management using React, TypeScript, Node.js, Express, and MongoDB. Key milestones: ✦ Scalable modular frontend architecture ✦ Role-based dashboards ✦ High client satisfaction with zero post-launch regressions.',
  },
  {
    role: 'MERN Stack Developer (Freelance)',
    company: 'Academy of Tech Masters (AOTMS)',
    period: '23 Dec 2025 – 23 Jan 2026',
    description:
      '🚀 Freelance Project – Successfully delivered a real-world client portal using the MERN stack (MongoDB, Express, React, Node.js). Key milestones: ✦ Developing scalable API endpoints and UI modules ✦ Team collaboration and Git workflows ✦ Delivering production-grade features ahead of deadlines.',
  },
  {
    role: 'Generative AI & Prompt Engineering Intern',
    company: 'Blackbuck Engineers',
    period: 'May 2025 – Jul 2025',
    description:
      'Completed an intensive 120-hour internship focused on LLMs, structured Prompt Engineering, and Generative AI workflows. Developed domain expertise in prompt templating, fine-tuning task pipelines, and integrating intelligent agentic features into full-stack software applications.',
  },
];

const ExperienceSection = () => (
  <SectionBlock id="experience" title="Experience">
    <ScrollReveal animation="stagger-fade-up" className="space-y-12">
      {experiences.map((exp) => (
        <article
          key={exp.role}
          className="relative pl-8 md:pl-0 border-l md:border-l-0 border-black/20 md:grid md:grid-cols-[1fr_2fr] md:gap-8 pb-12 last:pb-0"
        >
          <div className="md:text-right md:pr-8 md:border-r border-black/20 relative">
            <div className="hidden md:block absolute top-1 -right-[5px] w-[9px] h-[9px] rounded-none bg-black"></div>
            <div className="md:hidden absolute top-1 -left-[5px] w-[9px] h-[9px] rounded-none bg-black"></div>

            <time className="block font-mono text-xs tracking-widest text-foreground/60 uppercase mb-1">
              {exp.period}
            </time>
            <h3 className="font-bold text-base md:text-lg">{exp.company}</h3>
          </div>

          <div className="mt-2 md:mt-0">
            <h4 className="text-base font-bold text-foreground md:hidden mb-2">
              {exp.role}
            </h4>
            <h4 className="text-lg font-bold text-foreground hidden md:block mb-3">
              {exp.role}
            </h4>
            <p className="body-text text-sm">{exp.description}</p>
          </div>
        </article>
      ))}
    </ScrollReveal>
  </SectionBlock>
);

export default ExperienceSection;
