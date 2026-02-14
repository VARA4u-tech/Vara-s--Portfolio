import SectionBlock from "./SectionBlock";
import GithubGraph from "./GithubGraph";

const skills = [
  "Flutter",
  "Firebase",
  "React",
  "TypeScript",
  "Aptos",
  "Move",
  "Git",
  "Tailwind CSS",
  "Node.js",
  "Figma",
];

const SkillsSection = () => (
  <SectionBlock id="skills" title="Technical skill">
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
