import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../LoadingSpinner';

/**
 * A wrapper component that protects routes based on the authenticated user's role.
 * Must be used in conjunction with authentication, or handles it implicitly.
 * 
 * @param {Array<string>} allowedRoles - Array of roles permitted to view the route
 */
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Show a loading indicator while the AuthContext is hydrating
  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If completely loaded and no user is authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user's role is included in the allowed roles array
  if (!allowedRoles.includes(user.role)) {
    // If they lack permission, safely redirect them away from the restricted area
    // Usually redirecting to a dashboard or a generic 'Unauthorized' page is best practice.
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and authorized, render the protected component
  return children;
};

export default RoleProtectedRoute;
