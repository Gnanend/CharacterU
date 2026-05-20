import React, { useState } from 'react';
import { Trophy, Globe, MapPin, Map, Users } from 'lucide-react';
import TopRankCard from '../components/leaderboard/TopRankCard';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';

// Mock data as per requirements
const mockTopUsers = [
  { id: 1, name: 'Alex Johnson', role: 'student', score: '12,450', streak: 45 },
  { id: 2, name: 'Sarah Miller', role: 'student', score: '11,200', streak: 30 },
  { id: 3, name: 'David Chen', role: 'student', score: '9,800', streak: 22 },
];

const mockOtherUsers = [
  { id: 4, name: 'Emily White', role: 'student', score: '8,400', streak: 15 },
  { id: 5, name: 'Michael Brown', role: 'student', score: '7,900', streak: 12 },
  { id: 6, name: 'Jessica Davis', role: 'student', score: '7,500', streak: 10 },
  { id: 7, name: 'Daniel Wilson', role: 'student', score: '6,200', streak: 8 },
  { id: 8, name: 'Sophia Moore', role: 'student', score: '5,800', streak: 5 },
];

/**
 * Leaderboard Page Component
 * Renders the full gamified ranking view including the Top 3 podium,
 * filtering options, and the general ranking table.
 */
const Leaderboard = () => {
  const [activeFilter, setActiveFilter] = useState('global');

  // Interactive filters
  const filters = [
    { id: 'global', label: 'Global', icon: Globe },
    { id: 'country', label: 'Country', icon: Map },
    { id: 'city', label: 'City', icon: MapPin },
    { id: 'friends', label: 'Friends', icon: Users },
  ];

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

      {/* Top 3 Podium View */}
      {/* 
        Responsive layout trick: 
        On mobile, they stack vertically (1, 2, 3).
        On desktop, they align horizontally with Rank 1 in the middle. 
      */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6 md:gap-0 mt-8 mb-16 px-4">
        <div className="w-full max-w-[280px] md:w-1/3 order-2 md:order-1">
          <TopRankCard rank={2} user={mockTopUsers[1]} />
        </div>
        <div className="w-full max-w-[280px] md:w-1/3 order-1 md:order-2 md:z-10">
          <TopRankCard rank={1} user={mockTopUsers[0]} />
        </div>
        <div className="w-full max-w-[280px] md:w-1/3 order-3 md:order-3">
          <TopRankCard rank={3} user={mockTopUsers[2]} />
        </div>
      </div>

      {/* Remaining Leaderboard Table View */}
      <div className="pt-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-xl font-bold text-white">Current Standings</h3>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Top 100</span>
        </div>
        <LeaderboardTable users={mockOtherUsers} />
      </div>

    </div>
  );
};

export default Leaderboard;
