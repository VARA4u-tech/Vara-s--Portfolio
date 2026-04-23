import { Github, ExternalLink, Code2 } from 'lucide-react';
import SectionBlock from './SectionBlock';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { playHover, playClick } from '@/hooks/useSoundEffects';

const projects = [
  {
    title: 'TrueVex Technologies',
    isNew: true,
    description:
      'A premium software consultancy platform designed with a high-end, Brutalist-Modern aesthetic, focusing on immersive interactivity and pixel-perfect responsiveness.',
    tags: [
      'React',
      'TypeScript',
      'Tailwind',
      'Framer Motion',
      'GSAP',
      'TanStack Router',
      'Vite',
    ],
    githubUrl: 'https://github.com/VARA4u-tech/true-vex-tech',
    liveUrl: 'https://truevextechnologies.netlify.app/',
  },
  {
    title: 'Vidyalaya',
    isNew: false,
    description:
      'An AI-powered study platform that transforms any PDF into summaries, quizzes, and personalized study plans in seconds.',
    tags: [
      'React',
      'Vite',
      'TypeScript',
      'Tailwind',
      'Framer Motion',
      'Node.js',
      'Vercel',
      'AI',
    ],
    githubUrl: 'https://github.com/VARA4u-tech/Vidyalaya',
    liveUrl: 'https://vidyalaya-nine.vercel.app',
  },
  {
    title: 'LOGICIA — Your AI Logic Brain',
    description:
      'An intelligent, all-in-one AI tutor designed specifically for competitive exams like UPSC, SSC, and Banking, featuring step-by-step logic, exam shortcuts, and bilingual support.',
    tags: [
      'React',
      'Vite',
      'TypeScript',
      'FastAPI',
      'Python',
      'SymPy',
      'MongoDB',
      'AI',
      'Agile',
    ],
    githubUrl: 'https://github.com/VARA4u-tech/-LOGICIA_Your_AI_Logic_Brain_',
    liveUrl: 'https://logicia-your-ai-logic-brain.vercel.app',
  },
  {
    title: 'Lakshmi Fashion Designers',
    description:
      'A premium e-commerce portal for a modern tailoring and fancy store, featuring multi-language support (English & Telugu) and AI-powered product collections.',
    tags: [
      'React',
      'TypeScript',
      'Tailwind',
      'Node.js',
      'Express',
      'Supabase',
      'Python',
      'FastAPI',
      'Framer Motion',
      'i18n',
    ],
    githubUrl:
      'https://github.com/VARA4u-tech/Lakshmi-Fashion-Designers-E-Commerce-Website',
    liveUrl: 'https://lakshmi-fashion-designers-e-commerc.vercel.app/',
  },
  {
    title: 'AI Voice Editor',
    description:
      'AI-driven document editor that uses real-time voice commands to edit and reshape text.',
    tags: [
      'React',
      'TypeScript',
      'Tailwind',
      'AI',
      'Speech Recognition',
      'Vite',
      'Supabase',
    ],
    githubUrl: 'https://github.com/VARA4u-tech/AI-Voice-Editor',
    liveUrl: 'https://ai-voice-editor-4rpa.vercel.app',
  },
  {
    title: 'SafeTrip Pro',
    description:
      'AI-powered safety navigation featuring drowsiness detection and real-time emergency alerts.',
    tags: [
      'React',
      'TypeScript',
      'Tailwind',
      'Supabase',
      'Framer Motion',
      'Vite',
    ],
    githubUrl:
      'https://github.com/VARA4u-tech/safe-trip-smart-driving-safety-application',
    liveUrl: 'https://safe-trip-smart-driving-safety-appl.vercel.app',
  },
  {
    title: 'Academy of Tech Masters (AOTMS)',
    description:
      'Tech education platform with AI assistance and interactive student management for real-world clients.',
    tags: [
      'React',
      'TypeScript',
      'Tailwind',
      'Vite',
      'Zustand',
      'Framer Motion',
    ],
    githubUrl: 'https://github.com/VARA4u-tech/AOTMS',
    liveUrl: 'https://aotms.in',
  },
  {
    title: 'Elara Cosmetics',
    description:
      'Luxury Ayurvedic e-commerce platform featuring a custom WhatsApp-integrated checkout system.',
    tags: ['React', 'TypeScript', 'Tailwind', 'Vite', 'Shadcn UI', 'Vitest'],
    githubUrl:
      'https://github.com/VARA4u-tech/Elara-Cosmetics-E--Commerce-Website-',
    liveUrl: 'https://elara-cosmetics.vercel.app/',
  },
  {
    title: 'EduPredict',
    description:
      'AI predictive analytics for student success with a unique comic book-inspired interface.',
    tags: [
      'React',
      'TypeScript',
      'Tailwind',
      'Vite',
      'Lucide React',
      'Framer Motion',
    ],
    githubUrl: 'https://github.com/VARA4u-tech/EduPredict',
    liveUrl: 'https://edu-pridect.vercel.app/',
  },
  {
    title: 'SmartQuack',
    description:
      'Gamified task manager featuring a reactive duck mascot that tracks your productivity progress.',
    tags: ['Flutter', 'Riverpod', 'Firebase', 'Hive', 'Dart'],
    githubUrl: 'https://github.com/VARA4u-tech/my-first-flutter-app',
    liveUrl: 'https://github.com/VARA4u-tech/my-first-flutter-app',
  },
];

