import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Container from '../components/Container';
import { LogOut, User as UserIcon, Shield, Mail } from 'lucide-react';

/**
 * Protected Dashboard Page.
 * Displays user profile information and provides a logout action.
 */
const Dashboard = () => {
  // Extract user data and logout function from global authentication context
  const { user, logout } = useAuth();

  return (
    <div className="min-h-[80vh] py-12 lg:py-16">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
              <p className="text-slate-400 mt-1">Welcome back, {user?.fullName}!</p>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition-colors border border-dark-700"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* User Profile Card */}
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary-900/30 rounded-full flex items-center justify-center border border-primary-500/20">
                  <UserIcon className="w-8 h-8 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white truncate max-w-[150px]">{user?.fullName}</h3>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-dark-800 border border-dark-700 mt-1">
                    <Shield className="w-3 h-3 text-primary-400" />
                    <span className="text-xs font-medium text-slate-300 capitalize">{user?.role}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-400 break-all">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>{user?.email}</span>
                </div>
                <div className="pt-4 mt-4 border-t border-dark-800 flex justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className="text-emerald-400 font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Placeholder for future features */}
            <div className="md:col-span-2 bg-dark-900 border border-dark-800 border-dashed rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center text-center space-y-4">
              <h3 className="text-xl font-semibold text-white">Your Workspace</h3>
              <p className="text-slate-400 max-w-sm">
                Character generation projects and assets will appear here. The workspace feature is currently under development.
              </p>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
