import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  rounded?: 'full' | 'lg';
  animate?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children = null,
  variant = 'default',
  size = 'md',
  className = '',
  rounded = 'full',
  animate = false
}) => {
  const baseClasses = 'inline-flex items-center font-medium';
  
  const variants = {
    default: 'bg-neutral-100 text-neutral-700 border border-neutral-200/70',
    success: 'bg-accent-100 text-accent-700 border border-accent-200/70',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200/70',
    error: 'bg-red-100 text-red-700 border border-red-200/70',
    info: 'bg-primary-100 text-primary-700 border border-primary-200/70',
    primary: 'bg-gold-100 text-gold-700 border border-gold-200/70'
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs font-medium',
    sm: 'px-2 py-1 text-xs font-medium',
    md: 'px-2.5 py-1 text-sm font-medium'
  };

  const roundedClasses = {
    full: 'rounded-full',
    lg: 'rounded-lg'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${roundedClasses[rounded]} ${className}`;

  const BadgeComponent = animate ? motion.span : 'span';
  const motionProps = animate ? {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: "spring", stiffness: 500, damping: 30 }
  } : {};

  return (
    <BadgeComponent className={classes} {...motionProps}>
      {children}
    </BadgeComponent>
  );
};

export default Badge;