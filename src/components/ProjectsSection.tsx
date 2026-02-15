import { Github, ExternalLink } from "lucide-react";
import SectionBlock from "./SectionBlock";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const projects = [
  {
    title: "Academy of Tech Masters (AOTMS)",
    description:
      "A premier tech education platform featuring AI-powered assistance, interactive student dashboards, and comprehensive course management. Delivered as a high-performance freelance project for a real-world client.",
    tags: [
      "React",
      "TypeScript",
      "Tailwind",
      "Vite",
      "Zustand",
      "Framer Motion",
    ],
    githubUrl: "https://github.com/VARA4u-tech/AOTMS",
    liveUrl: "https://aotms.in",
  },
  {
    title: "Elara Cosmetics",
    description:
      "A luxury Ayurvedic e-commerce platform with a focus on premium user experience. Features category-based filtering, shopping cart, wishlist, and a custom WhatsApp-integrated checkout system.",
    tags: ["React", "TypeScript", "Tailwind", "Vite", "Shadcn UI", "Vitest"],
    githubUrl:
      "https://github.com/VARA4u-tech/Elara-Cosmetics-E--Commerce-Website-",
    liveUrl: "https://elara-cosmetics.vercel.app/",
  },
  {
    title: "EduPredict",
    description:
      "An AI-powered predictive analytics system for student success, featuring a unique comic book-inspired UI, interactive dashboards, and real-time at-risk student alerts.",
    tags: [
      "React",
      "TypeScript",
      "Tailwind",
      "Vite",
      "Lucide React",
      "Framer Motion",
    ],
    githubUrl: "https://github.com/VARA4u-tech/EduPredict",
    liveUrl: "https://edu-pridect.vercel.app/",
  },
  {
    title: "SmartQuack",
    description:
      "A delightful, offline-first task manager with a gamified twist! Features a reactive duck mascot that changes moods based on your productivity progress.",
    tags: ["Flutter", "Riverpod", "Firebase", "Hive", "Dart"],
    githubUrl: "https://github.com/VARA4u-tech/my-first-flutter-app",
    liveUrl: "https://github.com/VARA4u-tech/my-first-flutter-app",
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
