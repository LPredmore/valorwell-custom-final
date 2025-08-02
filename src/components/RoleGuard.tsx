
import React from 'react';
import { useUserRole } from '@/hooks/useProfile';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const { data: userRole, isLoading } = useUserRole();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Admin role has access to all clinician features
  const hasAccess = userRole && (
    allowedRoles.includes(userRole) || 
    (userRole === 'admin' && allowedRoles.includes('clinician'))
  );

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
