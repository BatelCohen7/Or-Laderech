import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../../components/layout/DashboardHeader';
import PendingDocumentsCard from '../../components/cards/PendingDocumentsCard';
import ActiveVotesCard from '../../components/cards/ActiveVotesCard';
import LatestMessagesCard from '../../components/cards/LatestMessagesCard';
import EmptyState from '../../components/common/EmptyState';
import ErrorBanner from '../../components/common/ErrorBanner';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useRTL } from '../../hooks/useRTL';
import './DashboardPage.css';

/**
 * R-03 Resident Dashboard
 * 
 * Layout:
 * - Fixed header
 * - Main content (cards grid)
 * - Empty state if no actions
 * 
 * Data:
 * - /api/v1/me/documents (pending count)
 * - /api/v1/me/votes (open votes + userVoted)
 * - /api/v1/me/messages (unread count + latest message preview)
 */
const DashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isRTL } = useRTL();
  const { data, loading, error, retry } = useDashboardData();

  const [projectName, setProjectName] = useState<string>('');

  // Fetch project name
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch('/api/v1/me/project', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const project = await response.json();
          setProjectName(project.name || '');
        }
      } catch (err) {
        // Non-blocking: project name fetch failure
        console.error('Failed to fetch project name:', err);
      }
    };
    fetchProject();
  }, []);

  const handleLanguageChange = (lang: 'he' | 'ar' | 'ru' | 'en') => {
    i18n.changeLanguage(lang);
    document.documentElement.setAttribute('dir', lang === 'he' || lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  };

  const handleProfileClick = () => {
    navigate('/resident/profile');
  };

  // Calculate if we should show empty state
  const hasPendingDocuments = (data?.documents?.filter((d: any) => d.status === 'PENDING') || []).length > 0;
  const hasActiveVotes = (data?.votes?.filter((v: any) => v.status === 'OPEN') || []).length > 0;
  const hasUnreadMessages = (data?.messages?.filter((m: any) => m.status === 'UNREAD') || []).length > 0;
  const isEmpty = !hasPendingDocuments && !hasActiveVotes && !hasUnreadMessages && !loading;

  return (
    <div className={`dashboard-page ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <DashboardHeader
        projectName={projectName}
        currentLanguage={i18n.language as 'he' | 'ar' | 'ru' | 'en'}
        onLanguageChange={handleLanguageChange}
        onProfileClick={handleProfileClick}
      />

      <main className="dashboard-main" role="main">
        {error && (
          <ErrorBanner
            message={t('dashboard.error.loadFailed')}
            onRetry={retry}
            aria-live="polite"
          />
        )}

        {loading ? (
          <div className="dashboard-loading" aria-live="polite" aria-busy="true">
            <p>{t('dashboard.loading')}</p>
          </div>
        ) : isEmpty ? (
          <EmptyState
            title={t('dashboard.empty.title')}
            subtitle={t('dashboard.empty.subtitle')}
            illustration="urban-buildings"
          />
        ) : (
          <div className="dashboard-content">
            {/* Section: Pending Actions */}
            <section className="dashboard-section" aria-labelledby="pending-actions-heading">
              <h2 id="pending-actions-heading" className="dashboard-section-title">
                {t('dashboard.sections.pendingActions')}
              </h2>
              <div className="dashboard-cards-grid">
                <PendingDocumentsCard
                  documents={data?.documents || []}
                  onViewDocuments={() => navigate('/resident/documents')}
                />
                <ActiveVotesCard
                  votes={data?.votes || []}
                  onViewVotes={() => navigate('/resident/votes')}
                />
              </div>
            </section>

            {/* Section: Updates */}
            <section className="dashboard-section" aria-labelledby="updates-heading">
              <h2 id="updates-heading" className="dashboard-section-title">
                {t('dashboard.sections.updates')}
              </h2>
              <div className="dashboard-cards-grid">
                <LatestMessagesCard
                  messages={data?.messages || []}
                  onViewMessages={() => navigate('/resident/messages')}
                />
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
