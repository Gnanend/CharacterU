import React from 'react';

/**
 * Reusable Stats Card Component for the Dashboard.
 * Designed with a premium SaaS aesthetic, featuring micro-animations on hover.
 * 
 * @param {string} title - The metric title (e.g. "Total Score")
 * @param {string|number} value - The primary metric value
 * @param {string} subtitle - Optional context (e.g. "+5 this week")
 * @param {React.Component} icon - Lucide React icon component
 * @param {string} colorClass - Tailwind text color class for the icon
 * @param {string} bgClass - Tailwind background color class for the icon container
 */
const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  colorClass = "text-primary-400", 
  bgClass = "bg-primary-900/30" 
}) => {
  return (
    <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-dark-700 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        
        {/* Text Content */}
        <div className="flex flex-col">
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight mb-2">{value}</h3>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium mt-auto">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Icon Container with hover scaling */}
        <div className={`p-3.5 rounded-xl ${bgClass} ${colorClass} shadow-inner group-hover:scale-110 transition-transform duration-300 ease-out`}>
          <Icon className="w-6 h-6" />
        </div>
        
      </div>
    </div>
  );
};

export default StatsCard;
