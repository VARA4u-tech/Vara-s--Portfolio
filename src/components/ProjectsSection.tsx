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
              className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-black hover:text-white"
            >
              <Github className="w-4 h-4" />
              Source
            </a>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-black hover:text-white"
            >
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </a>
          </div>
        </div>
      ))}
    </div>
  </SectionBlock>
);

export default ProjectsSection;
