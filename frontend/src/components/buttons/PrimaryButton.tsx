import React from 'react';
import './PrimaryButton.css';

interface PrimaryButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  'aria-label'?: string;
  disabled?: boolean;
}

/**
 * Primary Button Component
 * 
 * Requirements:
 * - Minimum height: 44px
 * - Clear action verb
 * - Visible focus state
 * - Keyboard accessible
 */
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onClick,
  variant = 'primary',
  children,
  'aria-label': ariaLabel,
  disabled = false,
}) => {
  return (
    <button
      className={`primary-button primary-button--${variant}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      type="button"
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
