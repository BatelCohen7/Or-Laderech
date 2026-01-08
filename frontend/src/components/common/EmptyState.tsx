import React from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  illustration?: 'urban-buildings' | 'document' | 'vote' | 'message';
}

/**
 * Empty State Component
 * 
 * Used when:
 * - No pending documents
 * - No active votes
 * - No messages
 * 
 * Includes:
 * - Illustration (urban theme)
 * - Title: dashboard.empty.title
 * - Subtitle: dashboard.empty.subtitle
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  illustration = 'urban-buildings',
}) => {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-state-illustration" aria-hidden="true">
        {illustration === 'urban-buildings' && (
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Urban buildings illustration */}
            <rect x="20" y="80" width="40" height="100" fill="#3B82F6" opacity="0.3" />
            <rect x="70" y="60" width="40" height="120" fill="#3B82F6" opacity="0.4" />
            <rect x="120" y="100" width="40" height="80" fill="#3B82F6" opacity="0.3" />
            <rect x="170" y="70" width="20" height="110" fill="#3B82F6" opacity="0.4" />
          </svg>
        )}
      </div>
      <h2 className="empty-state-title">{title}</h2>
      <p className="empty-state-subtitle">{subtitle}</p>
    </div>
  );
};

export default EmptyState;
