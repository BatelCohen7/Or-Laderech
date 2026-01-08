import React from 'react';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../../components/layout/DashboardHeader';
import './CreateMessagePage.css';

/**
 * C-12 Create Message (Immediate or Scheduled)
 * 
 * Title + body
 * Audience filter
 * Send now OR schedule time
 * Confirm before send
 */
const CreateMessagePage: React.FC = () => {
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
          <h1>{t('pages.committee.createMessage.title')}</h1>
          <p>{t('common.comingSoon')}</p>
        </div>
      </main>
    </div>
  );
};

export default CreateMessagePage;
