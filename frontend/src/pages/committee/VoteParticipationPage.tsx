import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../../components/layout/DashboardHeader';
import './VoteParticipationPage.css';

/**
 * C-10 Vote Participation (IDs only)
 * 
 * voted userIds
 * notVoted userIds
 * totals + participationRate
 */
const VoteParticipationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
          <h1>{t('pages.committee.voteParticipation.title')}</h1>
          <p>{t('common.comingSoon')}</p>
          <p className="text-sm text-gray-500 mt-4">Vote ID: {id}</p>
        </div>
      </main>
    </div>
  );
};

export default VoteParticipationPage;
