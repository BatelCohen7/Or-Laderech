import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import translationHE from './locales/he.json';
import translationEN from './locales/en.json';
import translationRU from './locales/ru.json';

// the translations
const resources = {
  he: {
    translation: translationHE
  },
  en: {
    translation: translationEN
  },
  ru: {
    translation: translationRU
  }
};

// Get language from localStorage or use browser language or default to Hebrew
const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && ['he', 'en', 'ru'].includes(savedLanguage)) {
    return savedLanguage;
  }
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0];
  if (['he', 'en', 'ru'].includes(browserLang)) {
    return browserLang;
  }
  
  // Default to Hebrew
  return 'he';
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'he',
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: {
      useSuspense: false
    }
  });

// Update document direction based on language
const updateDocumentDirection = (language: string) => {
  document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
  document.documentElement.lang = language;
};

// Set initial direction
updateDocumentDirection(i18n.language);

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  updateDocumentDirection(lng);
  localStorage.setItem('language', lng);
});

export default i18n;