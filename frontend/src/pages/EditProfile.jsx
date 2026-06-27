import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import profileService from '../services/profileService';
import ProfileForm from '../components/profile/ProfileForm';
import { showToast } from '../components/ui/Toast';
import { ShieldCheck, Star } from 'lucide-react';

const EditProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        if (data.success && data.user) {
          setProfileData(data.user);
        }
      } catch (err) {
        console.error('Error fetching profile in EditProfile:', err);
        showToast.error('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileSuccess = (updatedUser) => {
    setProfileData(updatedUser);
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto animate-pulse flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 h-80 bg-dark-900 rounded-2xl border border-dark-800"></div>
        <div className="w-full md:w-2/3 h-96 bg-dark-900 rounded-2xl border border-dark-800"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-2">Error Loading Profile</h2>
        <p className="text-slate-400">Please try refreshing the page.</p>
      </div>
    );
  }

  // Determine avatar text (first letter of full name)
  const avatarText = profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : 'U';
  
  // Format member since date
  const memberSince = new Date(profileData.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="w-full max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-white mb-8">Edit Profile</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="w-full md:w-1/3">
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-primary-900/40 to-dark-900"></div>
            
            {/* Avatar Placeholder */}
            <div className="relative z-10 w-28 h-28 mt-4 mb-4 rounded-full bg-gradient-to-br from-primary-800 to-dark-800 border-4 border-dark-900 flex items-center justify-center text-4xl text-primary-400 font-bold uppercase shadow-2xl">
              {profileData.avatar ? (
                 <img src={profileData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                 avatarText
              )}
            </div>
            
            <h2 className="text-xl font-bold text-white mb-1 z-10">{profileData.fullName}</h2>
            <p className="text-primary-400 font-medium capitalize text-sm mb-4 z-10 flex items-center gap-1 justify-center">
              <ShieldCheck className="w-4 h-4" />
              {profileData.role || 'Student'}
            </p>
            
            <div className="w-full flex justify-between items-center py-4 border-t border-dark-800 mt-2 z-10">
              <div className="text-left">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Member Since</p>
                <p className="text-sm text-slate-300 font-medium">{memberSince}</p>
              </div>
              
              <div className="text-right flex flex-col items-end">
                 <p className="text-xs text-slate-500 uppercase tracking-wider">Char Score</p>
                 <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-md text-yellow-400 mt-1">
                   <Star className="w-3 h-3 fill-yellow-400" />
                   <span className="text-sm font-bold">{profileData.characterScore || 0}</span>
                 </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="w-full md:w-2/3">
          <ProfileForm profileData={profileData} onSuccess={handleProfileSuccess} />
        </div>
        
      </div>
    </div>
  );
};

export default EditProfile;
