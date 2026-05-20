import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2, AlertCircle } from 'lucide-react';

/**
 * RegisterForm component handling user input, local validation, and API submission
 * using the global AuthContext.
 */
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student'
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const { register, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  // Validate form fields locally before making an API request
  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errors.email = 'Valid email is required';
    }
    
    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Stop submission if validation fails
    if (!validateForm()) return;
    
    try {
      // Call context register method which handles the API request and global state update
      await register(formData);
      // Redirect to the dashboard upon successful registration
      navigate('/dashboard');
    } catch (err) {
      // Errors are surfaced gracefully by the context to `authError` state
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-dark-900 border border-dark-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Create an Account</h2>
          <p className="text-slate-400 text-sm">Join CharacterU and start creating</p>
        </div>

        {/* Global API Error Banner */}
        {authError && (
          <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-dark-950 border ${validationErrors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-dark-800 focus:ring-primary-500'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
              placeholder="John Doe"
              disabled={loading}
            />
            {validationErrors.fullName && <p className="text-xs text-red-400 mt-1">{validationErrors.fullName}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-dark-950 border ${validationErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-dark-800 focus:ring-primary-500'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
              placeholder="you@example.com"
              disabled={loading}
            />
            {validationErrors.email && <p className="text-xs text-red-400 mt-1">{validationErrors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-dark-950 border ${validationErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-dark-800 focus:ring-primary-500'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
              placeholder="••••••••"
              disabled={loading}
            />
            {validationErrors.password && <p className="text-xs text-red-400 mt-1">{validationErrors.password}</p>}
          </div>

          {/* Role Dropdown */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">I am a...</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-950 border border-dark-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
              disabled={loading}
            >
              <option value="student">Student / Player</option>
              <option value="employer">Studio / Employer</option>
              <option value="family">Family / Parent</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-primary-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
