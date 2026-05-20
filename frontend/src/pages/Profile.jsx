import React from 'react';
import { useAuth } from '../hooks/useAuth';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import AchievementCard from '../components/profile/AchievementCard';
import { Star, Flame, CalendarCheck, Target, Heart, ShieldCheck, Handshake, ShieldAlert } from 'lucide-react';

/**
 * Profile Page Component
 * Renders the user's personal dashboard, including their identity, 
 * gamified statistics, and unlocked achievements.
 */
const Profile = () => {
  const { user } = useAuth();

  // Mock data as per requirements. Real data will be connected later via APIs.
  const mockStats = [
    { label: 'Character Score', value: '3,450', icon: Star, colorClass: 'text-yellow-400', bgClass: 'bg-yellow-400/10' },
    { label: 'Current Streak', value: '12 Days', icon: Flame, colorClass: 'text-orange-400', bgClass: 'bg-orange-400/10' },
    { label: 'Total Check-Ins', value: '45', icon: CalendarCheck, colorClass: 'text-emerald-400', bgClass: 'bg-emerald-400/10' },
    { label: 'Pledges Active', value: '2', icon: Target, colorClass: 'text-purple-400', bgClass: 'bg-purple-400/10' },
  ];

  const mockAchievements = [
    { 
      title: 'First Pledge', 
      description: 'Submitted your first character pledge video.', 
      icon: Target, 
      unlocked: true, 
      date: 'Oct 12, 2024' 
    },
    { 
      title: '7-Day Streak', 
      description: 'Completed a daily check-in for 7 consecutive days.', 
      icon: Flame, 
      unlocked: true, 
      date: 'Oct 19, 2024' 
    },
    { 
      title: 'Community Helper', 
      description: 'Helped someone 10 times in your daily check-ins.', 
      icon: Handshake, 
      unlocked: false, 
      date: null 
    },
    { 
      title: 'Peace Advocate', 
      description: 'Avoided conflict 30 times in your daily check-ins.', 
      icon: ShieldCheck, 
      unlocked: false, 
      date: null 
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
        <ProfileStats stats={mockStats} />
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
