import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * Reusable Button Component
 * Supports multiple variants, loading states, and icons.
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  disabled = false, 
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-300 active:scale-[0.98]';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/20 border border-transparent',
    secondary: 'bg-dark-800 hover:bg-dark-700 text-white border border-dark-700 hover:border-dark-600',
    outline: 'bg-transparent hover:bg-primary-900/20 text-primary-400 border border-primary-500/30',
    danger: 'bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 border border-transparent',
    premium: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 border border-transparent',
    white: 'bg-white hover:bg-slate-100 text-dark-950 shadow-md border border-transparent',
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none grayscale-[0.2]';

  const classes = `
    ${baseClasses} 
    ${sizeClasses[size] || sizeClasses.md} 
    ${variantClasses[variant] || variantClasses.primary} 
    ${(disabled || isLoading) ? disabledClasses : ''} 
    ${className}
  `.trim();

  return (
    <button 
      type={type} 
      className={classes} 
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner size="sm" className="text-current" />
      ) : Icon ? (
        <Icon className="w-5 h-5 shrink-0" />
      ) : null}
      
      {children}
    </button>
  );
};

export default Button;
