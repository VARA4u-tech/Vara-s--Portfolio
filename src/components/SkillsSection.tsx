import SectionBlock from "./SectionBlock";
import GithubGraph from "./GithubGraph";

const skills = [
  "Flutter",
  "React",
  "TypeScript",
  "Dart",
  "Firebase",
  "Tailwind CSS",
  "Node.js",
  "TanStack Query",
  "Zustand",
  "Framer Motion",
  "Riverpod",
  "Shadcn UI",
  "MongoDB",
  "AI Integration",
  "Aptos",
  "Move",
  "Hive",
  "Vitest",
  "Git",
  "Figma",
];

const SkillsSection = () => (
  <SectionBlock id="skills" title="Technical Skills">
    <div className="flex flex-wrap gap-3 mb-12">
      {skills.map((skill) => (
        <span
          key={skill}
          className="px-4 py-2 border border-black/10 text-sm font-medium hover:border-black hover:bg-black hover:text-white transition-all duration-300 cursor-default"
        >
          {skill}
        </span>
      ))}
    </div>
    <div className="w-full">
      <GithubGraph />
    </div>
  </SectionBlock>
);

export default SkillsSection;
