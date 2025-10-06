import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick,
  border = true,
  shadow = 'md',
  animate = false
}) => {
  const baseClasses = 'bg-white rounded-xl overflow-hidden';
  
  const hoverClasses = hover ? 'hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1' : '';

  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7'
  };

  const shadows = {
    none: 'shadow-none',
    sm: 'shadow-sm border border-neutral-200',
    md: 'shadow-card border border-neutral-200',
    lg: 'shadow-luxury border border-neutral-200'
  };

  const borderClass = border ? 'border border-neutral-200/80' : '';

  const classes = `${baseClasses} ${hoverClasses} ${paddings[padding]} ${borderClass} ${shadows[shadow]} ${className}`;

  const CardComponent = animate ? motion.div : 'div';
  const motionProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
    whileHover: hover ? { y: -5, boxShadow: '0 10px 25px -5px rgba(212, 175, 55, 0.15)' } : undefined
  } : {};

  return (
    <CardComponent 
      className={classes} 
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...motionProps}
    >
      {children}
    </CardComponent>
  );
};

export default Card;