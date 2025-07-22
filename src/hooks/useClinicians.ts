import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Clinician {
  id: string;
  profile_id: string;
  clinician_professional_name?: string;
  clinician_npi_number?: string;
  clinician_accepting_new_clients?: boolean;
  created_at: string;
  updated_at: string;
  // Related profile data
  profile?: {
    first_name?: string;
    last_name?: string;
    email: string;
    phone?: string;
    role: 'client' | 'clinician' | 'admin';
  };
}

export const useClinicians = () => {
  return useQuery({
    queryKey: ['clinicians'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clinicians')
        .select(`
          *,
          profile:profiles(
            first_name,
            last_name,
            email,
            phone,
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clinicians:', error);
        throw error;
      }

      return data as any;
    },
  });
};

export const useDeleteClinician = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clinicianId: string) => {
      const { error } = await supabase
        .from('clinicians')
        .delete()
        .eq('id', clinicianId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicians'] });
    },
  });
};