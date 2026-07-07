
/**
 * ProfileStats Component
 * Renders a grid of statistical cards for the user's profile.
 */
const ProfileStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index} 
            className="bg-dark-900 border border-dark-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:border-dark-700 hover:bg-dark-800/50 transition-all duration-300 group"
          >
            <div className={`p-4 rounded-2xl mb-4 shadow-inner ${stat.colorClass} ${stat.bgClass} group-hover:scale-110 transition-transform duration-300 ease-out`}>
              <Icon className="w-7 h-7" strokeWidth={2.5} />
            </div>
            <h4 className="text-3xl font-black text-white tracking-tight mb-1">{stat.value}</h4>
            <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileStats;
