import React from 'react';

/**
 * LoadingSpinner component displaying a high-quality, modern, animated loader.
 */
const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[200px] ${className}`}>
      <div className="relative">
        {/* Outer glowing pulsing circle */}
        <div className={`absolute inset-0 rounded-full bg-primary-500/20 blur-md animate-pulse ${size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'}`}></div>
        
        {/* Spinner */}
        <div
          className={`${sizeClasses[size]} border-slate-800 border-t-primary-500 rounded-full animate-spin relative z-10`}
          role="status"
          aria-label="loading"
        ></div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-400 animate-pulse tracking-wide">
        Loading...
      </p>
    </div>
  );
};

export default LoadingSpinner;
