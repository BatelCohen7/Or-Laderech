import React from 'react';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../../components/layout/DashboardHeader';
import './AuditPage.css';

/**
 * C-16 Audit Log (Read-only, Basic)
 * 
 * List audit events (high level)
 * filter by action type and time
 */
const AuditPage: React.FC = () => {
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
          <h1>{t('pages.committee.audit.title')}</h1>
          <p>{t('common.comingSoon')}</p>
        </div>
      </main>
    </div>
  );
};

export default AuditPage;
