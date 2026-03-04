import {
  Code2,
  Smartphone,
  Server,
  Cpu,
  Wrench,
  Zap,
  Layers,
  Box,
} from 'lucide-react';
import SectionBlock from './SectionBlock';
import GithubGraph from './GithubGraph';

const skillCategories = [
  {
    title: 'Frontend Development',
    icon: <Code2 className="w-5 h-5" />,
    color: 'bg-blue-50',
    skills: [
      'React',
      'TypeScript',
      'JavaScript',
      'Tailwind CSS',
      'Zustand',
      'TanStack Query',
      'Framer Motion',
      'Shadcn UI',
      'Vite',
    ],
  },
  {
    title: 'Mobile Engineering',
    icon: <Smartphone className="w-5 h-5" />,
    color: 'bg-green-50',
    skills: [
      'Flutter',
      'Dart',
      'Riverpod',
      'Material Design',
      'Mobile UI/UX',
      'Native Integration',
    ],
  },
  {
    title: 'Backend & Database',
    icon: <Server className="w-5 h-5" />,
    color: 'bg-orange-50',
    skills: [
      'Node.js',
      'Firebase',
      'MongoDB',
      'Hive',
      'REST APIs',
      'PostgreSQL',
      'Auth Systems',
    ],
  },
  {
    title: 'Web3 & Intelligence',
    icon: <Cpu className="w-5 h-5" />,
    color: 'bg-purple-50',
    skills: [
      'Aptos',
      'Move Lang',
      'AI Integration',
      'Prompt Engineering',
      'Smart Contracts',
      'Web3.js',
    ],
  },
  {
    title: 'Tools & Ecosystem',
    icon: <Wrench className="w-5 h-5" />,
    color: 'bg-gray-50',
    skills: [
      'Git',
      'GitHub',
      'Figma',
      'Vitest',
      'Vercel',
      'Docker',
      'Postman',
      'Linux CLI',
    ],
  },
];

const SkillsSection = () => {
  return (
    <SectionBlock id="skills" title="Technical Arsenal">
      <div className="flex flex-col gap-16">
        {/* Top Expertise / Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-24 h-24" />
            </div>
            <h3 className="font-mono text-2xl font-bold mb-4 uppercase tracking-tighter flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-400 border border-black" />
              Core Competence
            </h3>
            <p className="font-mono text-sm text-gray-600 leading-relaxed mb-6">
              Specialized in high-performance application development with a
              focus on cross-platform excellence and modern UI/UX patterns.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Full-Stack', 'Cross-Platform', 'Web3 Arch'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Layers className="w-24 h-24" />
            </div>
            <h3 className="font-mono text-2xl font-bold mb-4 uppercase tracking-tighter flex items-center gap-2">
              <span className="w-3 h-3 bg-black border border-black" />
              Current Focus
            </h3>
            <p className="font-mono text-sm text-gray-600 leading-relaxed mb-6">
              Deep diving into the Move ecosystem on Aptos and integrating
              Generative AI into production-ready workflows.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Aptos/Move', 'Gen AI', 'Edge Computing'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 border-2 border-black text-[10px] font-bold uppercase tracking-widest"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, idx) => (
            <div
              key={category.title}
              className="group border-2 border-black p-6 bg-white hover:-translate-y-1 transition-all duration-300 relative"
              style={{
                animationDelay: `${idx * 100}ms`,
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 border-2 border-black bg-black text-white group-hover:bg-white group-hover:text-black transition-colors">
                  {category.icon}
                </div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wide">
                  {category.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 border border-black/10 text-[11px] font-mono hover:border-black hover:bg-black/5 transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Final "Load" Card */}
          <div className="border-2 border-black p-6 bg-black/5 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity">
            <Box className="w-8 h-8 mb-4 opacity-20" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-medium">
              // Always Learning...
            </p>
          </div>
        </div>

        {/* Activity Section */}
        <div className="w-full pt-12 border-t-4 border-black border-dashed">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Pulse
              </h3>
              <div className="h-[2px] flex-1 bg-black/10"></div>
            </div>
            <GithubGraph />
          </div>
        </div>
      </div>
    </SectionBlock>
  );
};

export default SkillsSection;
