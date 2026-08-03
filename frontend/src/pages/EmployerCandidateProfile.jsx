import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/axiosInstance';
import { ArrowLeft, ShieldCheck, QrCode, Download, ExternalLink, Award, FileBadge, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function EmployerCandidateProfile() {
  const { certificateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const token = localStorage.getItem('employerToken');
        const res = await api.get(`/employer/candidate/${certificateId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCandidate(res.certificate);
      } catch (error) {
        toast.error('Failed to load candidate profile');
        navigate('/employer/candidates');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [certificateId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!candidate) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/employer/candidates')} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Candidate Profile</h1>
            <p className="text-gray-400 mt-1">Verified records for {candidate.user?.fullName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Identity */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl flex flex-col items-center text-center space-y-4">
            <div className="relative">
              {candidate.user?.avatar ? (
                <img src={candidate.user.avatar} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-gray-800 shadow-lg" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center text-4xl font-bold text-gray-400 border-4 border-gray-700 shadow-lg">
                  {candidate.user?.fullName?.charAt(0) || '?'}
                </div>
              )}
              {candidate.transactionHash && (
                <div className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full border-4 border-gray-900" title="Blockchain Verified">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{candidate.user?.fullName}</h2>
              <p className="text-gray-400">{candidate.user?.email}</p>
            </div>
            
            <div className="w-full pt-6 border-t border-gray-800 grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Character Score</div>
                <div className="text-2xl font-bold text-indigo-400">{candidate.user?.characterScore || candidate.characterScore}</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Completion</div>
                <div className="text-2xl font-bold text-green-400">100%</div>
              </div>
            </div>
          </div>

          {/* Right Column: Certificate Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileBadge className="w-6 h-6 text-indigo-400" />
                  Certificate Details
                </h3>
                {candidate.status === 'Issued' ? (
                  <span className="flex items-center gap-1 text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full text-sm font-medium border border-green-400/20">
                    <CheckCircle className="w-4 h-4" /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400 bg-red-400/10 px-3 py-1.5 rounded-full text-sm font-medium border border-red-400/20">
                    <XCircle className="w-4 h-4" /> Revoked
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Certificate ID</div>
                  <div className="font-mono text-white bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">{candidate.certificateId}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Issue Date</div>
                  <div className="text-white bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">{new Date(candidate.issuedDate).toLocaleDateString()}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-500 mb-1">Course Completed</div>
                  <div className="text-white bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-400" /> Character Building Requirements
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-500 mb-1">Blockchain Verification</div>
                  <div className="text-white bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-400" /> 
                      <span className="truncate max-w-[200px] sm:max-w-xs">{candidate.transactionHash || 'Not available'}</span>
                    </div>
                    {candidate.transactionHash && (
                      <a href={`https://amoy.polygonscan.com/tx/${candidate.transactionHash}`} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm">
                        Verify <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={candidate.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg transition-colors border border-indigo-500"
              >
                <Download className="w-5 h-5" /> Download Certificate PDF
              </a>
              <button
                onClick={() => window.open(`/verify/${candidate.certificateId}`, '_blank')}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl shadow-lg transition-colors border border-gray-700"
              >
                <QrCode className="w-5 h-5 text-gray-400" /> View Verification Page
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
