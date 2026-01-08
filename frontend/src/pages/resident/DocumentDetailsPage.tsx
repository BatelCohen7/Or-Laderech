import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../../components/layout/DashboardHeader';
import './DocumentDetailsPage.css';

/**
 * R-05 Document Details + Sign
 * 
 * Document title/type
 * Status badge
 * Primary CTA: Sign (if PENDING)
 * Secondary CTA: Download (token URL / presigned)
 * Confirm modal before signing
 */
const DocumentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
          <h1>{t('pages.documentDetails.title')}</h1>
          <p>{t('common.comingSoon')}</p>
          <p className="text-sm text-gray-500 mt-4">Document ID: {id}</p>
        </div>
      </main>
    </div>
  );
};

export default DocumentDetailsPage;
