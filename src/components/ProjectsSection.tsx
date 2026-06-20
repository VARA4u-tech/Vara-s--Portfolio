import { useState, useRef } from 'react';
import { Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionBlock from './SectionBlock';
import ProjectCard from './ProjectCard';
import { playHover, playClick } from '@/hooks/useSoundEffects';

// ─── Types ────────────────────────────────────────────────────────────────────
type FilterKey = 'all' | 'ai' | 'web' | 'mobile' | 'ecommerce';

interface Project {
  title: string;
  isNew?: boolean;
  badge?: string;
  tagline?: string;
  description: string;
  tags: string[];
  categories: FilterKey[];
  githubUrl: string;
  liveUrl?: string;
}

// ─── Filter definitions ───────────────────────────────────────────────────────
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ai', label: 'AI' },
  { key: 'web', label: 'Web' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'ecommerce', label: 'E-Commerce' },
];

// ─── Project data ────────────────────────────────────────────────────────────
const projects: Project[] = [
  {
    title: 'AI Meeting Summarizer & Task Manager',
    isNew: true,
    tagline: 'Automate your meetings',
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
    categories: ['ai', 'web'],
    githubUrl:
      'https://github.com/VARA4u-tech/AI_Meeting_Summerizer_Task_Manager',
  },
  {
    title: 'AOTMS LMS PORTAL',
    isNew: false,
    badge: 'Freelance Project',
    tagline: 'Next-Gen Learning Platform',
    description:
      'An end-to-end, enterprise-grade Learning Management System designed for modern tech education. Features scalable architecture, interactive student management, and real-world value.',
    tags: [
      'React',
      'TypeScript',
      'Node.js',
      'Express',
      'MongoDB',
      'Tailwind',
      'Vite',
      'Framer Motion',
    ],
    categories: ['web'],
    githubUrl: 'https://github.com/VARA4u-tech/AOTMS-LMS-PORTAL',
    liveUrl: 'https://www.aotms.com',
  },
  {
    title: 'MAIL-MIND-AI',
    tagline: 'AI-Powered Inbox Command Center',
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
    categories: ['ai', 'web'],
    githubUrl: 'https://github.com/VARA4u-tech/MAIL-MIND-AI',
    liveUrl: 'https://mail-mind-ai-xi.vercel.app/',
  },
  {
    title: 'Vidyalaya',
    tagline: 'Turn PDFs into Smart Study Plans',
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
    categories: ['ai', 'web'],
    githubUrl: 'https://github.com/VARA4u-tech/Vidyalaya',
    liveUrl: 'https://vidyalaya-nine.vercel.app',
  },
  {
    title: 'LOGICIA — Your AI Logic Brain',
    tagline: 'Intelligent Tutor for Competitive Exams',
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
    categories: ['ai', 'web'],
    githubUrl: 'https://github.com/VARA4u-tech/-LOGICIA_Your_AI_Logic_Brain_',
    liveUrl: 'https://logicia-your-ai-logic-brain.vercel.app',
  },
  {
    title: 'Lakshmi Fashion Designers',
    badge: 'Freelance Project',
    tagline: 'Premium Tailoring E-Commerce',
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
    categories: ['ecommerce', 'web', 'ai'],
    githubUrl:
      'https://github.com/VARA4u-tech/Lakshmi-Fashion-Designers-E-Commerce-Website',
    liveUrl: 'https://lakshmi-fashion-designers-e-commerc.vercel.app/',
  },
  {
    title: 'AI Voice-Controlled PDF Editor',
    tagline: 'Edit PDFs with Your Voice',
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
    categories: ['ai', 'web'],
    githubUrl: 'https://github.com/VARA4u-tech/AI-VoiceControlled-PDF-Editor',
    liveUrl: 'https://ai-voice-controlled-pdf-editor.vercel.app',
  },
  {
    title: 'SafeTrip Pro',
    tagline: 'Smart Driving & Safety Companion',
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
    categories: ['web', 'ai'],
    githubUrl:
      'https://github.com/VARA4u-tech/safe-trip-smart-driving-safety-application',
    liveUrl: 'https://safe-trip-smart-driving-safety-appl.vercel.app',
  },
  {
    title: 'Academy of Tech Masters (AOTMS)',
    badge: 'Freelance Project',
    tagline: 'Interactive Tech Education',
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
    categories: ['web'],
    githubUrl: 'https://github.com/VARA4u-tech/AOTMS',
    liveUrl: 'https://www.aotms.in/',
  },
  {
    title: 'Elara Cosmetics',
    badge: 'Freelance Project',
    tagline: 'Luxury Ayurvedic Skincare',
    description:
      'Luxury Ayurvedic e-commerce platform featuring a custom WhatsApp-integrated checkout system.',
    tags: ['React', 'TypeScript', 'Tailwind', 'Vite', 'Shadcn UI', 'Vitest'],
    categories: ['ecommerce', 'web'],
    githubUrl:
      'https://github.com/VARA4u-tech/Elara-Cosmetics-E--Commerce-Website-',
    liveUrl: 'https://elara-cosmetics.vercel.app/',
  },
  {
    title: 'EduPredict',
    tagline: 'AI Analytics for Student Success',
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
    categories: ['ai', 'web'],
    githubUrl: 'https://github.com/VARA4u-tech/EduPredict',
    liveUrl: 'https://edu-pridect.vercel.app/',
  },
  {
    title: 'SmartQuack',
    tagline: 'Gamified Productivity Tracker',
    description:
      'Gamified task manager featuring a reactive duck mascot that tracks your productivity progress.',
    tags: ['Flutter', 'Riverpod', 'Firebase', 'Hive', 'Dart'],
    categories: ['mobile'],
    githubUrl: 'https://github.com/VARA4u-tech/my-first-flutter-app',
    liveUrl: 'https://github.com/VARA4u-tech/my-first-flutter-app',
  },
];

