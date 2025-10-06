import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons' | 'minimal';
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = 'dropdown',
  className = ''
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'he', name: 'עברית', nativeName: 'עברית' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' }
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex space-x-2 space-x-reverse ${className}`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as Language)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              language === lang.code
                ? 'bg-gold-500 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {lang.nativeName}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={() => {
          // Cycle through languages
          const currentIndex = languages.findIndex(l => l.code === language);
          const nextIndex = (currentIndex + 1) % languages.length;
          setLanguage(languages[nextIndex].code as Language);
        }}
        className={`p-2 rounded-lg text-neutral-600 hover:text-gold-600 hover:bg-gold-50 transition-colors ${className}`}
        title={t('language.change')}
      >
        <Globe className="w-5 h-5" />
      </button>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{languages.find(l => l.code === language)?.nativeName}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-luxury border border-cream-200 z-50">
          <div className="p-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code as Language)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-neutral-700 hover:bg-cream-50 rounded-lg transition-colors"
              >
                <span>{lang.nativeName}</span>
                {language === lang.code && (
                  <Check className="w-4 h-4 text-gold-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;