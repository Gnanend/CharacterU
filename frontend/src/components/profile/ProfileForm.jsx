import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { showToast } from '../ui/Toast';
import profileService from '../../services/profileService';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';
const ProfileForm = ({
  profileData,
  onSuccess
}) => {
  const {
    t
  } = useTranslation('common');
  const {
    updateUser
  } = useAuth();
  const [formData, setFormData] = useState({
    fullName: profileData.fullName || '',
    city: profileData.city || '',
    country: profileData.country || '',
    language: profileData.language || 'en'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const validate = () => {
    const newErrors = {};
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = t('fullNameMinLength', 'Full Name must be at least 2 characters.');
    } else if (formData.fullName.trim().length > 100) {
      newErrors.fullName = t('fullNameMaxLength', 'Full Name cannot exceed 100 characters.');
    }
    if (formData.city && formData.city.trim().length > 100) {
      newErrors.city = t('cityMaxLength', 'City cannot exceed 100 characters.');
    }
    if (formData.country && formData.country.trim().length > 100) {
      newErrors.country = t('countryMaxLength', 'Country cannot exceed 100 characters.');
    }
    if (!formData.language || formData.language.trim() === '') {
      newErrors.language = t('languageRequired', 'Language is required.');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) {
      showToast.error(t('pleaseFixTheError', 'Please fix the errors in the form.'));
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        city: formData.city.trim(),
        country: formData.country.trim(),
        language: formData.language.trim()
      };
      const res = await profileService.updateProfile(payload);
      showToast.success(t('profileUpdatedSucc', 'Profile updated successfully!'));

      // Update the auth context so navbar/sidebar reflects changes instantly
      if (updateUser && res.user) {
        updateUser(res.user);
      }
      if (onSuccess) {
        onSuccess(res.user);
      }
    } catch (err) {
      showToast.error(err.response?.data?.message || err.message || t('failedToUpdateProfile', 'Failed to update profile'));
    } finally {
      setIsSaving(false);
    }
  };
  return <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 md:p-8 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6">{t('profileInformation', 'Profile Information')}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          
          {/* Email (Read Only) */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">{t('emailAddress', 'Email Address')}</label>
            <input type="email" value={profileData.email} disabled className="w-full bg-dark-950 border border-dark-800 text-slate-500 rounded-xl px-4 py-3 cursor-not-allowed" />
            <p className="text-xs text-slate-500 mt-1">{t('emailCannotBeChan', 'Email cannot be changed.')}</p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t('fullNameStar', 'Full Name *')}</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full bg-dark-950 border ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-dark-700 focus:ring-primary-500'} text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all`} placeholder={t("eGJohnDoe", "e.g. John Doe")} />
            {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('city', 'City')}</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className={`w-full bg-dark-950 border ${errors.city ? 'border-red-500 focus:ring-red-500' : 'border-dark-700 focus:ring-primary-500'} text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all`} placeholder={t("eGNewYork", "e.g. New York")} />
              {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('country', 'Country')}</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} className={`w-full bg-dark-950 border ${errors.country ? 'border-red-500 focus:ring-red-500' : 'border-dark-700 focus:ring-primary-500'} text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all`} placeholder={t("eGUnitedStates", "e.g. United States")} />
              {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t('preferredLanguageStar', 'Preferred Language *')}</label>
            <select name="language" value={formData.language} onChange={handleChange} className={`w-full bg-dark-950 border ${errors.language ? 'border-red-500 focus:ring-red-500' : 'border-dark-700 focus:ring-primary-500'} text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all appearance-none`}>
              <option value="en">{t('english', 'English')}</option>
              <option value="hi">{t('hindi', 'Hindi')}</option>
              <option value="te">{t('telugu', 'Telugu')}</option>
              <option value="ta">{t('tamil', 'Tamil')}</option>
              <option value="kn">{t('kannada', 'Kannada')}</option>
              <option value="ml">{t('malayalam', 'Malayalam')}</option>
            </select>
            {errors.language && <p className="text-sm text-red-500 mt-1">{errors.language}</p>}
          </div>

        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={isSaving} className="bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 px-8 rounded-xl transition-colors duration-200 shadow-lg shadow-primary-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
            {isSaving ? <>
                <Loader2 className="w-5 h-5 animate-spin" />{t('saving', 'Saving...')}</> : t('saveChangesButton', 'Save Changes')}
          </button>
        </div>
      </form>
    </div>;
};
export default ProfileForm;