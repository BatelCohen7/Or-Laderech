import React from 'react';
import { useTranslation } from 'react-i18next';
import CardBase from './CardBase';
import StatusBadge from '../badges/StatusBadge';
import PrimaryButton from '../buttons/PrimaryButton';
import './PendingDocumentsCard.css';

interface Document {
  id: string;
  title: string;
  status: 'PENDING' | 'SIGNED';
  assignedAt: string;
}

interface PendingDocumentsCardProps {
  documents: Document[];
  onViewDocuments: () => void;
}

/**
 * Card: Pending Documents
 * 
 * Content:
 * - Icon: document
 * - Title: documents.pending.title
 * - Description: documents.pending.description
 * - Status badge: PENDING
 * - Primary CTA: documents.pending.cta
 * - Click → My Documents
 */
const PendingDocumentsCard: React.FC<PendingDocumentsCardProps> = ({
  documents,
  onViewDocuments,
}) => {
  const { t } = useTranslation();

  const pendingDocuments = documents.filter((d) => d.status === 'PENDING');
  const pendingCount = pendingDocuments.length;
  const signedCount = documents.filter((d) => d.status === 'SIGNED').length;

  // Empty state variant: show card but with "no pending" message
  const isEmpty = pendingCount === 0;

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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      }
      title={t('documents.pending.title')}
      description={
        isEmpty
          ? t('documents.pending.description.none')
          : t('documents.pending.description', { count: pendingCount, signed: signedCount })
      }
      statusBadge={
        isEmpty ? (
          <StatusBadge variant="success" label={t('status.allSigned')} />
        ) : (
          <StatusBadge variant="warning" label={t('status.pending')} />
        )
      }
      primaryAction={{
        label: isEmpty ? t('documents.pending.cta.view') : t('documents.pending.cta.sign'),
        onClick: onViewDocuments,
      }}
      aria-label={t('documents.pending.ariaLabel', { count: pendingCount })}
    />
  );
};

export default PendingDocumentsCard;
