import React from 'react';
import StatusBadge from '../badges/StatusBadge';
import PrimaryButton from '../buttons/PrimaryButton';
import './CardBase.css';

interface CardBaseProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  statusBadge?: React.ReactNode;
  primaryAction: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  children?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

/**
 * Shared Card Component
 * 
 * Used for:
 * - Documents
 * - Votes
 * - Messages
 * 
 * Card includes:
 * - Title
 * - Status badge
 * - Short description (1 line)
 * - One primary action button
 */
const CardBase: React.FC<CardBaseProps> = ({
  icon,
  title,
  description,
  statusBadge,
  primaryAction,
  children,
  className = '',
  'aria-label': ariaLabel,
}) => {
  return (
    <article
      className={`card-base ${className}`}
      aria-label={ariaLabel || title}
      role="region"
    >
      {icon && <div className="card-base-icon" aria-hidden="true">{icon}</div>}
      
      <div className="card-base-content">
        <div className="card-base-header">
          <h3 className="card-base-title">{title}</h3>
          {statusBadge && <div className="card-base-badge">{statusBadge}</div>}
        </div>

        <p className="card-base-description">{description}</p>

        {children && <div className="card-base-children">{children}</div>}

        <div className="card-base-actions">
          <PrimaryButton
            onClick={primaryAction.onClick}
            variant={primaryAction.variant || 'primary'}
            aria-label={primaryAction.label}
          >
            {primaryAction.label}
          </PrimaryButton>
        </div>
      </div>
    </article>
  );
};

export default CardBase;
