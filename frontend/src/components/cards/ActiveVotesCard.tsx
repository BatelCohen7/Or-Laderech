import React from 'react';
import { useTranslation } from 'react-i18next';
import CardBase from './CardBase';
import StatusBadge from '../badges/StatusBadge';
import PrimaryButton from '../buttons/PrimaryButton';
import './ActiveVotesCard.css';

interface Vote {
  id: string;
  title: string;
  status: 'OPEN' | 'CLOSED';
  closesAt: string;
  hasVoted?: boolean;
}

interface ActiveVotesCardProps {
  votes: Vote[];
  onViewVotes: () => void;
}

/**
 * Card: Active Votes
 * 
 * Content:
 * - Icon: vote
 * - Title: votes.active.title
 * - Description: votes.active.description
 * - Status badge: OPEN
 * - Primary CTA: votes.active.cta
 * - Click → My Votes
 */
const ActiveVotesCard: React.FC<ActiveVotesCardProps> = ({
  votes,
  onViewVotes,
}) => {
  const { t } = useTranslation();

  const activeVotes = votes.filter((v) => v.status === 'OPEN');
  const activeCount = activeVotes.length;
  const unvotedCount = activeVotes.filter((v) => !v.hasVoted).length;

  // Empty state variant: show card but with "no active votes" message
  const isEmpty = activeCount === 0;

  return (
    <CardBase
      icon={
        <svg
          className="card-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      }
      title={t('votes.active.title')}
      description={
        isEmpty
          ? t('votes.active.description.none')
          : t('votes.active.description', { count: activeCount, unvoted: unvotedCount })
      }
      statusBadge={
        isEmpty ? (
          <StatusBadge variant="neutral" label={t('status.noActive')} />
        ) : unvotedCount > 0 ? (
          <StatusBadge variant="info" label={t('status.open')} />
        ) : (
          <StatusBadge variant="success" label={t('status.allVoted')} />
        )
      }
      primaryAction={{
        label:
          isEmpty
            ? t('votes.active.cta.view')
            : unvotedCount > 0
            ? t('votes.active.cta.vote')
            : t('votes.active.cta.results'),
        onClick: onViewVotes,
      }}
      aria-label={t('votes.active.ariaLabel', { count: activeCount })}
    />
  );
};

export default ActiveVotesCard;
