import React from 'react';
import './ErrorBanner.css';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  'aria-live'?: 'polite' | 'assertive' | 'off';
}

/**
 * Error Banner Component
 * 
 * Non-blocking error display
 * Shows error message + retry button
 */
const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onRetry,
  'aria-live': ariaLive = 'polite',
}) => {
  return (
    <div
      className="error-banner"
      role="alert"
      aria-live={ariaLive}
      aria-atomic="true"
    >
      <div className="error-banner-content">
        <span className="error-banner-message">{message}</span>
        {onRetry && (
          <button
            className="error-banner-retry"
            onClick={onRetry}
            aria-label="Retry"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorBanner;
