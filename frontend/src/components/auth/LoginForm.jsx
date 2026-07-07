import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * LoginForm component handling user input, local validation, and API submission
 * using the global AuthContext.
 */
const LoginForm = () => {
  const {
    t
  } = useTranslation('common');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  // Extract login method and loading state from context
  const {
    login,
    loading
  } = useAuth();
  const navigate = useNavigate();

  // Validate form fields locally before making an API request
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^.+([.-]?.+)*@.+([.-]?.+)*(..{2,3})+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errors.email = 'Valid email is required';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear validation error state when user types to improve UX
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();

    // Stop submission if validation fails
    if (!validateForm()) return;
    try {
      // Call context login method which handles the API request and global state update
      await login(formData);
      // Redirect to the dashboard upon successful login
      navigate('/dashboard');
    } catch (err) {
      // Errors are surfaced gracefully by the context to `authError` state (e.g. Invalid credentials)
      console.error('Login failed:', err);
    }
  };
  return <div className="w-full max-w-md mx-auto bg-dark-900 border border-dark-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">{t('welcomeBack', 'Welcome Back')}</h2>
          <p className="text-slate-400 text-sm">{t('signInToCharacter', 'Sign in to CharacterU to continue')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">{t('emailAddress', 'Email Address')}</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-3 bg-dark-950 border ${validationErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-dark-800 focus:ring-primary-500'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`} placeholder={t("youExampleCom", "you@example.com")} disabled={loading} />
            {validationErrors.email && <p className="text-xs text-red-400 mt-1">{validationErrors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-300">{t('password', 'Password')}</label>
              <Link to="#" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">{t('forgotPassword', 'Forgot password?')}</Link>
            </div>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className={`w-full px-4 py-3 bg-dark-950 border ${validationErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-dark-800 focus:ring-primary-500'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`} placeholder="••••••••" disabled={loading} />
            {validationErrors.password && <p className="text-xs text-red-400 mt-1">{validationErrors.password}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-primary-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6">
            {loading ? <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('signingIn', 'Signing in...')}</span>
              </> : <span>{t('signIn', 'Sign In')}</span>}
          </button>
        </form>
        
        <div className="text-center pt-2">
          <p className="text-sm text-slate-400">{t("donTHaveAnAccount", "Don't have an account?")}{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">{t('createOne', 'Create one')}</Link>
          </p>
        </div>
      </div>
    </div>;
};
export default LoginForm;