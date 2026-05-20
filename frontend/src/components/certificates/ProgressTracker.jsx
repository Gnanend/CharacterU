import React from 'react';

/**
 * ProgressTracker Component
 * Visualizes completion percentage using a sleek animated progress bar.
 */
const ProgressTracker = ({ progress, colorClass = "bg-primary-500" }) => {
  // Ensure progress remains between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="space-y-2.5 w-full">
      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
        <span>Progress</span>
        <span className={progress === 100 ? 'text-emerald-400' : 'text-slate-300'}>{clampedProgress}%</span>
      </div>
      
      {/* Progress Bar Track */}
      <div className="w-full bg-dark-950 rounded-full h-3.5 overflow-hidden border border-dark-800 shadow-inner">
        {/* Animated Fill */}
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${colorClass}`} 
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressTracker;
