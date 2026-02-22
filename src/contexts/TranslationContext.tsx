import React, { createContext, useContext, useState } from 'react';

const GOOGLE_API_KEY = 'AIzaSyD2vztTQf_o4IqbXDU-b2oapud4mbrYkzE';

interface TranslationContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  translate: (text: string) => Promise<string>;
  languages: { code: string; name: string }[];
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' },
];

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const translate = async (text: string): Promise<string> => {
    if (currentLanguage === 'en') return text;
    
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: text,
            target: currentLanguage,
            source: 'en'
          })
        }
      );
      
      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem('lawlink_language', lang);
  };

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, translate, languages }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) throw new Error('useTranslation must be used within TranslationProvider');
  return context;
};
