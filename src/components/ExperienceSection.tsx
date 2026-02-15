import SectionBlock from "./SectionBlock";

const experiences = [
  {
    role: "Full Stack Developer (Freelance)",
    company: "Academy of Tech Masters (AOTMS)",
    period: "[23DEC 2025 – 23JAN 2026]",
    description:
      "Led the development of a premier tech education platform. Implemented an AI-powered student assistant, an interactive learning dashboard, and a scalable course catalog. Ensured high performance and full responsiveness using React, TypeScript, and Vite.",
  },
  {
    role: "Frontend Developer (Project Lead)",
    company: "Elara Cosmetics",
    period: "[25JAN 2026 – 30JAN 2026]",
    description:
      "Architected and developed a premium Ayurvedic e-commerce platform. Focused on creating a seamless user journey with high-performance product filtering, a custom WhatsApp checkout integration, and robust form validation using TypeScript and Vitest.",
  },
  {
    role: "Lead Full Stack Developer",
    company: "EduPredict",
    period: "[07FEB 2026 IN 24HRS]",
    description:
      "Designed and developed an AI-driven student performance forecasting platform. Integrated predictive analytics with a gamified, comic-book aesthetic UI. Implemented role-based dashboards and automated reporting systems.",
  },
  {
    role: "Mobile App Developer",
    company: "SmartQuack (Personal Project)",
    period: "[15FEB 2026 - 19FEB 2026]",
    description:
      "Engineered an offline-first task management application using Flutter and Hive. Built a reactive mascot system that tracks user productivity and provides gamified feedback. Integrated Firebase for secure cloud synchronization and multi-device support.",
  },
];

const ExperienceSection = () => (
  <SectionBlock id="experience" title="Experience">
    <div className="space-y-12">
      {experiences.map((exp) => (
        <div
          key={exp.role}
          className="relative pl-8 md:pl-0 border-l md:border-l-0 border-black/20 md:grid md:grid-cols-[1fr_2fr] md:gap-8 pb-12 last:pb-0"
        >
          <div className="md:text-right md:pr-8 md:border-r border-black/20 relative">
            <div className="hidden md:block absolute top-1 -right-[5px] w-[9px] h-[9px] rounded-full bg-black"></div>
            <div className="md:hidden absolute top-1 -left-[5px] w-[9px] h-[9px] rounded-full bg-black"></div>

            <h4 className="font-mono text-sm tracking-widest text-foreground/60 uppercase mb-1">
              {exp.period}
            </h4>
            <h3 className="font-bold text-lg md:text-xl">{exp.company}</h3>
          </div>

          <div className="mt-2 md:mt-0">
            <h3 className="text-lg font-bold text-foreground md:hidden mb-2">
              {exp.role}
            </h3>
            <h3 className="text-xl font-bold text-foreground hidden md:block mb-3">
              {exp.role}
            </h3>
            <p className="body-text text-sm md:text-base">{exp.description}</p>
          </div>
        </div>
      ))}
    </div>
  </SectionBlock>
);

export default ExperienceSection;
