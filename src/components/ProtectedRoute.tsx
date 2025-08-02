
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useUserRole } from '@/hooks/useProfile';
import { useClientStatus } from '@/hooks/useClientStatus';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useUserRole();
  const { data: clientStatus, isLoading: statusLoading } = useClientStatus();
  const location = useLocation();

  if (loading || roleLoading || (userRole === 'client' && statusLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is a client with "New" status and not already on the add-client-info page, redirect them there
  if (userRole === 'client' && clientStatus === 'New' && location.pathname !== '/add-client-info') {
    return <Navigate to="/add-client-info" replace />;
  }

  // If user is a client trying to access add-client-info but has "Complete" status, redirect to dashboard
  if (userRole === 'client' && clientStatus === 'Complete' && location.pathname === '/add-client-info') {
    return <Navigate to="/client-dashboard" replace />;
  }

  // Admin users should have access to all clinician features

  return <>{children}</>;
};
