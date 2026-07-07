
import { Star } from 'lucide-react';

/**
 * TopRankCard Component
 * Spotlights the top 3 users in the leaderboard (Gold, Silver, Bronze).
 * Uses dynamic gradients, scales, and glowing borders to create a premium gamified feel.
 */
const TopRankCard = ({ rank, user }) => {
  const isGold = rank === 1;
  const isSilver = rank === 2;
  // Dynamic styling mapping based on leaderboard tier
  const colors = {
    bg: isGold ? 'from-yellow-500/20 to-yellow-900/10' : isSilver ? 'from-slate-300/20 to-slate-600/10' : 'from-orange-600/20 to-orange-900/10',
    border: isGold ? 'border-yellow-500/40' : isSilver ? 'border-slate-300/40' : 'border-orange-500/40',
    text: isGold ? 'text-yellow-400' : isSilver ? 'text-slate-200' : 'text-orange-400',
    icon: isGold ? 'text-yellow-500' : isSilver ? 'text-slate-300' : 'text-orange-500',
    crown: isGold ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-dark-950' : isSilver ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-dark-950' : 'bg-gradient-to-br from-orange-400 to-orange-600 text-dark-950',
    glow: isGold ? 'shadow-[0_0_30px_rgba(234,179,8,0.2)]' : isSilver ? 'shadow-[0_0_30px_rgba(203,213,225,0.1)]' : 'shadow-[0_0_30px_rgba(249,115,22,0.15)]',
  };

  return (
    <div className={`relative flex flex-col items-center p-6 bg-gradient-to-b ${colors.bg} border ${colors.border} rounded-[2rem] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 ${colors.glow} ${
      isGold ? 'scale-110 z-20 mx-4' : 'mt-8 sm:mt-12 z-10'
    }`}>
      
      {/* Floating Rank Crown */}
      <div className={`absolute -top-5 w-10 h-10 rounded-full flex items-center justify-center text-lg font-black shadow-xl border-2 border-dark-950 ${colors.crown}`}>
        {rank}
      </div>

      {/* Hero Avatar */}
      <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-dark-950 border-4 ${colors.border} flex items-center justify-center text-4xl font-black ${colors.text} shadow-inner mb-5 relative overflow-hidden`}>
        {/* Subtle inner glow */}
        <div className={`absolute inset-0 bg-gradient-to-t ${colors.bg} opacity-50 z-0`}></div>
        {user.avatar ? (
          <img src={user.avatar} className="relative z-10 w-full h-full object-cover" alt={user.name} />
        ) : (
          <span className="relative z-10">{user.name.charAt(0)}</span>
        )}
      </div>

      <h3 className="text-xl font-black text-white mb-1 truncate w-full text-center tracking-tight flex items-center justify-center gap-2">
        {user.name}
      </h3>
      <p className={`text-xs font-bold uppercase tracking-wider mb-5 ${colors.text}`}>
        {user.city && user.country ? `${user.city}, ${user.country}` : user.country || user.city || user.role}
      </p>

      {/* Core Statistics Pill */}
      <div className="flex gap-3 w-full justify-center">
        <div className="flex items-center gap-1.5 bg-dark-950/60 px-4 py-2 rounded-xl border border-dark-800 shadow-inner">
          <Star className={`w-5 h-5 ${colors.icon}`} />
          <span className="text-white font-black text-base">{user.score}</span>
        </div>
      </div>

    </div>
  );
};

export default TopRankCard;
