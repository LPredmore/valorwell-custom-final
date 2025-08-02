import { useUserRole } from './useProfile';

/**
 * Hook to check if the current user has clinician-level access
 * This includes both 'clinician' and 'admin' roles (admin has all clinician permissions)
 */
export const useClinicianAccess = () => {
  const { data: userRole, isLoading } = useUserRole();
  
  const hasClinicianAccess = userRole === 'clinician' || userRole === 'admin';
  
  return {
    hasClinicianAccess,
    isLoading,
    userRole
  };
};

/**
 * Hook to check if the current user is specifically an admin
 */
export const useIsAdmin = () => {
  const { data: userRole, isLoading } = useUserRole();
  
  const isAdmin = userRole === 'admin';
  
  return {
    isAdmin,
    isLoading,
    userRole
  };
};