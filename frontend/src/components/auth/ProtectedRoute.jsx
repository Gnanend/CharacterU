import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../LoadingSpinner';

/**
 * A wrapper component that protects routes from unauthenticated access.
 * If the user is not logged in, they are redirected to the login page.
 * If auth state is still loading, a full screen spinner is displayed.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show a loading indicator while the AuthContext is hydrating the user session
  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If completely loaded and no user is authenticated, redirect to login
  if (!isAuthenticated) {
    // We pass the current location to state so they can be redirected back after login if desired
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, safely render the protected route's components
  return children;
};

export default ProtectedRoute;
