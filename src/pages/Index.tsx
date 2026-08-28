import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import AboutSection from '@/components/AboutSection';
import EducationSection from '@/components/EducationSection';
import ExperienceSection from '@/components/ExperienceSection';
import AchievementsSection from '@/components/AchievementsSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';

import ScrollToTop from '@/components/ScrollToTop';
import Terminal from '@/components/Terminal';
import Finale from '@/components/Finale';
import EasterEgg from '@/components/EasterEgg';
import PixelCursor from '@/components/PixelCursor';
import PixelGrid from '@/components/PixelGrid';
import PixelPet from '@/components/PixelPet';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPetVisible, setIsPetVisible] = useState(() => {
    return localStorage.getItem('site_pet_visible') !== 'false';
  });

  useEffect(() => {
    const handlePetToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ visible: boolean }>;
      setIsPetVisible(customEvent.detail.visible);
    };
    window.addEventListener('pet-toggle', handlePetToggle);
    return () => window.removeEventListener('pet-toggle', handlePetToggle);
  }, []);

  return (
    <div
      className={`relative min-h-screen bg-background text-foreground ${isLoading ? 'h-screen overflow-hidden' : ''}`}
    >
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* ── Fixed / overlay layer ── */}
      <PixelGrid />
      <PixelCursor isWhite={isLoading} />

      {/* Dog mascot — position:absolute, scrolls with page, patrols sections */}
      {!isLoading && isPetVisible && <PixelPet />}

      <EasterEgg />
      <Navbar />
      <ScrollToTop />
      <Terminal />
      <HeroSection />
      <AboutSection />
      <EducationSection />
      <ExperienceSection />
      <AchievementsSection />
      <ProjectsSection />
      {/* <BlogSection /> */}
      <SkillsSection />
      <ContactSection />

      <Finale />
    </div>
  );
};

export default Index;
