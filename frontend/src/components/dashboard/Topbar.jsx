import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/**
 * Topbar Component for the Dashboard Layout.
 * Contains global search, notifications, and user profile summary.
 */
const Topbar = ({ onOpenSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-dark-950/80 backdrop-blur-md border-b border-dark-800 sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10">
      
      {/* Mobile Menu Trigger & Search */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSidebar}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-dark-800 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Global Search (Placeholder) */}
        <div className="hidden lg:flex items-center gap-2 bg-dark-900 border border-dark-800 rounded-xl px-4 py-2.5 w-80 focus-within:ring-2 focus-within:border-transparent focus-within:ring-primary-500/50 transition-all group">
          <Search className="w-4 h-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search your progress..." 
            className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full"
          />
        </div>
      </div>

      {/* User Actions & Profile */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Notifications */}
        <button className="p-2.5 text-slate-400 hover:text-white rounded-full hover:bg-dark-800 transition-colors relative">
          <Bell className="w-5 h-5" />
          {/* Active notification indicator dot */}
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary-500 rounded-full border-2 border-dark-950"></span>
        </button>
        
        {/* Profile Summary */}
        <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-dark-800">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-white truncate max-w-[120px]">{user?.fullName || 'User'}</p>
            <p className="text-xs text-slate-500 capitalize font-medium">{user?.role || 'Student'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-900 to-dark-800 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold uppercase shadow-inner">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
        </div>

      </div>
      
    </header>
  );
};

export default Topbar;
