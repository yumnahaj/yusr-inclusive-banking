import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import arTranslations from '../locales/ar';
import enTranslations from '../locales/en';

interface LanguageContextType {
  currentLanguage: 'ar' | 'en';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<'ar' | 'en'>('ar');

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language') as 'ar' | 'en';
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Update document direction and HTML lang attribute
  useEffect(() => {
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    setCurrentLanguage(newLanguage);
    localStorage.setItem('app-language', newLanguage);
  };

  const t = (key: string): string => {
    const translations = currentLanguage === 'ar' ? arTranslations : enTranslations;
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};