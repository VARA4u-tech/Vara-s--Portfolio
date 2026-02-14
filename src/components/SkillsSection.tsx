import SectionBlock from "./SectionBlock";

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
    <p className="text-lg md:text-2xl font-medium text-foreground/80 leading-relaxed tracking-wide">
      {skills.join(" / ")}
    </p>
  </SectionBlock>
);

export default SkillsSection;
