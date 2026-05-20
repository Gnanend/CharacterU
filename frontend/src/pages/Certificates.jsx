import React from 'react';
import { ShieldCheck } from 'lucide-react';
import CertificateCard from '../components/certificates/CertificateCard';

/**
 * Certificates Page Component
 * Renders the gamified certification tier system.
 */
const Certificates = () => {
  // Hardcoded mock progression data as per requirements.
  const mockCertificates = [
    {
      id: 'bronze',
      tier: 'Bronze',
      progress: 100,
      isUnlocked: true,
      isLocked: false,
      requirements: [
        { text: 'Register an account', completed: true },
        { text: 'Complete your profile setup', completed: true },
        { text: 'Submit your first video pledge', completed: true },
      ]
    },
    {
      id: 'silver',
      tier: 'Silver',
      progress: 40,
      isUnlocked: false,
      isLocked: false,
      requirements: [
        { text: 'Complete 10 daily check-ins', completed: true },
        { text: 'Maintain a 5-day streak', completed: false },
        { text: 'Earn 1,000 Character Score points', completed: false },
      ]
    },
    {
      id: 'gold',
      tier: 'Gold',
      progress: 0,
      isUnlocked: false,
      isLocked: true,
      requirements: [
        { text: 'Unlock Silver Certificate', completed: false },
        { text: 'Submit 3 verified video pledges', completed: false },
        { text: 'Teach 5 people', completed: false },
      ]
    },
    {
      id: 'platinum',
      tier: 'Platinum',
      progress: 0,
      isUnlocked: false,
      isLocked: true,
      requirements: [
        { text: 'Unlock Gold Certificate', completed: false },
        { text: 'Maintain a 30-day streak', completed: false },
        { text: 'Complete a major community project', completed: false },
      ]
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 pb-12 animate-in fade-in duration-500">
      
      {/* Page Header Area */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-900 to-dark-800 text-primary-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary-500/20 shadow-xl shadow-primary-900/10">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Certificates</h1>
        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
          Unlock prestigious certificates as you build your character. These verified credentials demonstrate your commitment to personal growth and community impact.
        </p>
      </div>

      {/* Grid rendering the certification tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {mockCertificates.map(cert => (
          <CertificateCard 
            key={cert.id}
            tier={cert.tier}
            progress={cert.progress}
            isUnlocked={cert.isUnlocked}
            isLocked={cert.isLocked}
            requirements={cert.requirements}
          />
        ))}
      </div>

    </div>
  );
};

export default Certificates;
