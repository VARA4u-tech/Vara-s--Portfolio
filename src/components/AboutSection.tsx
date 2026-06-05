import SectionBlock from './SectionBlock';
import AnimatedAvatar from './AnimatedAvatar';
import {
  BookOpen,
  MapPin,
  Github,
  Code,
  Terminal,
  Cpu,
  ShieldCheck,
} from 'lucide-react';

const AboutSection = () => {
  return (
    <SectionBlock id="about" title="About me">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
        {/* Left Column - Avatar & Quick Specs */}
        <div className="w-full lg:w-auto flex flex-col items-center shrink-0">
          <AnimatedAvatar />

          {/* Neobrutalist Info Card */}
          <div className="w-full max-w-[256px] mt-8 border-2 border-black bg-white p-4 font-mono text-xs space-y-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
            <div className="flex justify-between border-b border-black/10 pb-1.5">
              <span className="text-black/50">NAME:</span>
              <span className="font-bold">DV PRASAD</span>
            </div>
            <div className="flex justify-between border-b border-black/10 pb-1.5">
              <span className="text-black/50">ROLE:</span>
              <span className="font-bold text-right">FULL STACK DEV</span>
            </div>
            <div className="flex items-center justify-between border-b border-black/10 pb-1.5">
              <span className="text-black/50 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> LOC:
              </span>
              <span className="font-bold">INDIA (IST)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/50 flex items-center gap-1">
                <Github className="w-3.5 h-3.5" /> GITHUB:
              </span>
              <a
                href="https://github.com/VARA4u-tech"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline hover:bg-black hover:text-white px-1 transition-colors duration-150"
              >
                @VARA4u-tech
              </a>
            </div>
          </div>
        </div>

        {/* Right Column - Bio, Stats & Methodology */}
        <div className="flex-1 w-full">
          <div className="space-y-6">
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
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 rounded-none">
              <div className="font-mono text-3xl font-black">1+</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-black/50 mt-1">
                Years of Experience
              </div>
            </div>
            <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 rounded-none">
              <div className="font-mono text-3xl font-black">11+</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-black/50 mt-1">
                Projects Completed
              </div>
            </div>
            <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 rounded-none">
              <div className="font-mono text-3xl font-black">100%</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-black/50 mt-1">
                Code Quality Focus
              </div>
            </div>
          </div>

          {/* Core Principles Section */}
          <div className="mt-8 border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none">
            <h3 className="font-mono text-xs font-bold tracking-[0.2em] uppercase mb-6 pb-2 border-b-2 border-black flex items-center gap-2">
              <Code className="w-4 h-4" />
              // CORE WORKFLOW PRINCIPLES
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="font-mono text-xs font-bold uppercase flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 shrink-0" />
                  Clean Architecture
                </div>
                <p className="text-xs text-black/70 leading-relaxed font-light pl-5">
                  Structuring applications to be modular, robust, and
                  self-documenting for seamless scalability and team
                  collaboration.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-mono text-xs font-bold uppercase flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 shrink-0" />
                  High Velocity
                </div>
                <p className="text-xs text-black/70 leading-relaxed font-light pl-5">
                  Optimizing development workflows through contemporary
                  automation tools and structured coding standards.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-mono text-xs font-bold uppercase flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  Type Safety
                </div>
                <p className="text-xs text-black/70 leading-relaxed font-light pl-5">
                  Implementing strict TypeScript checking, comprehensive input
                  validation, and predictable state management.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-mono text-xs font-bold uppercase flex items-center gap-2">
                  <span className="inline-block w-3.5 h-3.5 border-2 border-black shrink-0" />
                  Responsive Design
                </div>
                <p className="text-xs text-black/70 leading-relaxed font-light pl-5">
                  Developing fluid, pixel-perfect user interfaces that render
                  consistently and gracefully across all screen sizes.
                </p>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://durgavaraprasad.hashnode.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-6 py-3 border-2 border-black bg-white text-black text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-black hover:text-white rounded-none"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read My Technical Blog</span>
            </a>
          </div>
        </div>
      </div>
    </SectionBlock>
  );
};

export default AboutSection;
