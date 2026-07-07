
import toast from 'react-hot-toast';

/**
 * Custom Toast Wrapper
 * Provides styled wrapper functions for react-hot-toast to match
 * the premium SaaS aesthetic of the CharacterU platform.
 */
export const showToast = {
  success: (message) => toast.success(message, {
    style: {
      background: '#022c22', // emerald-950
      color: '#34d399', // emerald-400
      border: '1px solid #064e3b', // emerald-900
      borderRadius: '0.75rem', // xl
    },
    iconTheme: {
      primary: '#10b981', // emerald-500
      secondary: '#fff',
    },
  }),
  error: (message) => toast.error(message, {
    style: {
      background: '#450a0a', // red-950
      color: '#f87171', // red-400
      border: '1px solid #7f1d1d', // red-900
      borderRadius: '0.75rem',
    },
    iconTheme: {
      primary: '#ef4444', // red-500
      secondary: '#fff',
    },
  }),
  loading: (message) => toast.loading(message, {
    style: {
      background: '#0a0a0a', // dark-950
      color: '#94a3b8', // slate-400
      border: '1px solid #262626', // dark-800
      borderRadius: '0.75rem',
    }
  }),
  dismiss: toast.dismiss,
};

export default showToast;
