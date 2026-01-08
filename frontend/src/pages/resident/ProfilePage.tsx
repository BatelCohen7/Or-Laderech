import React from 'react';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../../components/layout/DashboardHeader';
import './ProfilePage.css';

/**
 * R-10 Profile (Basic)
 * 
 * Name
 * Phone (optional)
 * Language preference
 * Logout
 */
const ProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="page-container">
      <DashboardHeader
        projectName=""
        currentLanguage={i18n.language as 'he' | 'ar' | 'ru' | 'en'}
        onLanguageChange={(lang) => i18n.changeLanguage(lang)}
        onProfileClick={() => {}}
      />
      <main className="page-main">
        <div className="coming-soon">
          <h1>{t('pages.profile.title')}</h1>
          <p>{t('common.comingSoon')}</p>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
