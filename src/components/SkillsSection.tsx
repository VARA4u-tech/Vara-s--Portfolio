import SectionBlock from "./SectionBlock";
import GithubGraph from "./GithubGraph";

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      "React",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Zustand",
      "TanStack Query",
      "Framer Motion",
      "Shadcn UI",
      "Vite",
    ],
  },
  {
    title: "Mobile",
    skills: ["Flutter", "Dart", "Riverpod", "Material Design"],
  },
  {
    title: "Backend & DB",
    skills: ["Node.js", "Firebase", "MongoDB", "Hive", "REST APIs"],
  },
  {
    title: "Web3 & AI",
    skills: ["Aptos", "Move", "AI Integration", "Prompt Engineering"],
  },
  {
    title: "Tools & Others",
    skills: ["Git", "GitHub", "Figma", "Vitest", "Lucide React", "Vercel"],
  },
];

const SkillsSection = () => (
  <SectionBlock id="skills" title="Technical Skills">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      {skillCategories.map((category, idx) => (
        <div
          key={category.title}
          className="group opacity-0 animate-in fade-in slide-in-from-bottom-4 fill-mode-forwards"
          style={{
            animationDelay: `${idx * 100}ms`,
            animationDuration: "600ms",
            animationFillMode: "forwards",
          }}
        >
          <div className="flex flex-col h-full border-t-2 border-black pt-4">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] mb-6 text-black/40 group-hover:text-black transition-colors duration-300">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 border border-black/5 text-xs font-medium hover:border-black hover:bg-black hover:text-white transition-all duration-300 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="w-full pt-12 border-t border-black/5">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-black/40">
            Activity Graph
          </h3>
          <div className="h-[1px] flex-1 bg-black/5 mx-6"></div>
        </div>
        <GithubGraph />
      </div>
    </div>
  </SectionBlock>
);

export default SkillsSection;
