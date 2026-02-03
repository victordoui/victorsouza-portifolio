import { useLanguage } from '@/contexts/LanguageContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSwitcher = () => {
  const { language, setLanguage, translations } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={toggleLanguage}
          className="p-2 rounded-lg hover:bg-accent transition-smooth relative overflow-hidden"
          aria-label={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={language}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="text-lg block"
            >
              {language === 'pt' ? '🇧🇷' : '🇺🇸'}
            </motion.span>
          </AnimatePresence>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{language === 'pt' ? translations.language.english : translations.language.portuguese}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default LanguageSwitcher;
