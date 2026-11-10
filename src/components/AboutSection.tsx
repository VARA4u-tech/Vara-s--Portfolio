import SectionBlock from './SectionBlock';
import AnimatedAvatar from './AnimatedAvatar';
import { ScrollReveal } from './ui/ScrollReveal';
import {
  BookOpen,
  MapPin,
  Github,
  Code,
  Terminal,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { PROFILE, getSocialLink } from '@/data/constants';
import { PROJECT_COUNT } from '@/data/projects';
import { useHalloween, useComic } from '@/context/ThemeContext';
import SpiderWeb from './halloween/SpiderWeb';

const AboutSection = () => {
  const { isHalloween } = useHalloween();
  const { isComic } = useComic();

  return (
    <SectionBlock id="about" title="About me">
      <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-12">
        {/* Corner Spiderweb in About Section (Halloween only) */}
        {isHalloween && (
          <SpiderWeb
            position="top-right"
            size={120}
            withSpider={true}
            className="hidden md:block -top-8 -right-4"
          />
        )}

        {/* Left Column - Avatar & Quick Specs */}
        <ScrollReveal
          animation="fade-in"
          className="w-full lg:w-auto flex flex-col items-center shrink-0"
        >
          <AnimatedAvatar />

          {/* Profile Specs Panel */}
          <div
            className={`w-full max-w-[256px] mt-8 border-2 p-4 font-mono text-xs space-y-2.5 rounded-none transition-all duration-300 ${
              isComic
                ? 'comic-panel-concrete'
                : isHalloween
                  ? 'border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_#FF7518]'
                  : 'border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            <div
              className={`flex justify-between pb-1.5 border-b ${
                isComic ? 'border-[#171717]/20' : 'border-black/10'
              }`}
            >
              <span className={isComic ? 'text-[#171717]/70' : 'text-black/50'}>
                NAME:
              </span>
              <span className="font-bold text-[#171717]">
                {PROFILE.name.toUpperCase()}
              </span>
            </div>
            <div
              className={`flex justify-between pb-1.5 items-center border-b ${
                isComic ? 'border-[#171717]/20' : 'border-black/10'
              }`}
            >
              <span className={isComic ? 'text-[#171717]/70' : 'text-black/50'}>
                ROLE:
              </span>
              <span className="font-bold text-right flex items-center gap-1 text-[#171717]">
                FULL STACK DEV {isHalloween && <span>🎃</span>}
              </span>
            </div>
            <div
              className={`flex items-center justify-between pb-1.5 border-b ${
                isComic ? 'border-[#171717]/20' : 'border-black/10'
              }`}
            >
              <span
                className={`flex items-center gap-1 ${
                  isComic ? 'text-[#171717]/70' : 'text-black/50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" /> LOC:
              </span>
              <span className="font-bold text-[#171717]">
                INDIA[Vijayawada]-(IST)
              </span>
            </div>
            <div className="flex justify-between">
              <span
                className={`flex items-center gap-1 ${
                  isComic ? 'text-[#171717]/70' : 'text-black/50'
                }`}
              >
                <Github className="w-3.5 h-3.5" /> GITHUB:
              </span>
              <a
                href={getSocialLink('github').href}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-bold underline px-1 transition-colors duration-150 ${
                  isComic
                    ? 'text-[#171717] hover:bg-[#D9B45B] hover:text-[#171717]'
                    : 'text-black hover:bg-black hover:text-white'
                }`}
              >
                @{getSocialLink('github').href.split('/').pop()}
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Right Column - Bio, Stats & Methodology */}
        <div className="flex-1 w-full">
          <ScrollReveal animation="stagger-fade-up" className="space-y-6">
            <p className="body-text max-w-3xl">
              I'm a passionate developer with a deep interest in building clean,
              performant, and user-centric digital experiences. I believe in the
              power of minimal design and well-crafted code to communicate ideas
              effectively.
            </p>
            <p className="body-text max-w-3xl">
              With experience across mobile and web platforms, I bring a unique
              perspective to every project — blending technical rigor with
              creative sensibility.
            </p>
            <p className="body-text max-w-3xl">
              I focus on writing well-structured, maintainable code that aligns
              with modern industry standards. By leveraging contemporary
              development workflows and robust toolings, I efficiently translate
              ideas into production-ready software while maintaining clean,
              scalable, and modular architectures.
            </p>
          </ScrollReveal>

          {/* Stats Grid */}
          <ScrollReveal
            animation="stagger-fade-up"
            delay={0.2}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10"
          >
            <div
              className={`border-2 p-5 transition-all duration-200 rounded-none relative ${
                isComic
                  ? 'comic-panel-white'
                  : isHalloween
                    ? 'border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:border-[#FF7518]'
                    : 'border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'
              }`}
            >
              {isComic && (
                <span className="absolute top-3 right-3 w-2 h-2 bg-[#D9B45B] border border-[#171717]" />
              )}
              <div className="font-mono text-3xl font-black text-[#171717]">
                1+
              </div>
              <div
                className={`font-mono text-[10px] uppercase tracking-wider font-bold mt-1 ${
                  isComic ? 'text-[#888888]' : 'text-black/60'
                }`}
              >
                Years of Experience
              </div>
            </div>

            <div
              className={`border-2 p-5 transition-all duration-200 rounded-none relative ${
                isComic
                  ? 'comic-panel-concrete'
                  : isHalloween
                    ? 'border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:border-[#FF7518]'
                    : 'border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'
              }`}
            >
              {isComic && (
                <span className="absolute top-3 right-3 w-2 h-2 bg-[#B58B32] border border-[#171717]" />
              )}
              <div className="font-mono text-3xl font-black text-[#171717]">
                {PROJECT_COUNT}+
              </div>
              <div
                className={`font-mono text-[10px] uppercase tracking-wider font-bold mt-1 ${
                  isComic ? 'text-[#171717]/75' : 'text-black/60'
                }`}
              >
                Projects Completed
              </div>
            </div>

            <div
              className={`border-2 p-5 transition-all duration-200 rounded-none relative ${
                isComic
                  ? 'comic-panel-white'
                  : isHalloween
                    ? 'border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:border-[#FF7518]'
                    : 'border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'
              }`}
            >
              {isComic && (
                <span className="absolute top-3 right-3 w-2 h-2 bg-[#D9B45B] border border-[#171717]" />
              )}
              <div className="font-mono text-3xl font-black text-[#171717]">
                100%
              </div>
              <div
                className={`font-mono text-[10px] uppercase tracking-wider font-bold mt-1 ${
                  isComic ? 'text-[#888888]' : 'text-black/60'
                }`}
              >
                Code Quality Focus
              </div>
            </div>
          </ScrollReveal>

          {/* Core Principles Section */}
          <ScrollReveal
            animation="fade-up"
            delay={0.1}
            className={`mt-8 border-2 p-6 rounded-none transition-all duration-300 ${
              isComic
                ? 'comic-panel-white'
                : isHalloween
                  ? 'border-black bg-white text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_#FF7518]'
                  : 'border-black bg-white text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            <h3
              className={`font-mono text-xs font-bold tracking-[0.2em] uppercase mb-6 pb-2 border-b-2 flex items-center justify-between text-[#171717] ${
                isComic ? 'border-[#171717]' : 'border-black'
              }`}
            >
              <span className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                // CORE WORKFLOW PRINCIPLES
              </span>
              {isHalloween && (
                <span className="text-[10px] text-[#FF7518] font-bold tracking-widest uppercase">
                  🦇 SPOOKY SEASON
                </span>
              )}
              {isComic && (
                <span className="comic-badge-gold text-[9px] px-2 py-0.5">
                  SPEC // ARCH
                </span>
              )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#171717]">
              <div className="space-y-2">
                <h4 className="font-mono text-xs font-bold uppercase flex items-center gap-2 text-[#171717]">
                  <Terminal
                    className={`w-3.5 h-3.5 shrink-0 ${isComic ? 'text-[#B58B32]' : ''}`}
                  />
                  Clean Architecture
                </h4>
                <p
                  className={`text-xs leading-relaxed font-light pl-5 ${
                    isComic ? 'text-[#171717]/80 font-normal' : 'text-black/70'
                  }`}
                >
                  Structuring applications to be modular, robust, and
                  self-documenting for seamless scalability and team
                  collaboration.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-mono text-xs font-bold uppercase flex items-center gap-2 text-[#171717]">
                  <Cpu
                    className={`w-3.5 h-3.5 shrink-0 ${isComic ? 'text-[#B58B32]' : ''}`}
                  />
                  High Velocity
                </h4>
                <p
                  className={`text-xs leading-relaxed font-light pl-5 ${
                    isComic ? 'text-[#171717]/80 font-normal' : 'text-black/70'
                  }`}
                >
                  Optimizing development workflows through contemporary
                  automation tools and structured coding standards.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-mono text-xs font-bold uppercase flex items-center gap-2 text-[#171717]">
                  <ShieldCheck
                    className={`w-3.5 h-3.5 shrink-0 ${isComic ? 'text-[#B58B32]' : ''}`}
                  />
                  Type Safety
                </h4>
                <p
                  className={`text-xs leading-relaxed font-light pl-5 ${
                    isComic ? 'text-[#171717]/80 font-normal' : 'text-black/70'
                  }`}
                >
                  Implementing strict TypeScript checking, comprehensive input
                  validation, and predictable state management.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-mono text-xs font-bold uppercase flex items-center gap-2 text-[#171717]">
                  <span
                    className={`inline-block w-3.5 h-3.5 border-2 shrink-0 ${
                      isComic
                        ? 'border-[#B58B32] bg-[#D9B45B]/20'
                        : 'border-black'
                    }`}
                  />
                  Responsive Design
                </h4>
                <p
                  className={`text-xs leading-relaxed font-light pl-5 ${
                    isComic ? 'text-[#171717]/80 font-normal' : 'text-black/70'
                  }`}
                >
                  Developing fluid, pixel-perfect user interfaces that render
                  consistently and gracefully across all screen sizes.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Action CTA */}
          <ScrollReveal
            animation="scale-up"
            delay={0.2}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a
              href="https://durgavaraprasad.hashnode.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative inline-flex items-center gap-3 px-6 py-3 border-2 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-200 rounded-none ${
                isComic
                  ? 'border-[#FFFFFF] bg-[#FFFFFF] text-[#171717] shadow-[5px_5px_0px_#D9B45B] hover:bg-[#D9B45B] hover:border-[#171717] hover:shadow-[6px_6px_0px_#B58B32] hover:-translate-y-0.5'
                  : isHalloween
                    ? 'border-black bg-white text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-black hover:text-white hover:border-[#FF7518]'
                    : 'border-black bg-white text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-black hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Read My Technical Blog</span>
            </a>
          </ScrollReveal>
        </div>
      </div>
    </SectionBlock>
  );
};

export default AboutSection;
