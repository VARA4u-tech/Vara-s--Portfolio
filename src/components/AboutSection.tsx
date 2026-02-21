import SectionBlock from "./SectionBlock";
import AnimatedAvatar from "./AnimatedAvatar";
import { BookOpen } from "lucide-react";

const AboutSection = () => (
  <SectionBlock id="about" title="About me">
    <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
      <AnimatedAvatar />
      <div className="flex-1">
        <p className="body-text max-w-2xl">
          I'm a passionate developer with a deep interest in building clean,
          performant, and user-centric digital experiences. I believe in the
          power of minimal design and well-crafted code to communicate ideas
          effectively.
        </p>
        <p className="body-text max-w-2xl mt-6 mb-8">
          With experience across mobile and web platforms, I bring a unique
          perspective to every project — blending technical rigor with creative
          sensibility.
        </p>

        <a
          href="https://durgavaraprasad.hashnode.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-3 px-6 py-3 border-2 border-black bg-white text-black text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-black hover:text-white"
        >
          <BookOpen className="w-4 h-4" />
          <span>Read My Technical Blog</span>
        </a>
      </div>
    </div>
  </SectionBlock>
);

export default AboutSection;
