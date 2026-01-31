import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Mail, Download } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import TypewriterText from './TypewriterText';

const HeroSection = () => {
  const { settings, downloadCv, hasCv, isLoading } = useSiteSettings();
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const roles = [
    'Desenvolvedor Front-End',
    'Analista de IA',
    'Especialista em Soluções Digitais'
  ];

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight">
              <span className="block text-muted-foreground text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal mb-2">Olá, eu sou</span>
              <span className="block text-foreground">Victor Souza</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed h-[60px] lg:h-[72px]">
              <TypewriterText 
                texts={roles}
                className="text-foreground font-medium"
                typingSpeed={80}
                deletingSpeed={40}
                pauseDuration={2500}
              />
            </p>

            <motion.p 
              className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Criando experiências digitais elegantes e transformando ideias em realidade através do código.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Button 
                size="lg" 
                className="btn-modern h-12 px-8"
                onClick={() => scrollToSection('projects')}
              >
                Ver Projetos
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="btn-outline-modern h-12 px-8"
                onClick={() => scrollToSection('contact')}
              >
                <Mail className="mr-2 h-5 w-5" />
                Contato
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                className="btn-secondary-modern h-12 px-8"
                disabled={isLoading}
                onClick={() => {
                  if (isLoading) {
                    toast({
                      title: 'Carregando configurações...',
                      description: 'Aguarde enquanto carregamos as configurações.'
                    });
                    return;
                  }
                  
                  if (hasCv) {
                    downloadCv();
                  } else {
                    const link = document.createElement('a');
                    link.href = '/curriculo-victor-souza.pdf';
                    link.download = 'Curriculo-Victor-Souza.pdf';
                    link.click();
                  }
                }}
              >
                <Download className="mr-2 h-5 w-5" />
                Baixar CV
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              className="flex justify-center lg:justify-start space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {settings.github_url && (
                <a 
                  href={settings.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-smooth"
                  aria-label="GitHub do Victor Souza"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {settings.linkedin_url && (
                <a 
                  href={settings.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-smooth"
                  aria-label="LinkedIn do Victor Souza"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {settings.email && (
                <a 
                  href={`mailto:${settings.email}`}
                  className="p-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-smooth"
                  aria-label="Email do Victor Souza"
                >
                  <Mail className="h-5 w-5" />
                </a>
              )}
              
              {!settings.github_url && !settings.linkedin_url && !settings.email && (
                <>
                  <a 
                    href="https://github.com/victordoui" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-smooth"
                    aria-label="GitHub do Victor Souza"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/victordoui/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-smooth"
                    aria-label="LinkedIn do Victor Souza"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a 
                    href="mailto:victordoui@gmail.com"
                    className="p-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-smooth"
                    aria-label="Email do Victor Souza"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Clean Hero Image without borders */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="relative z-10 group">
              <div className="relative overflow-hidden rounded-2xl image-fade-vignette">
                <img
                  src="/lovable-uploads/victor-hero-professional.png"
                  alt="Victor Souza - Desenvolvedor Front-End e Especialista em IA"
                  className="w-full max-w-md mx-auto rounded-2xl object-cover aspect-square lg:aspect-[4/5] transition-all duration-700 group-hover:scale-105"
                  loading="eager"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { delay: 1, duration: 0.5 },
            y: { delay: 1.5, duration: 1.5, repeat: Infinity }
          }}
        >
          <button 
            onClick={() => scrollToSection('about')}
            className="p-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-smooth"
            aria-label="Scroll to about section"
          >
            <ArrowDown className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
