import { useState, useEffect } from 'react';
import certificateService from '../services/certificateService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldCheck, ShieldAlert, FileText, Search } from 'lucide-react';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await certificateService.getAdminAnalytics();
        setData(res.data);
      } catch (err) {
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-400 animate-pulse">Loading Analytics...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Employer Verification Analytics</h1>
        <p className="text-slate-400 mt-2">Monitor how employers interact with CharacterU certificates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Certificates" value={data.totalCertificates} icon={FileText} color="text-primary-500" />
        <StatCard title="Total Verification Requests" value={data.totalRequests} icon={Search} color="text-blue-500" />
        <StatCard title="Successful Verifications" value={data.totalRequests - data.failedRequests} icon={ShieldCheck} color="text-green-500" />
        <StatCard title="Failed Attempts" value={data.failedRequests} icon={ShieldAlert} color="text-red-500" />
      </div>

      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-white mb-6">Daily Verification Activity (Last 30 Days)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.dailyData}>
              <XAxis dataKey="_id" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px'}} />
              <Bar dataKey="successCount" name="Success" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
              <Bar dataKey="failCount" name="Failed" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-dark-900 p-6 rounded-2xl border border-dark-800 shadow-sm flex items-center justify-between">
    <div className="space-y-2">
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
    <div className={`p-4 rounded-xl bg-dark-800/50 ${color}`}>
      <Icon className="w-8 h-8" />
    </div>
  </div>
);
