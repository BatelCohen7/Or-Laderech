import React, { useState } from 'react';
import { DivideIcon as LucideIcon, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'time' | 'datetime-local' | 'search';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  pattern?: string;
  success?: boolean;
  helpText?: string;
  animate?: boolean;
  maxLength?: number;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  onBlur,
  icon: Icon,
  iconPosition = 'right',
  required = false,
  disabled = false,
  error,
  className = '',
  name,
  id,
  autoComplete,
  min,
  max,
  step,
  pattern,
  success = false,
  helpText,
  animate = false,
  maxLength,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || name || Math.random().toString(36).substring(2, 9);
  const inputValue = value !== undefined && value !== null ? value : ''; 
  
  const baseClasses = 'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 bg-neutral-50 focus:bg-white';
  const errorClasses = error ? 'border-red-300 focus:ring-red-500 pr-10' : 'border-neutral-300';
  const successClasses = success && !error ? 'border-green-300 focus:ring-green-500 pr-10' : '';
  const disabledClasses = disabled ? 'bg-neutral-100 text-neutral-500 cursor-not-allowed' : '';
  const iconClasses = Icon ? (iconPosition === 'right' ? 'pr-10' : 'pl-10') : '';
  const passwordClasses = type === 'password' ? 'pr-10 pl-10' : '';
  const focusedClasses = isFocused ? 'border-gold-400' : '';
  
  const classes = `${baseClasses} ${errorClasses} ${successClasses} ${disabledClasses} ${iconClasses} ${passwordClasses} ${focusedClasses} ${className}`;

  const actualType = type === 'password' && showPassword ? 'text' : type;

  const handleFocus = () => setIsFocused(true);
  const handleBlurEvent = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const InputWrapper = animate ? motion.div : 'div';
  const wrapperProps = animate ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <InputWrapper className="space-y-1.5" {...wrapperProps}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={actualType}
          value={inputValue}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlurEvent}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          className={classes}
          name={name}
          id={inputId}
          autoComplete={autoComplete}
          min={min}
          max={max}
          step={step}
          pattern={pattern}
        />
        {Icon && (
          <div className={`absolute ${iconPosition === 'right' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2`}>
            <Icon className="w-5 h-5 text-neutral-400" />
          </div>
        )}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-gold-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 text-red-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        {success && !error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 text-green-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
      {(error || helpText) && (
        <motion.p 
          className={`text-xs ${error ? 'text-red-600' : 'text-neutral-500'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          {error || helpText}
        </motion.p>
      )}
    </InputWrapper>
  );
};

export default Input;