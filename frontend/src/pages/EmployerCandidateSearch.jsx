import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axiosInstance';
import { Search, ShieldCheck, XCircle, ArrowLeft, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EmployerCandidateSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('employerToken');
      const res = await api.get(`/employer/search?query=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(res.results || []);
      if (res.results?.length === 0) {
        toast.error('No candidates found matching your query.');
      }
    } catch (err) {
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/employer/dashboard')} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Candidate Search</h1>
            <p className="text-gray-400 mt-1">Search by Certificate ID, Name, or Email</p>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl flex gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. CHR-2026-123456 or john@example.com"
              className="block w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:opacity-50 transition-colors flex items-center"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Results Table */}
        {results.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-gray-800/50 text-xs uppercase font-semibold text-gray-300">
                  <tr>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Certificate ID</th>
                    <th className="px-6 py-4">Issue Date</th>
                    <th className="px-6 py-4">Blockchain</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {results.map((cert) => (
                    <tr key={cert._id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {cert.user?.avatar ? (
                            <img src={cert.user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-white text-xs">
                              {cert.user?.fullName?.charAt(0) || '?'}
                            </div>
                          )}
                          <div>
                            <div className="text-white font-medium">{cert.user?.fullName || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">{cert.user?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-indigo-400">{cert.certificateId}</td>
                      <td className="px-6 py-4">{new Date(cert.issuedDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        {cert.transactionHash ? (
                          <span className="flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-1 rounded-md w-fit text-xs font-medium border border-green-400/20">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-md w-fit text-xs font-medium border border-yellow-400/20">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {cert.status === 'Issued' ? (
                          <span className="text-gray-300 bg-gray-800 px-2 py-1 rounded-md text-xs font-medium border border-gray-700">Issued</span>
                        ) : (
                          <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded-md text-xs font-medium border border-red-400/20">Revoked</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/employer/candidates/${cert.certificateId}`)}
                          className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-600 rounded-lg transition-colors inline-flex items-center gap-2 text-xs font-medium border border-indigo-500/30 hover:border-indigo-500"
                        >
                          <Eye className="w-4 h-4" /> View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
