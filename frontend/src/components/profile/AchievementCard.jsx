import React from 'react';

/**
 * AchievementCard Component
 * Displays a single gamified badge/achievement in the user's profile.
 * Handles both "unlocked" (colorful, highlighted) and "locked" (grayscale) states.
 */
const AchievementCard = ({ title, description, icon: Icon, unlocked, date }) => {
  return (
    <div className={`relative overflow-hidden border rounded-2xl p-6 transition-all duration-300 flex items-start gap-4 group ${
      unlocked 
        ? 'bg-gradient-to-br from-dark-900 to-dark-950 border-dark-700 hover:border-primary-500/50 hover:shadow-[0_4px_20px_rgba(var(--color-primary-500),0.15)] hover:-translate-y-1' 
        : 'bg-dark-950/50 border-dark-800 opacity-70 grayscale hover:opacity-100 hover:grayscale-0'
    }`}>
      
      {/* Decorative background flare for unlocked achievements */}
      {unlocked && (
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-colors"></div>
      )}

      {/* Icon Container */}
      <div className={`relative z-10 p-4 rounded-xl shrink-0 transition-colors ${
        unlocked 
          ? 'bg-primary-900/40 text-primary-400 shadow-inner border border-primary-500/20' 
          : 'bg-dark-800 text-slate-500 border border-dark-700'
      }`}>
        <Icon className="w-7 h-7" strokeWidth={2.5} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex-1">
        <h4 className={`text-base font-bold mb-1.5 ${unlocked ? 'text-white' : 'text-slate-400'}`}>
          {title}
        </h4>
        <p className="text-sm text-slate-500 leading-relaxed mb-3">
          {description}
        </p>
        
        {/* Date Unlocked */}
        <div className="mt-auto">
          {unlocked && date ? (
            <span className="inline-block px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider rounded-md">
              Unlocked: {date}
            </span>
          ) : (
            <span className="inline-block px-2.5 py-1 bg-dark-800 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-md">
              Locked
            </span>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default AchievementCard;
