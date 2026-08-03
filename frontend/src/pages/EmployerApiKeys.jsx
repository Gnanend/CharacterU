import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axiosInstance';
import { ArrowLeft, Key, Plus, Trash2, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function EmployerApiKeys() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState(null);
  const [keyName, setKeyName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('employerToken');

  const fetchKeys = async () => {
    try {
      const res = await api.get('/employer/profile', { headers: { Authorization: `Bearer ${token}` } });
      setProfile(res.employer);
    } catch (err) {
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!keyName.trim()) return toast.error('Key name is required');
    setIsGenerating(true);
    try {
      const res = await api.post('/employer/api-keys', { name: keyName }, { headers: { Authorization: `Bearer ${token}` } });
      setNewKey(res.apiKey);
      setKeyName('');
      toast.success('API Key generated successfully');
      fetchKeys();
    } catch (err) {
      toast.error('Failed to generate API Key');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevoke = async (keyId) => {
    if (!window.confirm('Are you sure you want to revoke this key?')) return;
    try {
      await api.delete(`/employer/api-keys/${keyId}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('API Key revoked');
      fetchKeys();
    } catch (err) {
      toast.error('Failed to revoke key');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newKey);
    toast.success('Copied to clipboard');
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex justify-center items-center"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/employer/dashboard')} className="p-2 hover:bg-gray-800 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-white">API Keys</h1>
            <p className="text-gray-400 mt-1">Manage API keys for server-to-server integration.</p>
          </div>
        </div>

        {newKey && (
          <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-green-400 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Save your new API key
              </h3>
              <p className="text-sm text-green-400/80 mt-1">This key will only be shown once. Please copy it immediately.</p>
              <code className="block mt-4 p-3 bg-gray-900 rounded-lg text-green-300 font-mono break-all border border-green-500/20">
                {newKey}
              </code>
            </div>
            <button onClick={copyToClipboard} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg">
              <Copy className="w-4 h-4" /> Copy
            </button>
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-indigo-400"/> Generate New Key</h2>
          <form onSubmit={handleGenerate} className="flex gap-4">
            <input 
              type="text" 
              placeholder="e.g., HR System Prod" 
              value={keyName} 
              onChange={e => setKeyName(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button disabled={isGenerating} type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors shadow-lg disabled:opacity-50">
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </form>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 md:px-8 py-6 border-b border-gray-800">
            <h2 className="text-xl font-bold flex items-center gap-2"><Key className="w-5 h-5 text-indigo-400"/> Active Keys</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-gray-800/50 text-xs uppercase font-semibold text-gray-300">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {profile?.apiKeys?.length > 0 ? profile.apiKeys.map(key => (
                  <tr key={key._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{key.name}</td>
                    <td className="px-6 py-4">{new Date(key.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleRevoke(key._id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-colors inline-flex items-center gap-1">
                        <Trash2 className="w-4 h-4"/> Revoke
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                      No active API keys.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
