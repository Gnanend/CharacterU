import React from 'react';
import Card from './Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * StatCard Component
 * Refined application-wide statistics card supporting trends.
 */
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  colorClass = "text-primary-400", 
  bgClass = "bg-primary-900/30",
  trend,
  trendLabel
}) => {
  return (
    <Card hover padding="p-6">
      <div className="flex items-start justify-between">
        
        {/* Text Content */}
        <div className="flex flex-col">
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-black text-white tracking-tight mb-2">{value}</h3>
          
          {/* Optional Trend Indicator */}
          {trend !== undefined && (
            <div className="flex items-center gap-1.5 mt-auto">
              {trend > 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : trend < 0 ? (
                <TrendingDown className="w-4 h-4 text-red-500" />
              ) : (
                <Minus className="w-4 h-4 text-slate-500" />
              )}
              <span className={`text-xs font-bold ${trend > 0 ? 'text-emerald-500' : trend < 0 ? 'text-red-500' : 'text-slate-500'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
              {trendLabel && <span className="text-xs text-slate-500">{trendLabel}</span>}
            </div>
          )}
        </div>
        
        {/* Icon Container */}
        <div className={`p-3.5 rounded-2xl ${bgClass} ${colorClass} shadow-inner group-hover:scale-110 transition-transform duration-300 ease-out`}>
          {Icon && <Icon className="w-6 h-6" strokeWidth={2.5} />}
        </div>
        
      </div>
    </Card>
  );
};

export default StatCard;
