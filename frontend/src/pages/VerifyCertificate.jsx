import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import certificateService from '../services/certificateService';
import { CheckCircle, XCircle, ExternalLink, Loader2 } from 'lucide-react';
import Container from '../components/Container';

export default function VerifyCertificate() {
  const { certificateId } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await certificateService.verify(certificateId);
        setCert(res.data);
      } catch (err) {
        setError("Certificate Invalid or Not Found");
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [certificateId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-dark-950"><Loader2 className="animate-spin w-12 h-12 text-primary-500"/></div>;

  return (
    <div className="min-h-screen bg-dark-950 py-20">
      <Container>
        <div className="max-w-3xl mx-auto bg-dark-900 border border-dark-800 rounded-2xl p-8 shadow-2xl">
          {error ? (
            <div className="text-center space-y-4">
              <XCircle className="w-20 h-20 text-red-500 mx-auto" />
              <h1 className="text-3xl font-bold text-white">Certificate Invalid</h1>
              <p className="text-slate-400">We could not find a valid certificate matching this token.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
                <h1 className="text-3xl font-bold text-white">{cert.isValid ? 'Certificate Valid' : 'Certificate Invalid'}</h1>
                <p className={`font-medium tracking-widest uppercase ${cert.isValid ? 'text-green-400' : 'text-red-400'}`}>
                  {cert.blockchainStatus}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-dark-950 p-6 rounded-xl border border-dark-800">
                <Detail label="User Name" value={cert.fullName} />
                <Detail label="Character Score" value={cert.characterScore} />
                <Detail label="Certificate ID" value={cert.certificateId} />
                <Detail label="Issue Date" value={new Date(cert.issueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} />
                <Detail label="Contract Address" value={cert.contractAddress} />
                <div className="col-span-1 md:col-span-2">
                  <Detail label="Transaction Hash" value={cert.transactionHash} />
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                {cert.pdfUrl && (
                  <a href={cert.pdfUrl} download target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold transition-colors">
                    <ExternalLink className="w-5 h-5"/> Download PDF
                  </a>
                )}
                {cert.transactionHash && (
                  <a href={`https://amoy.polygonscan.com/tx/${cert.transactionHash}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#8247E5] hover:bg-[#7237d5] text-white px-6 py-3 rounded-xl font-bold transition-colors">
                    <ExternalLink className="w-5 h-5"/> View on Polygon Explorer
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm text-slate-500 uppercase">{label}</p>
    <p className="text-lg text-white font-medium break-all">{value}</p>
  </div>
);
