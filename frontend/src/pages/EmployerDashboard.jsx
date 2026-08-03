import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axiosInstance';
import { LogOut, ShieldCheck, FileBadge, Activity, Key, TrendingUp, Building, Settings, Search, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function EmployerDashboard() {
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('employerToken');
        const [profileRes, analyticsRes] = await Promise.all([
          api.get('/employer/profile', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/employer/analytics', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setProfile(profileRes.employer);
        setAnalytics(analyticsRes.data);
      } catch (error) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('employerToken');
        navigate('/employer/login');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/employer/logout');
    } catch (e) {}
    localStorage.removeItem('employerToken');
    toast.success('Logged out successfully');
    navigate('/employer/login');
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center border border-indigo-500/50">
                <Building className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white cursor-pointer" onClick={() => navigate('/employer/dashboard')}>Employer Portal</span>
            </div>
            
            <nav className="hidden md:flex gap-6 items-center">
              <span className="cursor-pointer text-gray-400 hover:text-white transition-colors" onClick={() => navigate('/employer/dashboard')}>Dashboard</span>
              <span className="cursor-pointer text-gray-400 hover:text-white transition-colors" onClick={() => navigate('/employer/candidates')}>Candidate Search</span>
              <span className="cursor-pointer text-gray-400 hover:text-white transition-colors" onClick={() => navigate('/employer/history')}>History</span>
              <span className="cursor-pointer text-gray-400 hover:text-white transition-colors" onClick={() => navigate('/employer/api-keys')}>API Keys</span>
              <span className="cursor-pointer text-gray-400 hover:text-white transition-colors" onClick={() => navigate('/employer/settings')}>Settings</span>
            </nav>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-300 hidden sm:block">
                {profile?.companyName}
              </span>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 flex-1 w-full">
        
        <div>
          <h1 className="text-3xl font-extrabold text-white">Dashboard Overview</h1>
          <p className="mt-2 text-gray-400">Welcome back! Here's your platform usage data.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Certificates Verified" value={analytics?.totalVerified || 0} icon={<ShieldCheck className="w-6 h-6 text-green-400" />} />
          <StatCard title="Total Candidate Searches" value={analytics?.totalSearches || 0} icon={<Search className="w-6 h-6 text-blue-400" />} change={`${analytics?.trend7Days || 0} in last 7 days`} onClick={() => navigate('/employer/history')} />
          <StatCard title="Active API Keys" value={analytics?.activeApiKeys || 0} icon={<Key className="w-6 h-6 text-yellow-400" />} change="Manage keys in settings" onClick={() => navigate('/employer/api-keys')} />
          <StatCard title="Last Verification" value={analytics?.lastVerification ? new Date(analytics.lastVerification).toLocaleDateString() : 'Never'} icon={<Clock className="w-6 h-6 text-purple-400" />} />
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <NavCard title="Candidate Search" desc="Verify a specific candidate certificate" icon={<Search className="w-8 h-8 text-indigo-400" />} onClick={() => navigate('/employer/candidates')} />
          <NavCard title="Verification History" desc="Audit log of your candidate verifications" icon={<Activity className="w-8 h-8 text-green-400" />} onClick={() => navigate('/employer/history')} />
          <NavCard title="Settings & Integration" desc="Manage profile and API keys" icon={<Settings className="w-8 h-8 text-gray-400" />} onClick={() => navigate('/employer/settings')} />
        </div>

      </main>
    </div>
  );
}

function StatCard({ title, value, icon, change, onClick }) {
  return (
    <div onClick={onClick} className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg transition-all group ${onClick ? 'cursor-pointer hover:border-indigo-500 hover:bg-gray-800' : 'hover:border-gray-700'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gray-800 rounded-xl group-hover:bg-gray-700 transition-colors">
          {icon}
        </div>
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white tracking-tight mb-2">{value}</p>
      {change && <p className="text-xs text-gray-500 font-medium">{change}</p>}
    </div>
  );
}

function NavCard({ title, desc, icon, onClick }) {
  return (
    <div onClick={onClick} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg cursor-pointer hover:border-indigo-500 hover:bg-gray-800 transition-all flex flex-col items-center text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}
