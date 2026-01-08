import React from 'react';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../../components/layout/DashboardHeader';
import './MessagesPage.css';

/**
 * R-08 Messages / Announcements
 * 
 * List of message deliveries
 * Status: read/unread
 * Filter: All / Unread
 */
const MessagesPage: React.FC = () => {
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
          <h1>{t('pages.messages.title')}</h1>
          <p>{t('common.comingSoon')}</p>
        </div>
      </main>
    </div>
  );
};

export default MessagesPage;