const ProjectsSection = () => (
  <SectionBlock id="projects" title="Projects">
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-6 pb-12">
      {projects.map((project, index) => {
        // Bento Grid Span Logic
        const isTrueVex = project.title === 'TrueVex Technologies';
        const isVidyalaya = project.title === 'Vidyalaya';
        const isLogicia = project.title.includes('LOGICIA');
        
        const gridClasses = isVidyalaya 
          ? "md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2" 
          : isTrueVex
            ? "md:col-span-2 lg:col-span-2"
            : isLogicia 
              ? "md:col-span-2 lg:col-span-2" 
              : "col-span-1";

        return (
          <div
            key={project.title}
            onMouseEnter={playHover}
            className={`group relative border-2 border-black p-6 flex flex-col justify-between hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-500 bg-white snap-start rounded-none ${gridClasses}`}
          >
            {project.isNew && (
              <div className="absolute -top-3 -right-3 bg-black text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 border-black z-10 rotate-3 group-hover:rotate-0 transition-transform">
                LATEST WORK
              </div>
            )}
            
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className={`font-black text-foreground leading-tight ${isVidyalaya ? 'text-4xl' : 'text-lg'}`}>
                  {project.title}
                </h3>
              </div>
              
              <p className={`body-text mb-6 font-normal leading-relaxed text-foreground/80 ${isVidyalaya ? 'text-lg max-w-2xl' : 'text-xs line-clamp-3'}`}>
                {project.description}
              </p>
              
              {isVidyalaya && (
                <div className="mt-8 mb-10 group/terminal">
                  <div className="relative border border-black/10 bg-black/[0.02] p-4 font-mono text-[10px] overflow-hidden">
                    {/* Terminal Header */}
                    <div className="flex gap-1.5 mb-4 opacity-30">
                      <div className="w-2 h-2 rounded-full bg-black" />
                      <div className="w-2 h-2 rounded-full bg-black/40" />
                      <div className="w-2 h-2 rounded-full bg-black/20" />
                    </div>
                    
                    {/* Execution Lines */}
                    <div className="space-y-2 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-black/30">01</span>
                        <span className="text-black/50">const </span>
                        <span>processEngine</span>
                        <span className="text-black/50"> = </span>
                        <span className="text-black/80 font-bold">async</span>
                        <span className="text-black/50"> (doc) {'=>'} {'{'}</span>
                      </div>
                      <div className="flex items-center gap-2 pl-4">
                        <span className="text-black/30">02</span>
                        <span className="text-black/50">  await </span>
                        <span className="text-black/80">AI.summarize</span>
                        <span className="text-black/50">(doc);</span>
                      </div>
                      <div className="flex items-center gap-2 pl-4">
                        <span className="text-black/30">03</span>
                        <span className="text-black/50">  return </span>
                        <span className="text-black/80">VectorStore.query</span>
                        <span className="text-black/50">(prompt);</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-black/30">04</span>
                        <span className="text-black/50">{'}'}</span>
                      </div>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] select-none pointer-events-none">
                      <Code2 className="w-32 h-32 rotate-12" />
                    </div>
                  </div>
                  <div className="mt-2 text-[9px] font-mono text-black/30 flex justify-between uppercase tracking-tighter">
                    <span>// Log: AI Execution Pipeline Active</span>
                    <span className="animate-pulse">● Live Sync</span>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.tags.slice(0, isVidyalaya ? 10 : 5).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="font-mono text-[9px] font-bold border border-black/5 bg-black/5 px-2 py-0.5 rounded-none"
                  >
                    {tag}
                  </Badge>
                ))}
                {!isVidyalaya && project.tags.length > 5 && (
                  <span className="text-[9px] font-bold opacity-30">+{project.tags.length - 5}</span>
                )}
              </div>
            </div>

            <div className={`flex gap-3 mt-4 ${isVidyalaya ? 'pt-6 border-t border-black/5' : ''}`}>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClick}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-black bg-white text-[9px] font-black uppercase tracking-widest transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-black hover:text-white"
              >
                <Github className="w-3.5 h-3.5" />
                Source
              </a>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClick}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-black bg-black text-white text-[9px] font-black uppercase tracking-widest transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-white hover:text-black"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live
              </a>
            </div>
          </div>
        );
      })}
    </div>

    <div className="mt-8">
      <a
        href="https://github.com/VARA4u-tech"
        target="_blank"
        rel="noopener noreferrer"
        onClick={playClick}
        className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:gap-5 transition-all w-fit"
      >
        <Github className="w-4 h-4" />
        Explore Original Repositories
      </a>
    </div>
  </SectionBlock>
);

export default ProjectsSection;
