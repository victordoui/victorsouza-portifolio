import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import ArticlesPreview from '@/components/ArticlesPreview';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import ScrollToTop from '@/components/ScrollToTop';
import SEOHead from '@/components/SEOHead';

const Index = () => {
  return (
    <div className="min-h-screen minimal-background relative overflow-hidden">
      <SEOHead />
      <div className="relative z-10">
        <Navigation />
        <main>
          <HeroSection />
          <AboutSection />
          <ExperienceSection />
          <ProjectsSection />
          <ArticlesPreview />
          <ContactSection />
        </main>
        <Footer />
      </div>
      <ChatWidget />
      <ScrollToTop />
    </div>
  );
};

export default Index;
