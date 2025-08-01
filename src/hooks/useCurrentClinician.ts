import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Clinician = Database['public']['Tables']['clinicians']['Row'];
type ClinicianUpdate = Database['public']['Tables']['clinicians']['Update'];

export const useCurrentClinician = () => {
  return useQuery<Clinician | null, Error>({
    queryKey: ['current-clinician'],
    queryFn: async (): Promise<Clinician | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('clinicians')
        .select('*')
        .eq('profile_id', user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No clinician record found
          return null;
        }
        throw error;
      }
      
      return data;
    },
  });
};

export const useUpdateCurrentClinician = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Clinician, Error, ClinicianUpdate>({
    mutationFn: async (clinicianData: ClinicianUpdate): Promise<Clinician> => {
      console.log('🔄 [UPDATE_CLINICIAN] Starting update with data:', clinicianData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('❌ [UPDATE_CLINICIAN] No user found');
        throw new Error('No user found');
      }

      console.log('✅ [UPDATE_CLINICIAN] User found:', user.id);

      const { data, error } = await supabase
        .from('clinicians')
        .update(clinicianData)
        .eq('profile_id', user.id)
        .select()
        .single();
        
      if (error) {
        console.error('❌ [UPDATE_CLINICIAN] Database error:', error);
        throw error;
      }
      
      console.log('✅ [UPDATE_CLINICIAN] Successfully updated clinician:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('🔄 [UPDATE_CLINICIAN] Invalidating queries and showing success toast');
      queryClient.invalidateQueries({ queryKey: ['current-clinician'] });
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    },
    onError: (error) => {
      console.error('💥 [UPDATE_CLINICIAN] Mutation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to update profile: ${error.message}`,
      });
    }
  });
};