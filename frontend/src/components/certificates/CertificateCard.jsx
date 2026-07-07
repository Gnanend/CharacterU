import { useTranslation } from 'react-i18next';

import { Award, Lock } from 'lucide-react';
import ProgressTracker from './ProgressTracker';
import RequirementItem from './RequirementItem';

/**
 * CertificateCard Component
 * Displays the core details of a character certification tier.
 * Implements a premium gamified design with unique styling per tier 
 * (Bronze, Silver, Gold, Platinum).
 */
const CertificateCard = ({ tier, requirements, progress, isUnlocked, isLocked }) => {
  const { t } = useTranslation('common');

  
  // High-fidelity SaaS styling maps based on the certificate tier
  const styles = {
    Bronze: {
      bg: 'from-orange-900/40 to-dark-900',
      border: 'border-orange-700/30',
      iconText: 'text-orange-500',
      iconBg: 'bg-orange-500/20',
      progressColor: 'bg-orange-500',
      shadow: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]'
    },
    Silver: {
      bg: 'from-slate-700/30 to-dark-900',
      border: 'border-slate-500/30',
      iconText: 'text-slate-300',
      iconBg: 'bg-slate-400/20',
      progressColor: 'bg-slate-400',
      shadow: 'hover:shadow-[0_0_30px_rgba(148,163,184,0.15)]'
    },
    Gold: {
      bg: 'from-yellow-600/30 to-dark-900',
      border: 'border-yellow-500/30',
      iconText: 'text-yellow-400',
      iconBg: 'bg-yellow-500/20',
      progressColor: 'bg-yellow-500',
      shadow: 'hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]'
    },
    Platinum: {
      bg: 'from-cyan-700/30 to-dark-900',
      border: 'border-cyan-400/30',
      iconText: 'text-cyan-300',
      iconBg: 'bg-cyan-500/20',
      progressColor: 'bg-cyan-400',
      shadow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]'
    }
  };

  const currentStyle = styles[tier] || styles.Bronze;

  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-500 ${
      isLocked 
        ? 'bg-dark-950/80 border-dark-800 grayscale-[0.8] opacity-80' 
        : `bg-gradient-to-br ${currentStyle.bg} ${currentStyle.border} ${currentStyle.shadow} hover:-translate-y-1`
    }`}>
      
      {/* Decorative ambient background flare */}
      {!isLocked && (
        <div className={`absolute -right-10 -top-10 w-48 h-48 rounded-full blur-[60px] opacity-20 pointer-events-none ${currentStyle.progressColor}`}></div>
      )}

      {/* Header Section */}
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className="flex items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner border border-white/5 ${
            isLocked ? 'bg-dark-800 text-slate-600' : `${currentStyle.iconBg} ${currentStyle.iconText}`
          }`}>
            {isLocked ? <Lock className="w-8 h-8" /> : <Award className="w-8 h-8" />}
          </div>
          <div>
            <h3 className={`text-2xl font-black tracking-tight ${isLocked ? 'text-slate-500' : 'text-white'}`}>
              {tier}
            </h3>
            <p className={`text-sm font-bold uppercase tracking-wider ${isLocked ? 'text-slate-600' : 'text-slate-400'}`}>
              {isUnlocked ? 'Unlocked' : isLocked ? 'Locked' : 'In Progress'}
            </p>
          </div>
        </div>
        
        {/* Verification Badge */}
        {isUnlocked && (
          <div className="hidden sm:flex px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full shadow-inner">{t('verified', 'Verified')}</div>
        )}
      </div>

      {/* Progress Bar Section */}
      <div className="mb-8 relative z-10">
        <ProgressTracker 
          progress={progress} 
          colorClass={isLocked ? 'bg-dark-700' : isUnlocked ? 'bg-emerald-500' : currentStyle.progressColor} 
        />
      </div>

      {/* Dynamic Requirements List */}
      <div className="space-y-3 relative z-10">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{t('requirements', 'Requirements')}</h4>
        <div className="space-y-2">
          {requirements.map((req, index) => (
            <RequirementItem 
              key={index} 
              text={req.text} 
              isCompleted={req.completed} 
              isLocked={isLocked}
            />
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default CertificateCard;
