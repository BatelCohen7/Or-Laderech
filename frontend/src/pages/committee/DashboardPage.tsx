import React from 'react';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../../components/layout/DashboardHeader';
import './DashboardPage.css';

/**
 * C-01 Committee Dashboard
 * 
 * Quick stats:
 * - signatures progress (aggregated)
 * - votes open/closed
 * - messages scheduled/sent
 * Quick actions:
 * - upload document
 * - create vote
 * - create message
 */
const CommitteeDashboardPage: React.FC = () => {
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
          <h1>{t('pages.committee.dashboard.title')}</h1>
          <p>{t('common.comingSoon')}</p>
        </div>
      </main>
    </div>
  );
};

export default CommitteeDashboardPage;