// ─── Card enter/exit variants ─────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: i * 0.06,
      ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
    },
  }),
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.96,
    transition: { duration: 0.22, ease: 'easeIn' as const },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.categories.includes(activeFilter));

  return (
    <SectionBlock id="projects" title="Projects">
      {/* ── Filter Tabs ── */}
      <div className="flex flex-wrap gap-2 mb-10">
        {FILTERS.map((f) => {
          const count =
            f.key === 'all'
              ? projects.length
              : projects.filter((p) => p.categories.includes(f.key)).length;

          const isActive = activeFilter === f.key;

          return (
            <button
              key={f.key}
              id={`filter-${f.key}`}
              onClick={() => {
                playClick();
                setActiveFilter(f.key);
              }}
              onMouseEnter={playHover}
              aria-pressed={isActive}
              aria-label={`Filter by ${f.label} (${count} projects)`}
              className={[
                'relative flex items-center gap-2 px-4 py-2 border-2 font-mono text-xs font-black uppercase tracking-widest transition-all duration-200 rounded-none select-none',
                isActive
                  ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]'
                  : 'bg-white text-foreground border-black/40 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.08)] hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px]',
              ].join(' ')}
            >
              <span>{f.label}</span>
              {/* Live count pill */}
              <span
                className={[
                  'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9px] font-black rounded-none border transition-colors duration-200',
                  isActive
                    ? 'bg-white text-black border-white/40'
                    : 'bg-black/8 text-black border-black/10',
                ].join(' ')}
              >
                {count}
              </span>

              {/* Active indicator — animated underline */}
              {isActive && (
                <motion.span
                  layoutId="filter-underline"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/40"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          );
        })}

        {/* Total label */}
        <span className="ml-auto self-center font-mono text-[10px] text-foreground/40 uppercase tracking-widest hidden sm:block">
          {filtered.length} / {projects.length} shown
        </span>
      </div>

      {/* ── Project Grid ── */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-12 pt-6 px-4 -mx-4 scroll-pl-4 md:scroll-pl-0 no-scrollbar md:mx-0 md:px-0 md:pt-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible md:snap-none">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => {
            const categories = project.categories.map((cat) => {
              const match = FILTERS.find((f) => f.key === cat);
              return match
                ? { key: cat, label: match.label }
                : { key: cat, label: cat };
            });
            return (
              <motion.div
                key={project.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="gsap-project-card w-[80vw] max-w-[320px] shrink-0 snap-start md:snap-none md:w-auto md:max-w-none h-full"
              >
                <ProjectCard
                  project={{
                    ...project,
                    categories,
                  }}
                  index={i}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty state — when no projects match */}
        {filtered.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="col-span-full py-20 text-center"
          >
            <p className="font-mono text-sm uppercase tracking-widest text-foreground/40">
              No projects in this category yet.
            </p>
          </motion.div>
        )}
      </div>

      {/* ── GitHub Link ── */}
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
};

export default ProjectsSection;
