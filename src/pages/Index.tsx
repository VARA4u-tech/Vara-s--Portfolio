import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import EducationSection from "@/components/EducationSection";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import ScrollToTop from "@/components/ScrollToTop";
import DarkModeToggle from "@/components/DarkModeToggle";
import Chatbot from "@/components/Chatbot";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <DarkModeToggle />
      <ScrollToTop />
      <Chatbot />
      <HeroSection />
      <AboutSection />
      <EducationSection />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
      <footer className="py-12 text-center">
        <p className="text-foreground/30 text-xs tracking-[0.2em] uppercase">
          © 2026 Pappuri Durga Vara Prasad
        </p>
      </footer>
    </div>
  );
};

export default Index;
