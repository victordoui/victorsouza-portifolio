import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { settings } = useSiteSettings();
  const { translations } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  // Use dynamic settings with fallbacks
  const socialLinks = [
    ...(settings.github_url ? [{
      icon: Github,
      href: settings.github_url,
      label: 'GitHub'
    }] : [{
      icon: Github,
      href: 'https://github.com/victordoui',
      label: 'GitHub'
    }]),
    ...(settings.linkedin_url ? [{
      icon: Linkedin,
      href: settings.linkedin_url,
      label: 'LinkedIn'
    }] : [{
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/victordoui/',
      label: 'LinkedIn'
    }]),
    ...(settings.email ? [{
      icon: Mail,
      href: `mailto:${settings.email}`,
      label: 'Email'
    }] : [{
      icon: Mail,
      href: 'mailto:victordoui@gmail.com',
      label: 'Email'
    }])
  ];

  const quickLinks = [{
    label: translations.navigation.home,
    href: '#hero'
  }, {
    label: translations.navigation.about,
    href: '#about'
  }, {
    label: translations.navigation.projects,
    href: '#projects'
  }, {
    label: translations.navigation.contact,
    href: '#contact'
  }];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-foreground/5 border-t border-border/50">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="font-display font-bold text-2xl hero-gradient-text mb-4">
              Victor Souza
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              {translations.footer.description}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map(link => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200" 
                  aria-label={link.label}
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{translations.footer.navigation}</h4>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.label}>
                  <button 
                    onClick={() => scrollToSection(link.href)} 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{translations.footer.services}</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>{translations.footer.frontendDev}</li>
              <li>{translations.footer.dataAnalysis}</li>
              <li>{translations.footer.vibeCode}</li>
              <li>{translations.footer.aiConsulting}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {currentYear} Victor Souza. {translations.footer.rights}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
