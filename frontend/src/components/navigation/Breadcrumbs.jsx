import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumbs Component
 * Dynamically generates a navigation trail based on the current URL.
 */
const Breadcrumbs = ({ className = '' }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // If we are at the root or just /dashboard, we might only want a simple trail
  if (pathnames.length === 0) return null;

  return (
    <nav className={`flex items-center text-sm font-medium ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {/* Home Link */}
        <li>
          <Link 
            to="/dashboard" 
            className="text-slate-500 hover:text-primary-400 transition-colors flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>

        {pathnames.map((name, index) => {
          // Build the route up to this crumb
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          // Format the name (capitalize, replace dashes)
          const formattedName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');

          return (
            <React.Fragment key={name}>
              <ChevronRight className="w-4 h-4 text-dark-700 shrink-0" />
              <li>
                {isLast ? (
                  <span className="text-slate-300 font-semibold" aria-current="page">
                    {formattedName}
                  </span>
                ) : (
                  <Link 
                    to={routeTo} 
                    className="text-slate-500 hover:text-primary-400 transition-colors"
                  >
                    {formattedName}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
