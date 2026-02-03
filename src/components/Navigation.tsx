import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu, X, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { translations } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const navigationItems = [
    { label: translations.navigation.home, id: 'hero' },
    { label: translations.navigation.about, id: 'about' },
    { label: translations.navigation.projects, id: 'projects' },
    { label: translations.navigation.contact, id: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
      isScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="font-display font-bold text-xl lg:text-2xl text-foreground">
            Victor Souza
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth rounded-lg hover:bg-accent"
              >
                {item.label}
              </button>
            ))}
            <Link 
              to="/blog" 
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth rounded-lg hover:bg-accent"
            >
              {translations.navigation.blog}
            </Link>
            {user ? (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/admin" 
                  className="relative px-4 py-2 text-sm font-medium text-foreground/80 rounded-xl transition-all duration-300 hover:text-primary hover:bg-white/5 hover:backdrop-blur-md hover:shadow-lg hover:shadow-primary/20 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-primary/0 before:via-primary/5 before:to-primary/0 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 active:scale-95 flex items-center"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span className="relative z-10">{translations.navigation.dashboard}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="relative px-4 py-2 text-sm font-medium text-foreground/80 rounded-xl transition-all duration-300 hover:text-destructive hover:bg-destructive/5 hover:backdrop-blur-md hover:shadow-lg hover:shadow-destructive/20 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-destructive/0 before:via-destructive/5 before:to-destructive/0 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 active:scale-95 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="relative z-10">{translations.navigation.logout}</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="relative p-2 text-foreground/80 rounded-xl transition-all duration-300 hover:text-primary hover:bg-white/5 hover:backdrop-blur-md hover:shadow-lg hover:shadow-primary/20 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-primary/0 before:via-primary/5 before:to-primary/0 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 active:scale-95 flex items-center"
              >
                <Settings className="h-4 w-4 relative z-10" />
              </Link>
            )}
          </div>

          {/* Theme Toggle, Language Switcher & Mobile Menu */}
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-smooth"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-smooth"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 mx-4 bg-card/95 backdrop-blur-xl rounded-xl mt-4 border border-border shadow-elegant">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-smooth rounded-lg mx-2"
              >
                {item.label}
              </button>
            ))}
            <Link 
              to="/blog" 
              className="block w-full text-left px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-smooth rounded-lg mx-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {translations.navigation.blog}
            </Link>
            <div className="h-px bg-border mx-4 my-2"></div>
            {user ? (
              <>
                <Link 
                  to="/admin" 
                  className="flex items-center w-full text-left px-6 py-4 text-foreground/80 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 rounded-xl mx-2 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  {translations.navigation.admin}
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full text-left px-6 py-4 text-foreground/80 hover:text-destructive hover:bg-gradient-to-r hover:from-destructive/5 hover:to-transparent transition-all duration-300 rounded-xl mx-2 font-medium"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  {translations.navigation.logout}
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="flex items-center w-full text-left px-6 py-4 text-foreground/80 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 rounded-xl mx-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-4 w-4 mr-3" />
                {translations.navigation.login}
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
