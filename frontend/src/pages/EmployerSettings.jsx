import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axiosInstance';
import { ArrowLeft, Save, Building } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function EmployerSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('employerToken');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/employer/profile', { headers: { Authorization: `Bearer ${token}` } });
        setProfile(res.employer);
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/employer/profile', profile, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Settings updated successfully');
    } catch (err) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex justify-center items-center"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans p-6 sm:p-10">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/employer/dashboard')} className="p-2 hover:bg-gray-800 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Settings</h1>
            <p className="text-gray-400 mt-1">Update your company profile information.</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Company Name</label>
                <input name="companyName" value={profile?.companyName || ''} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Company Email</label>
                <input value={profile?.companyEmail || ''} className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed" disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Website</label>
                <input name="website" value={profile?.website || ''} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                <input name="phone" value={profile?.phone || ''} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Industry</label>
                <input name="industry" value={profile?.industry || ''} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Company Size</label>
                <select name="companySize" value={profile?.companySize || ''} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                <input name="country" value={profile?.country || ''} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-800 flex justify-end">
              <button disabled={saving} type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium shadow-lg transition-colors flex items-center gap-2 disabled:opacity-50">
                <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
