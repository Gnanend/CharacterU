import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../services/axiosInstance';
import LoadingSpinner from '../ui/LoadingSpinner';

const EmployerProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('employerToken');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/employer/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.success) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        localStorage.removeItem('employerToken');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-950 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/employer/login" state={{ from: location }} replace />;
  }

  return children;
};

export default EmployerProtectedRoute;
