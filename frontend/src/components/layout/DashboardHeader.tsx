import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRTL } from '../../hooks/useRTL';
import LanguageSwitcher from '../language/LanguageSwitcher';
import ProfileMenu from '../profile/ProfileMenu';
import './DashboardHeader.css';

interface DashboardHeaderProps {
  projectName: string;
  currentLanguage: 'he' | 'ar' | 'ru' | 'en';
  onLanguageChange: (lang: 'he' | 'ar' | 'ru' | 'en') => void;
  onProfileClick: () => void;
}

/**
 * Dashboard Header Component
 * 
 * Layout:
 * - Logo (left in LTR / right in RTL)
 * - Project name
 * - Language switcher (icon + text)
 * - Profile icon
 * 
 * Accessibility:
 * - Header height ≥ 64px
 * - All items keyboard reachable
 * - Language switcher accessible via Tab
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  projectName,
  currentLanguage,
  onLanguageChange,
  onProfileClick,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  return (
    <header className="dashboard-header" role="banner" aria-label={t('header.label')}>
      <div className="dashboard-header-container">
        {/* Logo */}
        <div className="dashboard-header-logo" aria-label={t('header.logo.label')}>
          <img
            src="/logo.svg"
            alt={t('header.logo.alt')}
            className="dashboard-header-logo-img"
            width="40"
            height="40"
          />
        </div>

        {/* Project Name */}
        {projectName && (
          <h1 className="dashboard-header-project" aria-label={t('header.project.label')}>
            {projectName}
          </h1>
        )}

        {/* Spacer */}
        <div className="dashboard-header-spacer" aria-hidden="true" />

        {/* Language Switcher */}
        <LanguageSwitcher
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
        />

        {/* Profile Menu */}
        <ProfileMenu onProfileClick={onProfileClick} />
      </div>
    </header>
  );
};

export default DashboardHeader;
