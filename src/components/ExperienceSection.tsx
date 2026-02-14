import SectionBlock from "./SectionBlock";

const experiences = [
  {
    role: "Frontend Developer",
    company: "Tech Corp",
    period: "2023 – Present",
    description:
      "Building scalable web applications with React and TypeScript. Leading UI architecture decisions and mentoring junior developers.",
  },
  {
    role: "Mobile Developer Intern",
    company: "Startup Studio",
    period: "2022 – 2023",
    description:
      "Developed cross-platform mobile applications using Flutter. Shipped 3 production apps with 10k+ downloads.",
  },
];

const ExperienceSection = () => (
  <SectionBlock id="experience" title="Experience">
    <div className="space-y-12">
      {experiences.map((exp) => (
        <div key={exp.role}>
          <h3 className="text-lg md:text-xl font-bold text-foreground">
            {exp.role}
          </h3>
          <p className="text-foreground/60 text-sm tracking-wide mt-1">
            {exp.company} — {exp.period}
          </p>
          <p className="body-text mt-3 max-w-2xl">{exp.description}</p>
        </div>
      ))}
    </div>
  </SectionBlock>
);

export default ExperienceSection;
