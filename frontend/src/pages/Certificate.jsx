import { useState, useEffect } from 'react';
import certificateService from '../services/certificateService';
import { showToast } from '../components/ui/Toast';
import { CheckCircle, XCircle, Download, Copy, ExternalLink, Loader2 } from 'lucide-react';

export default function CertificatePage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await certificateService.getStatus();
        setStatus(res);
      } catch (err) {
        showToast.error("Failed to load certificate status");
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await certificateService.generate();
      showToast.success("Certificate generated and stored on blockchain!");
      setStatus(prev => ({ ...prev, hasGenerated: true, certificate: res.certificate }));
    } catch (err) {
      showToast.error(err.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast.success("Copied to clipboard!");
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin w-10 h-10 text-primary-500"/></div>;
  if (!status) return null;

  const reqs = status.requirements;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Character Certificate</h1>

      {status.hasGenerated ? (
        <div className="bg-dark-900 border border-green-500 rounded-xl p-8 text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Certificate Generated!</h2>
          
          <div className="flex justify-center items-center space-x-4">
            <a href={status.certificate.pdfUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg">
              <Download className="w-4 h-4"/> Download PDF
            </a>
            <button onClick={() => copyToClipboard(status.certificate.certificateId)} className="flex items-center gap-2 bg-dark-800 text-white px-4 py-2 rounded-lg">
              <Copy className="w-4 h-4"/> Copy ID
            </button>
            <button onClick={() => copyToClipboard(status.certificate.transactionHash)} className="flex items-center gap-2 bg-dark-800 text-white px-4 py-2 rounded-lg">
              <Copy className="w-4 h-4"/> Copy TX Hash
            </button>
            <a href={`https://amoy.polygonscan.com/tx/${status.certificate.transactionHash}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#8247E5] text-white px-4 py-2 rounded-lg">
              <ExternalLink className="w-4 h-4"/> Polygon Explorer
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-dark-900 border border-dark-800 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">Eligibility Checklist</h2>
          <div className="space-y-4 mb-8">
            <RequirementRow label="Character Score >= 80" req={reqs.scoreRequirement} />
            <RequirementRow label="Minimum 7 Check-ins" req={reqs.checkInRequirement} />
            <RequirementRow label="Minimum 1 Pledge" req={reqs.pledgeRequirement} />
            <RequirementRow label="Profile >= 80% Complete" req={reqs.profileRequirement} />
          </div>

          {status.isEligible ? (
            <button 
              onClick={handleGenerate} 
              disabled={generating}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl flex justify-center items-center gap-2"
            >
              {generating ? <Loader2 className="animate-spin w-5 h-5"/> : <CheckCircle className="w-5 h-5"/>}
              {generating ? 'Minting on Blockchain...' : 'Generate Certificate'}
            </button>
          ) : (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-center font-medium">
              You must complete all requirements above before generating your certificate.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const RequirementRow = ({ label, req }) => (
  <div className="flex justify-between items-center p-4 bg-dark-950 rounded-lg">
    <span className="text-slate-300 font-medium">{label}</span>
    <div className="flex items-center gap-4">
      <span className="text-slate-500 text-sm">{req.current} / {req.required}</span>
      {req.met ? <CheckCircle className="w-5 h-5 text-green-500"/> : <XCircle className="w-5 h-5 text-red-500"/>}
    </div>
  </div>
);
