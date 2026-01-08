import React from 'react';
import './StatusBadge.css';

type StatusBadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
  variant: StatusBadgeVariant;
  label: string;
  'aria-label'?: string;
}

/**
 * Status Badge Component
 * 
 * Variants:
 * - Pending: Yellow (warning)
 * - Signed / Completed: Green (success)
 * - Closed / Expired: Gray (neutral)
 * - Action required: Blue (info)
 * 
 * Text always included (not color-only).
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant,
  label,
  'aria-label': ariaLabel,
}) => {
  return (
    <span
      className={`status-badge status-badge--${variant}`}
      aria-label={ariaLabel || label}
      role="status"
    >
      {label}
    </span>
  );
};

export default StatusBadge;
