
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import profileService from '../../services/profileService';
import { showToast } from '../ui/Toast';

const LANGUAGES = [
  { code: 'en', native: 'English' },
  { code: 'hi', native: 'हिन्दी' },
  { code: 'te', native: 'తెలుగు' },
  { code: 'ta', native: 'தமிழ்' },
  { code: 'kn', native: 'ಕನ್ನಡ' },
  { code: 'ml', native: 'മലയാളം' }
];

const LanguageSwitcher = () => {
  const { t } = useTranslation('common');

  const { i18n } = useTranslation();
  const { user, updateUser, isAuthenticated } = useAuth();

  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    
    // Optimistically update the UI Language
    i18n.changeLanguage(newLang);

    // If logged in, persist to backend
    if (isAuthenticated && user) {
      try {
        const response = await profileService.updateProfile({ language: newLang });
        if (response.success && response.user) {
          updateUser(response.user);
          // showToast.success(t('languageUpdatedSuc', 'Language updated successfully'));
        }
      } catch (error) {
        console.error('Failed to sync language to backend:', error);
        showToast.error(t('failedToSaveLangu', 'Failed to save language preference.'));
      }
    }
  };

  return (
    <div className="relative flex items-center">
      <Globe className="absolute left-2 w-4 h-4 text-slate-400 pointer-events-none" />
      <select
        value={i18n.language || 'en'}
        onChange={handleLanguageChange}
        className="appearance-none bg-dark-900 border border-dark-700 text-slate-300 text-sm font-medium rounded-lg pl-8 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-dark-600 transition-colors cursor-pointer w-full max-w-[140px]"
        aria-label="Select Language"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.native}
          </option>
        ))}
      </select>
      <div className="absolute right-2 pointer-events-none text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
