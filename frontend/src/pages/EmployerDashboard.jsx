import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axiosInstance';
import { LogOut, ShieldCheck, FileBadge, Activity, Key, TrendingUp, Building } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EmployerDashboard() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('employerToken');
        const res = await api.get('/employer/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.employer);
      } catch (error) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('employerToken');
        navigate('/employer/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/employer/logout');
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('employerToken');
    toast.success('Logged out successfully');
    navigate('/employer/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center border border-indigo-500/50">
                <Building className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Employer Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-300 hidden sm:block">
                {profile?.companyName || 'Loading...'}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:block">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-extrabold text-white">Dashboard Overview</h1>
          <p className="mt-2 text-gray-400">Welcome back! Here's what's happening with your verifications today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Verifications" value="0" icon={<ShieldCheck className="w-6 h-6 text-green-400" />} change="+0% from last month" />
          <StatCard title="Certificates Verified" value="0" icon={<FileBadge className="w-6 h-6 text-blue-400" />} change="+0% from last month" />
          <StatCard 
            title="Candidate Verification" 
            value="Search" 
            icon={<Activity className="w-6 h-6 text-purple-400" />} 
            change="Find candidates" 
            onClick={() => navigate('/employer/candidates')} 
          />
          <StatCard title="Active API Keys" value="0" icon={<Key className="w-6 h-6 text-yellow-400" />} change="Manage keys in settings" />
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Recent Activity
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center relative z-10">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-700">
              <Activity className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-300">No activity yet</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm">
              Your recent certificate verifications and API usage will appear here once you start using the platform.
            </p>
          </div>
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-indigo-900/10 blur-3xl pointer-events-none"></div>
        </div>

      </main>
    </div>
  );
}

function StatCard({ title, value, icon, change, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg transition-all group ${onClick ? 'cursor-pointer hover:border-indigo-500 hover:bg-gray-800' : 'hover:border-gray-700'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gray-800 rounded-xl group-hover:bg-gray-700 transition-colors">
          {icon}
        </div>
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white tracking-tight mb-2">{value}</p>
      <p className="text-xs text-gray-500 font-medium">{change}</p>
    </div>
  );
}
