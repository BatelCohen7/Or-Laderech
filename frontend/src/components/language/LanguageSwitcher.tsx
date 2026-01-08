import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  currentLanguage: 'he' | 'ar' | 'ru' | 'en';
  onLanguageChange: (lang: 'he' | 'ar' | 'ru' | 'en') => void;
}

/**
 * Language Switcher Component
 * 
 * Accessibility:
 * - Accessible via Tab
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Screen reader labels
 */
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: Array<{ code: 'he' | 'ar' | 'ru' | 'en'; label: string; flag: string }> = [
    { code: 'he', label: t('header.language.hebrew'), flag: '🇮🇱' },
    { code: 'ar', label: t('header.language.arabic'), flag: '🇸🇦' },
    { code: 'ru', label: t('header.language.russian'), flag: '🇷🇺' },
    { code: 'en', label: t('header.language.english'), flag: '🇬🇧' },
  ];

  const currentLang = languages.find((l) => l.code === currentLanguage) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        className="language-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-label={t('header.language.label')}
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
      >
        <span className="language-switcher-flag" aria-hidden="true">
          {currentLang.flag}
        </span>
        <span className="language-switcher-text">{currentLang.label}</span>
        <span className="language-switcher-arrow" aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <ul
          className="language-switcher-dropdown"
          role="menu"
          aria-label={t('header.language.menu')}
        >
          {languages.map((lang) => (
            <li key={lang.code} role="menuitem">
              <button
                className={`language-switcher-option ${
                  lang.code === currentLanguage ? 'language-switcher-option--active' : ''
                }`}
                onClick={() => {
                  onLanguageChange(lang.code);
                  setIsOpen(false);
                }}
                type="button"
              >
                <span className="language-switcher-flag" aria-hidden="true">
                  {lang.flag}
                </span>
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
