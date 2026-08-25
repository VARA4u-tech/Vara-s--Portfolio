// ──────────────────────────────────────────────────────────────────────────────
// Single source of truth for all project data.
// Import this file wherever you need project info (sections, hero count, etc.)
// ──────────────────────────────────────────────────────────────────────────────

export type FilterKey = 'all' | 'ai' | 'web' | 'mobile' | 'ecommerce';

export interface Project {
  title: string;
  isNew?: boolean;
  badge?: string;
  tagline?: string;
  description: string;
  tags: string[];
  categories: Exclude<FilterKey, 'all'>[];
  githubUrl: string;
  liveUrl?: string;
}

export const PROJECTS: Project[] = [
  {
    title: 'Sarathi.ai',
    isNew: true,
    tagline: 'Your AI Engineering Mentor',
    description:
      'An automated Senior Engineering Mentor that evaluates GitHub repositories using advanced LLMs to provide actionable roadmaps and enforce enterprise standards.',
    tags: [
      'TypeScript',
      'React',
      'Node.js',
      'Python',
      'MongoDB',
      'Express',
      'Vite',
      'OpenRouter',
    ],
    categories: ['ai', 'web'],
    githubUrl:
      'https://github.com/VARA4u-tech/SarathiAI-Your-AI-Engineering-Mentor',
    liveUrl: 'https://sarathi-ai-your-ai-engineering-ment.vercel.app',
  },
  {
    title: 'AI Meeting Summarizer & Task Manager',
    isNew: false,
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
    liveUrl: 'https://lakshmi-fashion-designers.vercel.app',
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

/** Total project count — use this in HeroSection, AboutSection, etc. */
export const PROJECT_COUNT = PROJECTS.length;
