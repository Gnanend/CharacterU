import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

/**
 * Enterprise i18n Configuration
 * Uses dynamic imports to lazy load language JSON files only when needed,
 * avoiding a massive initial bundle size.
 */
i18n
  // Lazy load translations
  .use(resourcesToBackend((language, namespace) => import(`./translations/${language}/${namespace}.json`)))
  // Detect user language from browser/localStorage
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: [
      'en', 'hi', 'te', 'ta', 'kn', 'ml'
    ],
    ns: [
      'common', 'auth', 'dashboard', 'profile', 'leaderboard', 
      'pledge', 'checkin', 'certificates', 'forms', 'validation', 
      'learning', 'admin', 'errors', 'success'
    ],
    defaultNS: 'common',
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },

    interpolation: {
      escapeValue: false, // React already safe from XSS
    },

    react: {
      useSuspense: true, // Enables React Suspense for seamless loading states
    }
  });

export default i18n;
