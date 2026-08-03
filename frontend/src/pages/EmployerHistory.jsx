import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axiosInstance';
import { ArrowLeft, Activity, ShieldCheck, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function EmployerHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('employerToken');
        const res = await api.get('/employer/history', { headers: { Authorization: `Bearer ${token}` } });
        setHistory(res.data || []);
      } catch (err) {
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-950 flex justify-center items-center"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/employer/dashboard')} className="p-2 hover:bg-gray-800 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Verification History</h1>
            <p className="text-gray-400 mt-1">Audit log of all your candidate verification searches.</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-gray-800/50 text-xs uppercase font-semibold text-gray-300">
                <tr>
                  <th className="px-6 py-4">Verification Date</th>
                  <th className="px-6 py-4">Candidate Name</th>
                  <th className="px-6 py-4">Certificate ID</th>
                  <th className="px-6 py-4">Result</th>
                  <th className="px-6 py-4">Blockchain</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {history.length > 0 ? history.map(log => (
                  <tr key={log._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4">{log.candidateName}</td>
                    <td className="px-6 py-4 font-mono text-indigo-400">{log.certificate?.certificateId || 'N/A'}</td>
                    <td className="px-6 py-4">
                      {log.verificationResult === 'Valid' ? 
                        <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded-md text-xs border border-green-400/20"><ShieldCheck className="w-3 h-3 inline mr-1"/> Valid</span> : 
                        <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded-md text-xs border border-red-400/20"><XCircle className="w-3 h-3 inline mr-1"/> Invalid</span>
                      }
                    </td>
                    <td className="px-6 py-4">{log.blockchainVerified ? 'Verified' : '-'}</td>
                    <td className="px-6 py-4 text-right">
                      {log.certificate?.certificateId && (
                        <button onClick={() => navigate(`/employer/candidates/${log.certificate.certificateId}`)} className="text-indigo-400 hover:text-white text-xs underline">
                          View Profile
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 flex flex-col items-center">
                      <Activity className="w-12 h-12 mb-3 text-gray-700" />
                      No verification history found.
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
