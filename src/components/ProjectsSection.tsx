import SectionBlock from "./SectionBlock";

const projects = [
  {
    title: "DeFi Dashboard",
    description:
      "A decentralized finance dashboard built on Aptos blockchain with real-time analytics and portfolio tracking.",
  },
  {
    title: "TaskFlow",
    description:
      "A minimal task management app with drag-and-drop, built with Flutter and Firebase for seamless cross-platform sync.",
  },
  {
    title: "DevConnect",
    description:
      "A developer networking platform with real-time chat, project showcases, and community-driven code reviews.",
  },
];

const ProjectsSection = () => (
  <SectionBlock id="projects" title="Projects">
    <div className="space-y-10">
      {projects.map((project) => (
        <div key={project.title}>
          <h3 className="text-lg md:text-xl font-bold text-foreground">
            {project.title}
          </h3>
          <p className="body-text mt-2 max-w-2xl">{project.description}</p>
        </div>
      ))}
    </div>
  </SectionBlock>
);

export default ProjectsSection;
