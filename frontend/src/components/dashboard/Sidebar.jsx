import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  HandHeart, 
  Award, 
  Trophy, 
  User, 
  LogOut,
  Sparkles
} from 'lucide-react';

/**
 * Sidebar Component for the Dashboard Layout.
 * Renders primary navigation links, active states, and user actions.
 */
const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Daily Check-In', path: '/check-in', icon: CalendarCheck },
    { name: 'Pledges', path: '/pledge', icon: HandHeart },
    { name: 'Certificates', path: '/certificates', icon: Award },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-dark-950 border-r border-dark-800 flex flex-col h-full sticky top-0 shrink-0">
      
      {/* Brand / Logo Section */}
      <div className="h-20 flex items-center px-6 border-b border-dark-800">
        <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span>CharacterU</span>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-900/20 text-primary-400'
                    : 'text-slate-400 hover:bg-dark-800/50 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  {item.name}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions Section */}
      <div className="p-4 border-t border-dark-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl font-medium text-slate-400 hover:bg-red-900/10 hover:text-red-400 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-400 transition-colors" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
