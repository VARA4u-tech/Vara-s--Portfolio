import { ScrollReveal } from './ui/ScrollReveal';
import { Code2, Smartphone, Server, Cpu, Wrench, Box } from 'lucide-react';
import SectionBlock from './SectionBlock';
import GithubGraph from './GithubGraph';
import { playHover } from '@/hooks/useSoundEffects';
import { useHalloween, useComic } from '@/context/ThemeContext';
import JackOLantern from './halloween/JackOLantern';
import ComicBurst from './comic/ComicBurst';

const skillCategories = [
  {
    title: 'Frontend Development',
    code: 'SPEC // 01',
    icon: <Code2 className="w-5 h-5" />,
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
    code: 'SPEC // 02',
    icon: <Smartphone className="w-5 h-5" />,
    skills: [
      'Riverpod',
      'Material Design',
      'Mobile UI/UX',
      'Native Integration',
    ],
  },
  {
    title: 'Backend & Database',
    code: 'SPEC // 03',
    icon: <Server className="w-5 h-5" />,
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
    code: 'SPEC // 04',
    icon: <Cpu className="w-5 h-5" />,
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
    code: 'SPEC // 05',
    icon: <Wrench className="w-5 h-5" />,
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
  const { isHalloween } = useHalloween();
  const { isComic } = useComic();

  return (
    <SectionBlock id="skills" title="Technical Arsenal">
      <div className="flex flex-col gap-12">
        {/* Header accent if Halloween active */}
        {isHalloween && (
          <div className="-mt-8 flex items-center gap-2 text-xs font-mono text-[#FF7518]">
            <JackOLantern size={22} interactive={true} />
            <span>// seasonal powerups active</span>
          </div>
        )}

        {/* Skill Modules */}
        <ScrollReveal
          animation="stagger-fade-up"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((category, idx) => {
            const isConcretePanel = isComic && idx % 2 === 1;

            return (
              <div key={category.title}>
                <div
                  onMouseEnter={playHover}
                  className={`group border-2 p-6 h-full relative rounded-none transition-all duration-300 ${
                    isComic
                      ? isConcretePanel
                        ? 'comic-panel-concrete'
                        : 'comic-panel-white'
                      : isHalloween
                        ? 'border-black bg-white shadow-brutal-3d hover:border-[#FF7518] hover:shadow-[6px_6px_0px_0px_#FF7518]'
                        : 'border-black bg-white shadow-brutal-3d hover:shadow-brutal-3d-hover'
                  }`}
                >
                  {/* Minimalist Archival Header Rule in Comic mode */}
                  {isComic && (
                    <div
                      className={`flex items-center justify-between pb-2 mb-4 border-b font-mono text-[9px] font-bold uppercase tracking-widest ${
                        isConcretePanel
                          ? 'border-[#171717]/25 text-[#171717]'
                          : 'border-[#D9D9D9] text-[#888888]'
                      }`}
                    >
                      <span>{category.code}</span>
                      <span className="text-[#B58B32] font-black">
                        ◆ VERIFIED
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`p-2 border-2 transition-colors rounded-none ${
                        isComic
                          ? 'border-[#171717] bg-[#171717] text-[#D9B45B] group-hover:bg-[#D9B45B] group-hover:text-[#171717]'
                          : isHalloween
                            ? 'border-black bg-black text-white group-hover:bg-white group-hover:border-[#FF7518] group-hover:text-[#FF7518]'
                            : 'border-black bg-black text-white group-hover:bg-white group-hover:text-black'
                      }`}
                    >
                      {category.icon}
                    </div>
                    <h3
                      className={`font-mono text-sm font-bold uppercase tracking-wide flex items-center justify-between flex-1 ${
                        isComic ? 'text-[#171717]' : ''
                      }`}
                    >
                      <span>{category.title}</span>
                      {isHalloween && (
                        <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-[#FF7518]">
                          🦇
                        </span>
                      )}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className={`px-2 py-1 text-[11px] font-mono transition-all duration-200 cursor-default rounded-none ${
                          isComic
                            ? `border border-[#171717] font-bold ${
                                isConcretePanel
                                  ? 'bg-[#FFFFFF] text-[#171717]'
                                  : 'bg-[#D9D9D9] text-[#171717]'
                              } hover:bg-[#D9B45B] hover:border-[#171717]`
                            : isHalloween
                              ? 'border border-black/10 hover:border-[#FF7518] hover:text-[#FF7518]'
                              : 'border border-black/10 hover:border-black hover:bg-black/5'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Final "Always Learning" Card */}
          <div>
            <div
              onMouseEnter={playHover}
              className={`h-full border-2 p-6 flex flex-col items-center justify-center text-center transition-all duration-300 rounded-none ${
                isComic
                  ? 'comic-panel-dark'
                  : isHalloween
                    ? 'border-black bg-black/5 opacity-60 hover:opacity-100 hover:border-[#FF7518] hover:shadow-[6px_6px_0px_0px_#FF7518]'
                    : 'border-black bg-black/5 opacity-60 hover:opacity-100'
              }`}
            >
              {isComic ? (
                <div className="mb-4">
                  <ComicBurst
                    text="NEXT"
                    size={50}
                    color="gold"
                    interactive={false}
                  />
                </div>
              ) : isHalloween ? (
                <JackOLantern size={32} interactive={true} className="mb-4" />
              ) : (
                <Box className="w-8 h-8 mb-4 opacity-20" />
              )}
              <p
                className={`font-mono text-[10px] uppercase tracking-[0.2em] font-medium ${
                  isComic ? 'text-[#D9D9D9]' : ''
                }`}
              >
                // Always Learning...
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Activity Section */}
        <div
          className={`w-full pt-12 border-t-4 border-dashed ${
            isComic ? 'border-[#888888]' : 'border-black'
          }`}
        >
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-none ${
                    isComic
                      ? 'bg-[#D9B45B]'
                      : isHalloween
                        ? 'bg-[#FF7518] animate-pulse'
                        : 'bg-green-500 animate-pulse'
                  }`}
                />
                Live Pulse
              </h3>
              <div
                className={`h-[2px] flex-1 ${
                  isComic ? 'bg-[#888888]/40' : 'bg-black/10'
                }`}
              />
            </div>
            <GithubGraph />
          </div>
        </div>
      </div>
    </SectionBlock>
  );
};

export default SkillsSection;
