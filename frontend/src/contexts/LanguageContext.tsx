import React, { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

// סוגי השפות הנתמכות
export type Language = 'he' | 'en' | 'ru';

// טיפוס עבור הקונטקסט
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: string;
}

// יצירת הקונטקסט
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// הוק לשימוש בקונטקסט
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// פרובידר של הקונטקסט
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  
  // טעינת השפה מהאחסון המקומי או שימוש בשפת ברירת מחדל (עברית)
  const [language, setLanguageState] = useState<Language>(i18n.language as Language);

  // פונקציה לשינוי השפה
  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
  };

  // כיוון הטקסט הנוכחי
  const dir = i18n.dir();

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};