import { useState, useEffect } from 'react';
import { 
  Users, UserCheck, Shield, Activity, Award, BookOpen, Heart, Calendar, Star, CheckCircle, PlusCircle
} from 'lucide-react';
import adminService from '../services/adminService';

export default function AdminDashboardHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminService.getDashboardStats();
        console.log("Dashboard API Response", res);
        
        // axiosInstance unwraps response.data, so res is the JSON body { status: 'success', data: {...} }
        if (res && res.data) {
          setData(res.data);
        } else {
          setError('Invalid API response structure');
        }
      } catch (err) {
        console.error("Dashboard API Error", err);
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-400 animate-pulse">Loading Dashboard...</div>;
  if (error) return (
    <div className="p-8">
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center">
        {error}
      </div>
    </div>
  );
  if (!data) return <div className="p-8 text-center text-slate-400">No dashboard data available.</div>;

  const stats = data?.stats || {};
  const recentRegistrations = data?.recentRegistrations || [];
  const latestCertificates = data?.latestCertificates || [];
  const activityFeed = data?.activityFeed || [];

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-400 mt-2">Overview of CharacterU platform statistics and activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers ?? 0} icon={Users} color="text-primary-500" />
        <StatCard title="Total Students" value={stats.totalStudents ?? 0} icon={UserCheck} color="text-blue-500" />
        <StatCard title="Total Admins" value={stats.totalAdmins ?? 0} icon={Shield} color="text-purple-500" />
        <StatCard title="Active Users" value={stats.activeUsers ?? 0} icon={Activity} color="text-green-500" />
        <StatCard title="Certificates Issued" value={stats.certificatesIssued ?? 0} icon={Award} color="text-yellow-500" />
        <StatCard title="Courses" value={stats.courses ?? 0} icon={BookOpen} color="text-indigo-500" />
        <StatCard title="Community Deeds" value={stats.communityDeeds ?? 0} icon={Heart} color="text-rose-500" />
        <StatCard title="Today's Check-ins" value={stats.todaysCheckIns ?? 0} icon={Calendar} color="text-teal-500" />
        <StatCard title="Avg Character Score" value={stats.avgCharacterScore ?? 0} icon={Star} color="text-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-400" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {activityFeed.length === 0 ? (
                <p className="text-slate-500">No recent activity.</p>
              ) : (
                activityFeed.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-dark-800/50 transition-colors">
                    <div className="mt-1">
                      {activity.type === 'registration' && <PlusCircle className="w-5 h-5 text-blue-400" />}
                      {activity.type === 'certificate' && <Award className="w-5 h-5 text-yellow-400" />}
                    </div>
                    <div>
                      <p className="text-slate-200">{activity.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{new Date(activity.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-white mb-6">Recent Registrations</h3>
            <div className="space-y-4">
              {recentRegistrations.length === 0 ? (
                <p className="text-slate-500">No recent registrations.</p>
              ) : (
                recentRegistrations.map(user => (
                  <div key={user._id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center text-primary-400 font-bold text-sm">
                      {(user.fullName || user.username).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{user.fullName || user.username}</p>
                      <p className="text-xs text-slate-500">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-white mb-6">Latest Certificates</h3>
            <div className="space-y-4">
              {latestCertificates.length === 0 ? (
                <p className="text-slate-500">No certificates issued yet.</p>
              ) : (
                latestCertificates.map(cert => (
                  <div key={cert._id} className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Award className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{cert.user?.fullName || 'Student'}</p>
                      <p className="text-xs text-slate-500">ID: {cert.certificateId}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-dark-900 p-6 rounded-2xl border border-dark-800 shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02]">
    <div className="space-y-2">
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
    <div className={`p-4 rounded-xl bg-dark-800/50 ${color}`}>
      <Icon className="w-8 h-8" />
    </div>
  </div>
);
