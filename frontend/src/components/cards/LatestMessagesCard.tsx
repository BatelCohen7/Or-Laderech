import React from 'react';
import { useTranslation } from 'react-i18next';
import CardBase from './CardBase';
import StatusBadge from '../badges/StatusBadge';
import PrimaryButton from '../buttons/PrimaryButton';
import './LatestMessagesCard.css';

interface Message {
  id: string;
  message: {
    id: string;
    title: string;
    body: string;
    createdAt: string;
  };
  status: 'UNREAD' | 'READ';
  deliveredAt: string;
}

interface LatestMessagesCardProps {
  messages: Message[];
  onViewMessages: () => void;
}

/**
 * Card: Latest Messages
 * 
 * Content:
 * - Icon: message
 * - Title: messages.latest.title
 * - Short preview (2 lines max)
 * - Status badge: UNREAD / READ
 * - CTA: messages.latest.cta
 * - Click → Messages List
 */
const LatestMessagesCard: React.FC<LatestMessagesCardProps> = ({
  messages,
  onViewMessages,
}) => {
  const { t } = useTranslation();

  const unreadMessages = messages.filter((m) => m.status === 'UNREAD');
  const unreadCount = unreadMessages.length;
  const latestMessage = messages[0]; // Already sorted by deliveredAt desc

  // Empty state variant: show card but with "no messages" message
  const isEmpty = messages.length === 0;

  // Truncate preview to 2 lines (approx 120 chars)
  const previewText = latestMessage?.message?.body
    ? latestMessage.message.body.substring(0, 120).replace(/\n/g, ' ')
    : '';

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
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      }
      title={t('messages.latest.title')}
      description={
        isEmpty
          ? t('messages.latest.description.none')
          : latestMessage
          ? `${latestMessage.message.title}${previewText ? `: ${previewText}...` : ''}`
          : t('messages.latest.description', { count: unreadCount })
      }
      statusBadge={
        isEmpty ? (
          <StatusBadge variant="neutral" label={t('status.noMessages')} />
        ) : unreadCount > 0 ? (
          <StatusBadge variant="warning" label={t('status.unread', { count: unreadCount })} />
        ) : (
          <StatusBadge variant="success" label={t('status.read')} />
        )
      }
      primaryAction={{
        label: isEmpty ? t('messages.latest.cta.view') : t('messages.latest.cta.read'),
        onClick: onViewMessages,
      }}
      aria-label={t('messages.latest.ariaLabel', { count: unreadCount })}
    />
  );
};

export default LatestMessagesCard;
