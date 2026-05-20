import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import AchievementCard from '../components/profile/AchievementCard';
import { Star, Flame, CalendarCheck, Target, Heart, ShieldCheck, Handshake, ShieldAlert } from 'lucide-react';
import { showToast } from '../components/ui/Toast';
import analyticsService from '../services/analyticsService';
import { StatCardSkeleton } from '../components/ui/SkeletonLoader';

/**
 * Profile Page Component
 * Renders the user's personal dashboard, including their identity, 
 * gamified statistics, and unlocked achievements.
 */
const Profile = () => {
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    characterScore: 0,
    currentStreak: 0,
    totalCheckIns: 0,
    pledgeCompleted: 0
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await analyticsService.getDashboardAnalytics();
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch profile analytics:', err);
        showToast.error('Could not load your latest analytics.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  // Format the real data into the shape expected by ProfileStats component
  const profileStatsData = [
    { label: 'Character Score', value: stats.characterScore, icon: Star, colorClass: 'text-yellow-400', bgClass: 'bg-yellow-400/10' },
    { label: 'Current Streak', value: `${stats.currentStreak} Days`, icon: Flame, colorClass: 'text-orange-400', bgClass: 'bg-orange-400/10' },
    { label: 'Total Check-Ins', value: stats.totalCheckIns, icon: CalendarCheck, colorClass: 'text-emerald-400', bgClass: 'bg-emerald-400/10' },
    { label: 'Pledges Active', value: stats.pledgeCompleted, icon: Target, colorClass: 'text-purple-400', bgClass: 'bg-purple-400/10' },
  ];

  const mockAchievements = [
    { 
      title: 'First Pledge', 
      description: 'Submitted your first character pledge video.', 
      icon: Target, 
      unlocked: stats.pledgeCompleted > 0, 
      date: stats.pledgeCompleted > 0 ? 'Unlocked' : null 
    },
    { 
      title: '7-Day Streak', 
      description: 'Completed a daily check-in for 7 consecutive days.', 
      icon: Flame, 
      unlocked: stats.currentStreak >= 7, 
      date: stats.currentStreak >= 7 ? 'Unlocked' : null 
    },
    { 
      title: 'Active Member', 
      description: 'Completed 10 total daily check-ins.', 
      icon: Handshake, 
      unlocked: stats.totalCheckIns >= 10, 
      date: stats.totalCheckIns >= 10 ? 'Unlocked' : null 
    },
    { 
      title: 'Character Master', 
      description: 'Reached a Character Score of 100.', 
      icon: ShieldCheck, 
      unlocked: stats.characterScore >= 100, 
      date: stats.characterScore >= 100 ? 'Unlocked' : null 
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 pb-12 animate-in fade-in duration-500">
      
      {/* Top Banner / Header */}
      <ProfileHeader user={user} />

      {/* Statistics Section */}
      <div className="space-y-5">
        <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Your Impact
        </h3>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : (
          <ProfileStats stats={profileStatsData} />
        )}
      </div>

      {/* Achievements Section */}
      <div className="space-y-5">
        <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-primary-400" />
          Badges & Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {mockAchievements.map((achievement, index) => (
            <AchievementCard 
              key={index}
              title={achievement.title}
              description={achievement.description}
              icon={achievement.icon}
              unlocked={achievement.unlocked}
              date={achievement.date}
            />
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default Profile;
