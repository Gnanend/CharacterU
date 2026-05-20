import React, { useState, useEffect } from 'react';
import { Trophy, Globe, MapPin, Map, Users } from 'lucide-react';
import TopRankCard from '../components/leaderboard/TopRankCard';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import leaderboardService from '../services/leaderboardService';
import { showToast } from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';

/**
 * Leaderboard Page Component
 * Renders the full gamified ranking view including the Top 3 podium,
 * filtering options, and the general ranking table.
 */
const Leaderboard = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('global');
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);

  // Interactive filters (UI only for now, can be wired to backend params later)
  const filters = [
    { id: 'global', label: 'Global', icon: Globe },
    { id: 'country', label: 'Country', icon: Map },
    { id: 'city', label: 'City', icon: MapPin },
    { id: 'friends', label: 'Friends', icon: Users },
  ];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await leaderboardService.getLeaderboard();
        setLeaderboardData(response.data || []);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        showToast.error('Could not load leaderboard rankings.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [activeFilter]);

  // Split data for podium (top 3) vs table (everyone else)
  // The service already returns them sorted by rank (index + 1)
  const topUsers = leaderboardData.slice(0, 3).map(u => ({
    id: u.userId,
    name: u.fullName,
    role: u.userId === user?._id ? 'You' : 'Member',
    score: u.characterScore.toLocaleString(),
    streak: u.currentStreak,
    isCurrentUser: u.userId === user?._id,
    avatar: u.avatar
  }));
  
  const otherUsers = leaderboardData.slice(3).map((u, i) => ({
    id: u.userId,
    name: u.fullName,
    role: u.userId === user?._id ? 'You' : 'Member',
    score: u.characterScore.toLocaleString(),
    streak: u.currentStreak,
    isCurrentUser: u.userId === user?._id,
    avatar: u.avatar,
    actualRank: i + 4
  }));

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 pb-12 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-900 to-dark-800 text-primary-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary-500/20 shadow-xl shadow-primary-900/10">
          <Trophy className="w-10 h-10" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Character Rankings</h1>
        <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
          See how you stack up against the CharacterU community. Build your streak and rise through the ranks!
        </p>
      </div>

      {/* Filter Navigation Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 p-2 bg-dark-900/80 border border-dark-800 rounded-2xl w-fit mx-auto backdrop-blur-sm shadow-sm">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                isActive 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30' 
                  : 'text-slate-400 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {filter.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-slate-400">Loading live rankings...</p>
        </div>
      ) : leaderboardData.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400">No rankings available yet.</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium View */}
          <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6 md:gap-0 mt-8 mb-16 px-4">
            {topUsers.length > 1 && (
              <div className="w-full max-w-[280px] md:w-1/3 order-2 md:order-1">
                <TopRankCard rank={2} user={topUsers[1]} />
              </div>
            )}
            {topUsers.length > 0 && (
              <div className="w-full max-w-[280px] md:w-1/3 order-1 md:order-2 md:z-10">
                <TopRankCard rank={1} user={topUsers[0]} />
              </div>
            )}
            {topUsers.length > 2 && (
              <div className="w-full max-w-[280px] md:w-1/3 order-3 md:order-3">
                <TopRankCard rank={3} user={topUsers[2]} />
              </div>
            )}
          </div>

          {/* Remaining Leaderboard Table View */}
          {otherUsers.length > 0 && (
            <div className="pt-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-xl font-bold text-white">Current Standings</h3>
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Top 100</span>
              </div>
              <LeaderboardTable users={otherUsers} />
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default Leaderboard;
