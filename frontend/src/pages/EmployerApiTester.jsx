import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Terminal, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EmployerApiTester() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [certId, setCertId] = useState('');
  const [endpoint, setEndpoint] = useState('/api/v1/employer/api/verify/');
  
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [time, setTime] = useState(null);

  const handleTest = async (e) => {
    e.preventDefault();
    if (!apiKey || !certId) return toast.error('API Key and Certificate ID are required');

    setLoading(true);
    setResponse(null);
    setStatus(null);
    
    const startTime = Date.now();
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      // endpoint string already has /api/v1/ in it, so adjust path
      const fullUrl = `${baseUrl.replace('/api/v1', '')}${endpoint}${certId}`;
      
      const res = await fetch(fullUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      const data = await res.json();
      
      setStatus(res.status);
      setResponse(data);
    } catch (err) {
      setStatus(500);
      setResponse({ error: 'Failed to connect to API' });
    } finally {
      setTime(Date.now() - startTime);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/employer/dashboard')} className="p-2 hover:bg-gray-800 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-white">API Tester</h1>
            <p className="text-gray-400 mt-1">Test your API integrations live before deploying.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Request Panel */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><Terminal className="w-5 h-5 text-indigo-400"/> Configure Request</h2>
            
            <form onSubmit={handleTest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">API Endpoint</label>
                <select value={endpoint} onChange={e => setEndpoint(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                  <option value="/api/v1/employer/api/verify/">GET /verify/:certificateId</option>
                  <option value="/api/v1/employer/api/candidate/">GET /candidate/:certificateId</option>
                  <option value="/api/v1/employer/api/certificate/">GET /certificate/:certificateId</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">API Key (Bearer Token)</label>
                <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Paste your raw API key here" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Certificate ID</label>
                <input type="text" value={certId} onChange={e => setCertId(e.target.value)} placeholder="e.g., CHR-2026-123456" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm" required />
              </div>

              <div className="pt-4">
                <button disabled={loading} type="submit" className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  <Play className="w-5 h-5" /> {loading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>

          {/* Response Panel */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><Code className="w-5 h-5 text-indigo-400"/> Response</h2>
            
            {!response && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <Terminal className="w-12 h-12 mb-2 text-gray-800" />
                <p>Send a request to see the response here.</p>
              </div>
            )}
            
            {loading && (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            )}

            {response && !loading && (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-4 border-b border-gray-800 pb-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${status >= 200 && status < 300 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    Status: {status}
                  </div>
                  <div className="text-sm text-gray-400">
                    Time: <span className="font-mono text-indigo-300">{time}ms</span>
                  </div>
                </div>
                <div className="flex-1 bg-gray-950 border border-gray-800 rounded-xl overflow-hidden relative">
                  <pre className="p-4 text-xs font-mono text-gray-300 overflow-auto absolute inset-0">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Code } from 'lucide-react';
