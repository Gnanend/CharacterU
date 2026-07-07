import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/ui/StatCard';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { Target, Flame, Star, Activity, ArrowRight, PlayCircle, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/ui/Toast';
import analyticsService from '../services/analyticsService';
import { StatCardSkeleton } from '../components/ui/SkeletonLoader';

/**
 * Main Dashboard Page
 * Refactored to utilize the centralized UI design system.
 */
const Dashboard = () => {
  const {
    user
  } = useAuth();
  const {
    t
  } = useTranslation('common');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalScore: 0,
    streak: 0,
    pledgesCompleted: 0,
    rank: 'Bronze'
  });
  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await analyticsService.getDashboardAnalytics();
        const data = response.data;

        let rank = t('bronze', 'Bronze');
        if (data.characterScore >= 50) rank = t('silver', 'Silver');
        if (data.characterScore >= 150) rank = t('gold', 'Gold');
        if (data.characterScore >= 500) rank = t('platinum', 'Platinum');
        setStats({
          totalScore: data.characterScore,
          streak: data.currentStreak,
          pledgesCompleted: data.pledgeCompleted,
          rank
        });
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        showToast.error(t('couldNotLoadYour', 'Could not load your latest analytics.'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div className="space-y-8">
      
      {/* Centralized Page Header */}
      <PageHeader title={t('dashboard', 'Dashboard')} subtitle={t('welcomeBackUserProgress', 'Welcome back, {{name}}. Here\'s your character progress.', { name: user?.fullName })} icon={LayoutDashboard} action={<Button onClick={() => navigate('/daily-checkin')} icon={Target}>{t('dailyCheckIn', 'Daily Check-In')}</Button>} />

      {/* Responsive Stats Grid using centralized StatCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </> : <>
            <StatCard title={t("characterScore", "Character Score")} value={stats.totalScore} trend={10} trendLabel={t("vsLastWeek", "vs last week")} icon={Star} colorClass="text-yellow-400" bgClass="bg-yellow-400/10" />
            <StatCard title={t("currentStreak", "Current Streak")} value={t("daysCount", "{{count}} Days", { count: stats.streak })} icon={Flame} colorClass="text-orange-400" bgClass="bg-orange-400/10" />
            <StatCard title={t("pledgesActive", "Pledges Active")} value={stats.pledgesCompleted} trend={0} trendLabel={t("pendingReview", "pending review")} icon={Target} colorClass="text-emerald-400" bgClass="bg-emerald-400/10" />
            <StatCard title={t("currentRank", "Current Rank")} value={stats.rank} icon={Activity} colorClass="text-purple-400" bgClass="bg-purple-400/10" />
          </>}
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity Panel using centralized Card & EmptyState */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white tracking-tight">{t('recentActivity', 'Recent Activity')}</h3>
              <Button variant="outline" size="sm" icon={ArrowRight}>{t('viewAll', 'View All')}</Button>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              {stats.recentCheckIns && stats.recentCheckIns.length > 0 ? <div className="space-y-4">
                  {stats.recentCheckIns.map(checkIn => <div key={checkIn._id} className="p-4 bg-dark-950 border border-dark-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{t('dailyCheckInCompl', 'Daily Check-In Completed')}</p>
                          <p className="text-sm text-slate-400">{new Date(checkIn.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-emerald-400 font-bold">
                        +{checkIn.score}{t("pts", "pts")}</div>
                    </div>)}
                </div> : <EmptyState icon={Activity} title={t("noRecentActivity", "No recent activity")} description={t("completeYourDailyCheckInOrSubm", "Complete your daily check-in or submit a pledge to start building your character timeline.")} className="w-full border-none bg-transparent py-8" />}
            </div>
          </Card>
        </div>

        {/* Quick Actions using localized glassmorphism override on Card */}
        <div className="space-y-6">
          <Card glass className="relative group overflow-hidden bg-gradient-to-br from-primary-900/40 to-dark-900 border-primary-500/20">
            {/* Decorative background glow effect */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-colors duration-700"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mb-4 border border-primary-500/30">
                <PlayCircle className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t('submitAVideoPledg', 'Submit a Video Pledge')}</h3>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">{t('recordAShortVideo', 'Record a short video committing to your next character growth goal to earn bonus points and unlock new ranks.')}</p>
              <Button variant="premium" onClick={() => navigate('/pledge')} className="w-full">{t('startRecording', 'Start Recording')}</Button>
            </div>
          </Card>
        </div>

      </div>
    </div>;
};
export default Dashboard;