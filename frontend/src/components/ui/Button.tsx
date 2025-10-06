import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  rounded?: 'default' | 'full';
  animate?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children = null,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
  rounded = 'default',
  animate = true
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-gold-500 to-warmGold-400 text-white hover:shadow-md focus:ring-gold-500 shadow-sm hover:scale-105 transform transition-transform border border-gold-400/50',
    secondary: 'bg-gradient-to-r from-navy-600 to-navy-700 text-white hover:shadow-md focus:ring-navy-500 shadow-sm hover:scale-105 transform transition-transform',
    outline: 'border-2 border-gold-500 text-gold-600 hover:bg-gold-50 focus:ring-gold-500 hover:scale-105 transform transition-transform bg-white',
    ghost: 'text-neutral-600 hover:text-gold-600 hover:bg-gold-50 focus:ring-gold-500 hover:scale-105 transform transition-transform',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 hover:scale-105 transform transition-transform',
    success: 'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500 hover:scale-105 transform transition-transform'
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg'
  };

  const roundedClasses = {
    default: 'rounded-xl',
    full: 'rounded-full'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${roundedClasses[rounded]} ${widthClass} ${className}`;

  const ButtonComponent = animate ? motion.button : 'button';
  const motionProps = animate ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <ButtonComponent
      type={type as any}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...motionProps}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
          {children}
        </div>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5 ml-2" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5 mr-2" />}
        </>
      )}
    </ButtonComponent>
  );
};

export default Button;