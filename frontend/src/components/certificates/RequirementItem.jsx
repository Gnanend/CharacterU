
import { CheckCircle2, Circle } from 'lucide-react';

/**
 * RequirementItem Component
 * Renders a single requirement task for a certificate,
 * displaying a checkmark if completed or an empty circle if not.
 */
const RequirementItem = ({ text, isCompleted, isLocked }) => {
  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors duration-300 ${
      isCompleted 
        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm' 
        : isLocked 
          ? 'bg-dark-950 border-dark-800 text-slate-500 opacity-60' 
          : 'bg-dark-900 border-dark-800 text-slate-300 shadow-sm'
    }`}>
      {isCompleted ? (
        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
      ) : (
        <Circle className="w-5 h-5 shrink-0 mt-0.5 opacity-50" />
      )}
      <span className="text-sm font-medium leading-snug">{text}</span>
    </div>
  );
};

export default RequirementItem;
