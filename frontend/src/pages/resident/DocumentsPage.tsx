import React from 'react';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../../components/layout/DashboardHeader';
import './DocumentsPage.css';

/**
 * R-04 My Documents
 * 
 * List of assignments for the resident
 * Status: PENDING / SIGNED
 * Primary CTA: open assignment
 * Secondary: download
 */
const DocumentsPage: React.FC = () => {
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
          <h1>{t('pages.documents.title')}</h1>
          <p>{t('common.comingSoon')}</p>
        </div>
      </main>
    </div>
  );
};

export default DocumentsPage;
