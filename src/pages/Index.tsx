import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import EducationSection from '@/components/EducationSection';
import ExperienceSection from '@/components/ExperienceSection';
// import AchievementsSection from '@/components/AchievementsSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';

import ScrollToTop from '@/components/ScrollToTop';
import Terminal from '@/components/Terminal';
import Finale from '@/components/Finale';
import EasterEgg from '@/components/EasterEgg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <EasterEgg />
      <Navbar />
      <ScrollToTop />
      <Terminal />
      <HeroSection />
      <AboutSection />
      <EducationSection />
      <ExperienceSection />
      {/* <AchievementsSection /> */}
      <ProjectsSection />
      {/* <BlogSection /> */}
      <SkillsSection />
      <ContactSection />

      <Finale />
    </div>
  );
};

export default Index;
