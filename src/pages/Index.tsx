import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import { useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
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
import PixelCursor from '@/components/PixelCursor';
import PixelGrid from '@/components/PixelGrid';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`min-h-screen bg-background text-foreground ${isLoading ? 'h-screen overflow-hidden' : ''}`}
    >
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* ── Pixel Animation Layer ── */}
      <PixelGrid />
      <PixelCursor />

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
