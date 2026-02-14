import SectionBlock from "./SectionBlock";
import AnimatedAvatar from "./AnimatedAvatar";

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
        <p className="body-text max-w-2xl mt-6">
          With experience across mobile and web platforms, I bring a unique
          perspective to every project — blending technical rigor with creative
          sensibility.
        </p>
      </div>
    </div>
  </SectionBlock>
);

export default AboutSection;
