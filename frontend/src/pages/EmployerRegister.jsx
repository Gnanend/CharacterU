import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/axiosInstance';
import { toast } from 'react-hot-toast';
import { Building, Mail, Lock, Briefcase, Users } from 'lucide-react';

export default function EmployerRegister() {
  const [formData, setFormData] = useState({ 
    companyName: '', 
    companyEmail: '', 
    password: '',
    industry: '',
    companySize: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/employer/register', formData);
      if (res.success) {
        localStorage.setItem('employerToken', res.token);
        toast.success('Registration successful');
        navigate('/employer/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-gray-900 p-10 rounded-2xl border border-gray-800 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mb-4 border border-indigo-500/50">
            <Building className="h-8 w-8 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Create Employer Account</h2>
          <p className="mt-2 text-sm text-gray-400">Join CharacterU's verification network</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Company Name</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-500" />
                </div>
                <input name="companyName" type="text" required onChange={handleChange} className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Acme Corp" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Company Email</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input name="companyEmail" type="email" required onChange={handleChange} className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="hr@acme.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input name="password" type="password" required minLength={8} onChange={handleChange} className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="••••••••" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Industry</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-500" />
                  </div>
                  <input name="industry" type="text" onChange={handleChange} className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Technology" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Company Size</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-500" />
                  </div>
                  <select name="companySize" onChange={handleChange} className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="">Select size...</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register Account'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link to="/employer/login" className="text-sm text-indigo-400 hover:text-indigo-300">
            Already have an account? Sign in.
          </Link>
        </div>
      </div>
    </div>
  );
}
