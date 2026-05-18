import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../ui/Spinner';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, requiredRole, message }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      toast.error(message || 'Authorization required to access this domain', {
        id: 'auth-guard-toast',
        style: {
          background: '#0f172a',
          color: '#f8fafc',
          border: '1px solid rgba(6, 182, 212, 0.2)',
        },
      });
    }
  }, [loading, user, message]);

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Spinner size="lg" /></div>;
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    toast.error('Access denied. Insufficient privileges.');
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
