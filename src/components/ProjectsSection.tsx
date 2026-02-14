import { Github, ExternalLink } from "lucide-react";
import SectionBlock from "./SectionBlock";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const projects = [
  {
    title: "DeFi Dashboard",
    description:
      "A decentralized finance dashboard built on Aptos blockchain with real-time analytics and portfolio tracking.",
    tags: ["React", "TypeScript", "Aptos", "Move"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    title: "TaskFlow",
    description:
      "A minimal task management app with drag-and-drop, built with Flutter and Firebase for seamless cross-platform sync.",
    tags: ["Flutter", "Firebase", "Dart"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    title: "DevConnect",
    description:
      "A developer networking platform with real-time chat, project showcases, and community-driven code reviews.",
    tags: ["Next.js", "Supabase", "Tailwind"],
    githubUrl: "#",
    liveUrl: "#",
  },
];

const ProjectsSection = () => (
  <SectionBlock id="projects" title="Projects">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <div
          key={project.title}
          className="group border border-black/10 p-6 flex flex-col justify-between hover:border-black transition-colors duration-300 bg-white"
        >
          <div>
            <h3 className="text-xl font-bold text-foreground group-hover:underline decoration-2 underline-offset-4">
              {project.title}
            </h3>
            <p className="body-text mt-4 text-sm">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="font-mono text-xs font-normal"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-4 border-t border-black/5">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-black transition-colors"
            >
              <Github className="w-4 h-4" />
              Source
            </a>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-black transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Demo
            </a>
          </div>
        </div>
      ))}
    </div>
  </SectionBlock>
);

export default ProjectsSection;
