
import { Check } from 'lucide-react';

/**
 * Interactive card component representing a single character-building activity.
 * Designed with a gamified SaaS aesthetic: toggles a green glow and checkmark when selected.
 */
const ActivityCard = ({ title, icon: Icon, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer rounded-2xl p-4 border transition-all duration-300 flex flex-col items-center justify-center text-center gap-3 h-32 select-none group ${
        isSelected 
          ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)] scale-[1.02]' 
          : 'bg-dark-900 border-dark-800 hover:border-dark-700 hover:bg-dark-800/50 hover:scale-[1.02]'
      }`}
    >
      {/* Animated Checkmark Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center animate-in zoom-in duration-200 shadow-md">
          <Check className="w-3.5 h-3.5 text-white font-bold" strokeWidth={3} />
        </div>
      )}
      
      {/* Dynamic Icon Container */}
      <div className={`p-3 rounded-xl transition-colors duration-300 ${
        isSelected 
          ? 'bg-emerald-500/20 text-emerald-400' 
          : 'bg-dark-800 text-slate-400 group-hover:text-slate-300 group-hover:bg-dark-700'
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      
      {/* Dynamic Text */}
      <p className={`text-sm font-semibold transition-colors duration-300 ${
        isSelected ? 'text-emerald-400' : 'text-slate-300'
      }`}>
        {title}
      </p>
    </div>
  );
};

export default ActivityCard;
