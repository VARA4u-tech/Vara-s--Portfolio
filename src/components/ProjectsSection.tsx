import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import SectionBlock from './SectionBlock';
import { Badge } from './ui/badge';
import { playHover, playClick } from '@/hooks/useSoundEffects';

const projects = [
  
  {
    title: 'AI Meeting Summarizer & Task Manager',
    isNew: true,
    description:
      'An enterprise-grade AI assistant that automatically transcribes meeting audio, extracts high-value action items, and generates dynamic task boards for seamless workflow tracking.',
    tags: [
      'React',
      'TypeScript',
      'Node.js',
      'Express',
      'MongoDB',
      'Gemini AI',
      'Tailwind',
      'Vite',
      'Framer Motion',
    ],
    githubUrl:
      'https://github.com/VARA4u-tech/AI_Meeting_Summerizer_Task_Manager',
   
  },
  {
    title: 'MAIL-MIND-AI',
    isNew: false,
    description:
      'A professional-grade, AI-powered email assistant that transforms your inbox into a dynamic command center by leveraging Gemma 2 27B and the Gmail API.',
    tags: [
      'React',
      'TypeScript',
      'Node.js',
      'Express',
      'Mongoose',
      'Gmail API',
      'Gemma',
      'Tailwind',
      'Vite',
      'Framer Motion',
    ],
    githubUrl: 'https://github.com/VARA4u-tech/MAIL-MIND-AI',
    liveUrl: 'https://mail-mind-ai-xi.vercel.app/',
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
    title: 'AI Voice-Controlled PDF Editor',
    description:
      'A mystical, AI-driven document editor where your voice commands reshape text and edit PDFs in real time. Upload a PDF, speak your intent, and watch the Gilded Scribe bring your words to life.',
    tags: [
      'React',
      'TypeScript',
      'Tailwind',
      'AI',
      'Speech Recognition',
      'Vite',
      'PDF.js',
      'LLM',
    ],
    githubUrl: 'https://github.com/VARA4u-tech/AI-VoiceControlled-PDF-Editor',
    liveUrl: 'https://ai-voice-controlled-pdf-editor.vercel.app',
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
    liveUrl: 'https://www.aotms.in/',
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
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: '-50px' }}
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
        hidden: {},
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 pb-12"
    >
      {projects.map((project, index) => {
        return (
          <motion.div
            key={project.title}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
            onMouseEnter={playHover}
            className="w-full h-full"
          >
            <div className="w-full h-full group relative border-2 border-black px-6 py-10 flex flex-col justify-between shadow-brutal-3d hover:shadow-brutal-3d-hover transition-all duration-500 bg-white rounded-none min-h-[480px]">
              {project.isNew && (
                <div className="absolute -top-3 -right-3 bg-black text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 border-black z-10 rotate-3 group-hover:rotate-0 transition-transform">
                  LATEST WORK
                </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-black text-foreground leading-tight text-xl">
                    {project.title}
                  </h3>
                </div>

                <p className="body-text mb-8 font-normal leading-relaxed text-foreground/80 text-xs line-clamp-6">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags.slice(0, 8).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="font-mono text-[9px] font-bold border border-black/5 bg-black/5 px-2 py-0.5 rounded-none"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 8 && (
                    <span className="text-[9px] font-bold opacity-30">
                      +{project.tags.length - 8}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-auto">
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
          </motion.div>
        );
      })}
    </motion.div>

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
