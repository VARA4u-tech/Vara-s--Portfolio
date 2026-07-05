import { ScrollReveal } from './ui/ScrollReveal';
import { Code2 } from 'lucide-react';
import { Smartphone } from 'lucide-react';
import { Server } from 'lucide-react';
import { Cpu } from 'lucide-react';
import { Wrench } from 'lucide-react';
import { Zap } from 'lucide-react';
import { Layers } from 'lucide-react';
import { Box } from 'lucide-react';
import SectionBlock from './SectionBlock';
import GithubGraph from './GithubGraph';
import { playHover } from '@/hooks/useSoundEffects';

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
      <div className="flex flex-col gap-12">
        {/* Skill Modules */}
        <ScrollReveal
          animation="stagger-fade-up"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((category, idx) => (
            <div key={category.title}>
              <div
                onMouseEnter={playHover}
                className="group border-2 border-black p-6 bg-white h-full relative rounded-none shadow-brutal-3d hover:shadow-brutal-3d-hover transition-all duration-500"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 border-2 border-black bg-black text-white group-hover:bg-white group-hover:text-black transition-colors rounded-none">
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
                      className="px-2 py-1 border border-black/10 text-[11px] font-mono hover:border-black hover:bg-black/5 transition-all cursor-default rounded-none"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Final "Load" Card */}
          <div>
            <div
              onMouseEnter={playHover}
              className="h-full border-2 border-black p-6 bg-black/5 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-all rounded-none"
            >
              <Box className="w-8 h-8 mb-4 opacity-20" />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-medium">
                // Always Learning...
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Activity Section */}
        <div className="w-full pt-12 border-t-4 border-black border-dashed">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-none animate-pulse" />
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
