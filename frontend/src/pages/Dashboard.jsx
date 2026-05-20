import React from 'react';
import { useAuth } from '../hooks/useAuth';
import StatsCard from '../components/dashboard/StatsCard';
import { Target, Flame, Star, Activity, ArrowRight, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Main Dashboard Page
 * Represents the highly-visual, modern SaaS landing view for authenticated users.
 */
const Dashboard = () => {
  const { user } = useAuth();

  // Mock data as per requirements. Real data will be connected later.
  const mockStats = {
    totalScore: 124,
    streak: 5,
    pledgesCompleted: 2,
    rank: 'Gold',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Welcome back, <span className="text-white font-medium">{user?.fullName}</span>. Here's your character progress.
          </p>
        </div>
        
        {/* Primary Call to Action */}
        <Link 
          to="/check-in" 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-primary-900/20"
        >
          <Target className="w-5 h-5" />
          <span>Daily Check-In</span>
        </Link>
      </div>

      {/* Responsive Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Character Score" 
          value={mockStats.totalScore} 
          subtitle="+12 this week"
          icon={Star} 
          colorClass="text-yellow-400"
          bgClass="bg-yellow-400/10"
        />
        <StatsCard 
          title="Current Streak" 
          value={`${mockStats.streak} Days`} 
          subtitle="You're on fire! 🔥"
          icon={Flame} 
          colorClass="text-orange-400"
          bgClass="bg-orange-400/10"
        />
        <StatsCard 
          title="Pledges Active" 
          value={mockStats.pledgesCompleted} 
          subtitle="1 pending review"
          icon={Target} 
          colorClass="text-emerald-400"
          bgClass="bg-emerald-400/10"
        />
        <StatsCard 
          title="Current Rank" 
          value={mockStats.rank} 
          subtitle="Top 15% of students"
          icon={Activity} 
          colorClass="text-purple-400"
          bgClass="bg-purple-400/10"
        />
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity Panel (Left - Takes up 2 columns on lg screens) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white tracking-tight">Recent Activity</h3>
              <button className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors inline-flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* Placeholder Empty State using modern dashed borders */}
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-dark-800 rounded-xl bg-dark-950/50">
              <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <Activity className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-white font-medium mb-1">No recent activity</p>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                Complete your daily check-in or submit a pledge to start building your character timeline.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions & Promos (Right - Takes up 1 column on lg screens) */}
        <div className="space-y-6">
          
          {/* Glassmorphism/Gradient Callout Card */}
          <div className="bg-gradient-to-br from-primary-900/40 to-dark-900 border border-primary-500/20 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
            {/* Decorative background glow effect */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-colors duration-700"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mb-4 border border-primary-500/30">
                <PlayCircle className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Submit a Video Pledge</h3>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Record a short video committing to your next character growth goal to earn bonus points and unlock new ranks.
              </p>
              <Link 
                to="/pledge" 
                className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 bg-white text-primary-900 hover:bg-slate-100 rounded-xl font-bold transition-all shadow-md"
              >
                Start Recording
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
