import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Terminal, Code, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EmployerApiDocs() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const curlCode = `curl -X GET "https://api.characteru.com/api/v1/employer/api/verify/CHR-2026-123456" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const jsCode = `fetch('https://api.characteru.com/api/v1/employer/api/verify/CHR-2026-123456', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(res => res.json())
.then(console.log);`;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/employer/dashboard')} className="p-2 hover:bg-gray-800 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-white">API Documentation</h1>
            <p className="text-gray-400 mt-1">Integrate CharacterU verifications directly into your HR platform.</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><ShieldCheck className="w-6 h-6 text-indigo-400"/> Authentication</h2>
            <p className="text-gray-400 mb-4">All API requests must be authenticated using a Bearer token in the Authorization header. You can generate API keys in the <span onClick={() => navigate('/employer/api-keys')} className="text-indigo-400 cursor-pointer hover:underline">API Keys</span> section.</p>
            <div className="bg-gray-950 border border-gray-800 p-4 rounded-xl font-mono text-sm">
              <span className="text-pink-400">Authorization</span>: <span className="text-green-400">Bearer</span> &lt;YOUR_API_KEY&gt;
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-yellow-400 bg-yellow-400/10 p-3 rounded-lg border border-yellow-400/20">
              <span className="font-bold">Rate Limit:</span> 1,000 requests per key per day. Exceeding this returns 429 Too Many Requests.
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><Code className="w-6 h-6 text-indigo-400"/> Endpoints</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
                <div className="bg-gray-800/50 p-4 border-b border-gray-800 flex items-center gap-3">
                  <span className="bg-green-500 text-white font-bold px-2 py-1 rounded text-xs">GET</span>
                  <code className="text-indigo-300 font-bold">/api/v1/employer/api/verify/:certificateId</code>
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-sm text-gray-400">Verify a certificate and fetch its blockchain status.</p>
                  
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Example Response</h4>
                    <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-xs font-mono text-gray-300 border border-gray-800">
{`{
  "status": "success",
  "data": {
    "certificateId": "CHR-2026-123456",
    "candidateName": "John Doe",
    "courseName": "Character Building Requirements",
    "issueDate": "2026-08-01T12:00:00.000Z",
    "completionScore": 950,
    "transactionHash": "0xabc123...",
    "blockchainVerified": true,
    "certificateStatus": "Issued"
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><Terminal className="w-6 h-6 text-indigo-400"/> Code Examples</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
                <div className="bg-gray-800/50 p-3 border-b border-gray-800 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-300">cURL</span>
                  <button onClick={() => copyCode(curlCode)} className="text-gray-400 hover:text-white"><Copy className="w-4 h-4"/></button>
                </div>
                <pre className="p-4 text-xs font-mono text-gray-300 overflow-x-auto">{curlCode}</pre>
              </div>

              <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
                <div className="bg-gray-800/50 p-3 border-b border-gray-800 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-300">JavaScript (Fetch)</span>
                  <button onClick={() => copyCode(jsCode)} className="text-gray-400 hover:text-white"><Copy className="w-4 h-4"/></button>
                </div>
                <pre className="p-4 text-xs font-mono text-gray-300 overflow-x-auto">{jsCode}</pre>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

// Just importing icons needed that weren't imported above.
import { ShieldCheck } from 'lucide-react';
