import React from 'react';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../../components/layout/DashboardHeader';
import './CreateVotePage.css';

/**
 * C-07 Create Vote
 * 
 * Title, description
 * Audience filter (ALL_RESIDENTS / COMMITTEE_ONLY / UNSIGNED_RESIDENTS fallback)
 * opensAt / closesAt
 * options list
 * Submit (creates vote + optional reminder scheduling)
 */
const CreateVotePage: React.FC = () => {
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
          <h1>{t('pages.committee.createVote.title')}</h1>
          <p>{t('common.comingSoon')}</p>
        </div>
      </main>
    </div>
  );
};

export default CreateVotePage;
