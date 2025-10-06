import React from 'react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'neutral' | 'success' | 'error';
  className?: string;
  text?: string;
  centered?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  text,
  centered = false
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colors = {
    primary: 'border-gold-500',
    white: 'border-white',
    neutral: 'border-neutral-500',
    success: 'border-green-500',
    error: 'border-red-500'
  };

  const spinnerClasses = `rounded-full border-2 border-t-transparent ${sizes[size]} ${colors[color]} ${className}`;
  const containerClasses = centered ? 'flex flex-col items-center justify-center' : '';

  if (text) {
    return (
      <div className={`flex flex-col items-center space-y-2 ${containerClasses}`}>
        <div className={spinnerClasses + " animate-spin"}></div>
        <p className="text-neutral-600 font-medium text-sm">{text}</p>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className={spinnerClasses + " animate-spin"}></div>
    </div>
  );
};

export default LoadingSpinner;