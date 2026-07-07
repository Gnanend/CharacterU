import { useTranslation } from 'react-i18next';

import { Star } from 'lucide-react';

/**
 * LeaderboardCard Component
 * Acts as a single row item for users ranked 4th and below.
 * Features a clean horizontal layout with hover-state highlights.
 */
const LeaderboardCard = ({ rank, user }) => {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-dark-900 hover:bg-dark-800/60 border border-dark-800 hover:border-dark-700 rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md">
      
      {/* User Identity Section */}
      <div className="flex items-center gap-4 w-full sm:w-auto mb-3 sm:mb-0">
        
        {/* Rank Number */}
        <div className="w-8 font-black text-slate-500 text-xl text-center group-hover:text-primary-400 transition-colors shrink-0">
          {rank}
        </div>
        
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center font-bold text-white border border-dark-700 shadow-inner shrink-0 overflow-hidden">
          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} /> : user.name.charAt(0)}
        </div>
        
        {/* Name & Location */}
        <div className="truncate pr-4">
          <h4 className="text-white font-bold text-base truncate flex items-center gap-2">
            {user.name}
            {user.isCurrentUser && <span className="bg-primary-900/50 text-primary-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">{t('you', 'You')}</span>}
          </h4>
          <p className="text-xs text-slate-400 font-medium capitalize">
            {user.city && user.country ? `${user.city}, ${user.country}` : user.country || user.city || user.role}
          </p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="flex items-center gap-6 w-full sm:w-auto justify-end sm:justify-start pl-12 sm:pl-0 border-t sm:border-t-0 border-dark-800 sm:border-transparent pt-3 sm:pt-0 mt-1 sm:mt-0">
        <div className="flex items-center gap-2 min-w-[80px] justify-end">
          <Star className="w-5 h-5 text-primary-400" />
          <span className="text-white font-black text-lg">{user.score}</span>
        </div>
      </div>

    </div>
  );
};

export default LeaderboardCard;
