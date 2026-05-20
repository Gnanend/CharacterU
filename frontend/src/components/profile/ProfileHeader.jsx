import React from 'react';
import { Mail, Shield } from 'lucide-react';

/**
 * ProfileHeader Component
 * Displays the user's avatar, name, email, and role badge.
 */
const ProfileHeader = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-dark-900 to-dark-950 border border-dark-800 rounded-2xl p-6 md:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 shadow-sm relative overflow-hidden">
      
      {/* Decorative background blur */}
      <div className="absolute -left-10 -top-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl"></div>

      {/* Avatar Display */}
      <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary-600 to-dark-800 flex items-center justify-center text-5xl font-black text-white shadow-xl border-4 border-dark-950 shrink-0">
        {user?.fullName?.charAt(0) || 'U'}
        {/* Status Indicator */}
        <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-dark-950"></div>
      </div>
      
      {/* Profile Info */}
      <div className="relative z-10 flex-1 text-center sm:text-left space-y-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-1">{user?.fullName || 'User'}</h2>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-400">
            <Mail className="w-4 h-4" />
            <span className="text-sm font-medium">{user?.email || 'email@example.com'}</span>
          </div>
        </div>
        
        {/* Role Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-900/30 border border-primary-500/30 text-primary-400 rounded-full text-xs font-bold uppercase tracking-widest shadow-inner">
          <Shield className="w-4 h-4" />
          {user?.role || 'Student'}
        </div>
      </div>
      
    </div>
  );
};

export default ProfileHeader;
