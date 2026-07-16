import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import profileService from '../services/profileService';
import ProfileForm from '../components/profile/ProfileForm';
import { showToast } from '../components/ui/Toast';
import { ShieldCheck, Star, Camera, Loader2 } from 'lucide-react';
const EditProfile = () => {
  const {
    user,
    updateUser,
    loading: authLoading
  } = useAuth();
  const {
    t, i18n
  } = useTranslation(['profile', 'common']);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  const handleProfileSuccess = updatedUser => {
    // updateUser in context handles the state, so we just call it
    updateUser(updatedUser);
  };
  const handleAvatarClick = () => {
    if (fileInputRef.current && !isUploadingAvatar) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast.error(t('errors.fileSize', 'File size must be under 5MB'));
      return;
    }
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await profileService.uploadAvatar(formData);
      showToast.success(t('success.avatarUpdated', 'Avatar updated successfully!'));
      if (updateUser && res.user) {
        updateUser(res.user);
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
      showToast.error(err.message || t('errors.avatarUploadFailed', 'Failed to upload avatar'));
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  if (authLoading) {
    return <div className="w-full max-w-5xl mx-auto animate-pulse flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 h-80 bg-dark-900 rounded-2xl border border-dark-800"></div>
        <div className="w-full md:w-2/3 h-96 bg-dark-900 rounded-2xl border border-dark-800"></div>
      </div>;
  }
  if (!user) {
    return <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-2">{t('errors.profileLoad', 'Error Loading Profile')}</h2>
        <p className="text-slate-400">{t('errors.refreshPage', 'Please try refreshing the page.')}</p>
      </div>;
  }
  const profileData = user;

  // Determine avatar text (first letter of full name)
  const avatarText = profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : 'U';

  // Format member since date
  const memberSince = new Date(profileData.createdAt).toLocaleDateString(i18n.language, {
    month: 'short',
    year: 'numeric'
  });
  return <div className="w-full max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-white mb-8">{t('editProfile', { ns: 'common', defaultValue: 'Edit Profile' })}</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="w-full md:w-1/3">
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-primary-900/40 to-dark-900"></div>
            
            {/* Avatar Placeholder / Image */}
            <div onClick={handleAvatarClick} className={`relative z-10 w-28 h-28 mt-4 mb-4 rounded-full bg-gradient-to-br from-primary-800 to-dark-800 border-4 border-dark-900 flex items-center justify-center text-4xl text-primary-400 font-bold uppercase shadow-2xl overflow-hidden group ${isUploadingAvatar ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}>
              {isUploadingAvatar ? <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div> : <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                  <Camera className="w-8 h-8 text-white" />
                </div>}

              {profileData.avatar ? <img src={profileData.avatar} alt={t("avatar", "Avatar")} className="w-full h-full rounded-full object-cover" /> : avatarText}
            </div>
            
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg, image/png, image/webp" className="hidden" />
            
            <h2 className="text-xl font-bold text-white mb-1 z-10">{profileData.fullName}</h2>
            <p className="text-primary-400 font-medium capitalize text-sm mb-4 z-10 flex items-center gap-1 justify-center">
              <ShieldCheck className="w-4 h-4" />
              {t(`common:${profileData.role || 'student'}`, profileData.role || 'Student')}
            </p>
            
            <div className="w-full flex justify-between items-center py-4 border-t border-dark-800 mt-2 z-10">
              <div className="text-left">
                <p className="text-xs text-slate-500 uppercase tracking-wider">{t('memberSince', { ns: 'common', defaultValue: 'MEMBER SINCE' })}</p>
                <p className="text-sm text-slate-300 font-medium">{memberSince}</p>
              </div>
              
              <div className="text-right flex flex-col items-end">
                 <p className="text-xs text-slate-500 uppercase tracking-wider">{t('charScore', { ns: 'common', defaultValue: 'CHAR SCORE' })}</p>
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
    </div>;
};
export default EditProfile;