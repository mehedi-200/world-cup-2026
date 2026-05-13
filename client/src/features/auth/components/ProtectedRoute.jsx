import React from 'react';
import { Navigate } from 'react-router-dom';
import Loader from '@/components/ui/Loader';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <Loader size="lg" text="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.is_admin !== 1) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
