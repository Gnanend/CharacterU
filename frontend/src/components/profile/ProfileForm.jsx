import React, { useState } from 'react';
import { showToast } from '../ui/Toast';
import profileService from '../../services/profileService';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

const ProfileForm = ({ profileData, onSuccess }) => {
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: profileData.fullName || '',
    city: profileData.city || '',
    country: profileData.country || '',
    language: profileData.language || 'en',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full Name must be at least 2 characters.';
    } else if (formData.fullName.trim().length > 100) {
      newErrors.fullName = 'Full Name cannot exceed 100 characters.';
    }
    if (formData.city && formData.city.trim().length > 100) {
      newErrors.city = 'City cannot exceed 100 characters.';
    }
    if (formData.country && formData.country.trim().length > 100) {
      newErrors.country = 'Country cannot exceed 100 characters.';
    }
    if (!formData.language || formData.language.trim() === '') {
      newErrors.language = 'Language is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast.error('Please fix the errors in the form.');
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
      showToast.success('Profile updated successfully!');
      
      // Update the auth context so navbar/sidebar reflects changes instantly
      if (updateUser && res.user) {
        updateUser(res.user);
      }
      
      if (onSuccess) {
        onSuccess(res.user);
      }
    } catch (err) {
      showToast.error(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 md:p-8 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          
          {/* Email (Read Only) */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
            <input 
              type="email"
              value={profileData.email}
              disabled
              className="w-full bg-dark-950 border border-dark-800 text-slate-500 rounded-xl px-4 py-3 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-1">Email cannot be changed.</p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name *</label>
            <input 
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full bg-dark-950 border ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-dark-700 focus:ring-primary-500'} text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
              placeholder="e.g. John Doe"
            />
            {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">City</label>
              <input 
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full bg-dark-950 border ${errors.city ? 'border-red-500 focus:ring-red-500' : 'border-dark-700 focus:ring-primary-500'} text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                placeholder="e.g. New York"
              />
              {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Country</label>
              <input 
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full bg-dark-950 border ${errors.country ? 'border-red-500 focus:ring-red-500' : 'border-dark-700 focus:ring-primary-500'} text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                placeholder="e.g. United States"
              />
              {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Preferred Language *</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className={`w-full bg-dark-950 border ${errors.language ? 'border-red-500 focus:ring-red-500' : 'border-dark-700 focus:ring-primary-500'} text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all appearance-none`}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
              <option value="ta">Tamil</option>
              <option value="kn">Kannada</option>
              <option value="ml">Malayalam</option>
            </select>
            {errors.language && <p className="text-sm text-red-500 mt-1">{errors.language}</p>}
          </div>

        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 px-8 rounded-xl transition-colors duration-200 shadow-lg shadow-primary-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
