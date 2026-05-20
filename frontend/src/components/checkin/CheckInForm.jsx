import React, { useState, useMemo } from 'react';
import { 
  HeartHandshake, ShieldAlert, Dumbbell, Brain, 
  Home, TreePine, MessageSquareOff, Coins, 
  Users, Scale, ThumbsUp, Recycle, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';
import ActivityCard from './ActivityCard';
import checkInService from '../../services/checkInService';

// Pre-defined list of character activities matching backend schema fields
const activitiesList = [
  { id: 'helpedSomeone', title: 'Helped Someone', icon: HeartHandshake },
  { id: 'avoidedConflict', title: 'Avoided Conflict', icon: ShieldAlert },
  { id: 'exercised', title: 'Exercised', icon: Dumbbell },
  { id: 'learnedSomething', title: 'Learned Something', icon: Brain },
  { id: 'caredForFamily', title: 'Cared For Family', icon: Home },
  { id: 'plantedTree', title: 'Planted Tree', icon: TreePine },
  { id: 'avoidedHate', title: 'Avoided Hate', icon: MessageSquareOff },
  { id: 'donated', title: 'Donated', icon: Coins },
  { id: 'volunteered', title: 'Volunteered', icon: Users },
  { id: 'practicedHonesty', title: 'Practiced Honesty', icon: Scale },
  { id: 'respectedOthers', title: 'Respected Others', icon: ThumbsUp },
  { id: 'avoidedWaste', title: 'Avoided Waste', icon: Recycle },
];

/**
 * CheckInForm Component handles the state management of the interactive 
 * gamified daily check-in board, calculates the live score, and submits to the backend.
 */
const CheckInForm = () => {
  // Map all activities natively to false
  const [activities, setActivities] = useState({
    helpedSomeone: false,
    avoidedConflict: false,
    exercised: false,
    learnedSomething: false,
    caredForFamily: false,
    plantedTree: false,
    avoidedHate: false,
    donated: false,
    volunteered: false,
    practicedHonesty: false,
    respectedOthers: false,
    avoidedWaste: false,
  });
  
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate live score reactively based on true values in the activities object
  const currentScore = useMemo(() => {
    return Object.values(activities).filter(Boolean).length;
  }, [activities]);

  const toggleActivity = (id) => {
    setActivities(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setStatus('submitting');
    
    try {
      await checkInService.submitCheckIn({
        activities,
        notes
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      // Surface backend duplication errors cleanly (e.g. "You have already submitted your daily check-in for today.")
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to submit check-in');
    }
  };

  // Success Confirmation State
  if (status === 'success') {
    return (
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-8 md:p-12 text-center space-y-4 shadow-xl max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Check-In Complete!</h2>
        <p className="text-slate-400 max-w-md mx-auto text-lg leading-relaxed">
          Excellent work today. You earned <span className="text-emerald-400 font-bold">{currentScore}</span> points for your character profile. Come back tomorrow!
        </p>
      </div>
    );
  }

  // Main UI
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header and Live Score Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-dark-900 to-dark-950 p-6 rounded-2xl border border-dark-800 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Daily Reflection</h2>
          <p className="text-slate-400 text-sm mt-1">Select the positive actions you completed today.</p>
        </div>
        
        {/* Real-time score counter */}
        <div className="bg-dark-950 px-6 py-3 rounded-xl border border-dark-700 flex items-center gap-4 shadow-inner">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Today's Score</span>
          <span className="text-4xl font-black text-emerald-400 leading-none">{currentScore}</span>
        </div>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-xl flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-200">{errorMessage}</p>
        </div>
      )}

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Gamified Grid of Activity Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {activitiesList.map((activity) => (
            <ActivityCard
              key={activity.id}
              title={activity.title}
              icon={activity.icon}
              isSelected={activities[activity.id]}
              onClick={() => toggleActivity(activity.id)}
            />
          ))}
        </div>

        {/* Optional Notes Section */}
        <div className="space-y-3 bg-dark-900 p-6 md:p-8 rounded-2xl border border-dark-800 shadow-sm">
          <label className="text-sm font-bold text-slate-300">Journal Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            maxLength={1000}
            className="w-full px-4 py-3 bg-dark-950 border border-dark-800 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all resize-none shadow-inner"
            placeholder="Reflect on your day, challenges, or moments of gratitude..."
            disabled={status === 'submitting'}
          />
          <p className="text-xs text-slate-500 text-right">{notes.length}/1000</p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full md:w-auto px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving Check-In...</span>
              </>
            ) : (
              <span>Submit Daily Check-In</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckInForm;
