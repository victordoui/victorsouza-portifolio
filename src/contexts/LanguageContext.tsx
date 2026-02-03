import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { pt } from '@/locales/pt';
import { en } from '@/locales/en';

type Language = 'pt' | 'en';
type Translations = typeof pt;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string | string[] | Record<string, unknown>;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const detectBrowserLanguage = (): Language => {
  // Check localStorage first
  const saved = localStorage.getItem('preferred-language') as Language | null;
  if (saved && (saved === 'pt' || saved === 'en')) {
    return saved;
  }
  
  // Detect from browser
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('pt') ? 'pt' : 'en';
};

const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
  return path.split('.').reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => detectBrowserLanguage());

  const translations = language === 'pt' ? pt : en;

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const t = (key: string): string | string[] | Record<string, unknown> => {
    const value = getNestedValue(translations as unknown as Record<string, unknown>, key);
    if (value === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return value as string | string[] | Record<string, unknown>;
  };

  useEffect(() => {
    // Update html lang attribute
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
