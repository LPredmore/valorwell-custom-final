import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useClientStatus = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['client-status', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('clients')
        .select('client_status')
        .eq('profile_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        throw error;
      }

      return data?.client_status || null;
    },
    enabled: !!user,
  });
};