
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Clinician {
  id: string;
  profile_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  clinician_professional_name?: string;
  clinician_npi_number?: string;
  clinician_accepting_new_clients?: boolean;
  created_at: string;
  updated_at: string;
}

export const useClinicians = () => {
  return useQuery({
    queryKey: ['clinicians'],
    queryFn: async () => {
      console.log('🔄 [CLINICIANS_QUERY] Starting fetch of clinicians data...');
      const startTime = Date.now();
      
      try {
        const { data, error } = await supabase
          .from('clinicians')
          .select(`
            *
          `)
          .order('created_at', { ascending: false });

        const endTime = Date.now();
        console.log(`⏱️ [CLINICIANS_QUERY] Query completed in ${endTime - startTime}ms`);

        if (error) {
          console.error('❌ [CLINICIANS_QUERY] Database error:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            error: error
          });
          throw error;
        }

        console.log('✅ [CLINICIANS_QUERY] Successfully fetched clinicians:', {
          count: data?.length || 0,
          clinicians: data?.map(c => ({
            id: c.id,
            profile_id: c.profile_id,
            // email: c.email,
            name: `${c.first_name || ''} ${c.last_name || ''}`.trim(),
            created_at: c.created_at
          })) || []
        });

        // Validate the data structure
        if (data) {
          data.forEach((clinician, index) => {
            if (!clinician.id) {
              console.warn(`⚠️ [CLINICIANS_QUERY] Clinician at index ${index} missing id`);
            }
            if (!clinician.profile_id) {
              console.warn(`⚠️ [CLINICIANS_QUERY] Clinician ${clinician.id} missing profile_id`);
            }
          });
        }

        return data as any;
      } catch (error) {
        const endTime = Date.now();
        console.error(`💥 [CLINICIANS_QUERY] Unexpected error after ${endTime - startTime}ms:`, {
          name: error?.name || 'unknown',
          message: error?.message || 'no message',
          stack: error?.stack || 'no stack',
          error: error
        });
        throw error;
      }
    },
  });
};

export const useDeleteClinician = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clinicianId: string) => {
      console.log('🗑️ [DELETE_CLINICIAN] Starting deletion for clinician:', clinicianId);
      const startTime = Date.now();
      
      try {
        const { error } = await supabase
          .from('clinicians')
          .delete()
          .eq('id', clinicianId);

        const endTime = Date.now();
        console.log(`⏱️ [DELETE_CLINICIAN] Delete operation completed in ${endTime - startTime}ms`);

        if (error) {
          console.error('❌ [DELETE_CLINICIAN] Database error:', {
            clinicianId,
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            error: error
          });
          throw error;
        }

        console.log('✅ [DELETE_CLINICIAN] Successfully deleted clinician:', clinicianId);
      } catch (error) {
        const endTime = Date.now();
        console.error(`💥 [DELETE_CLINICIAN] Unexpected error after ${endTime - startTime}ms:`, {
          clinicianId,
          name: error?.name || 'unknown',
          message: error?.message || 'no message',
          stack: error?.stack || 'no stack',
          error: error
        });
        throw error;
      }
    },
    onSuccess: (data, clinicianId) => {
      console.log('🔄 [DELETE_CLINICIAN] Invalidating clinicians query cache after successful deletion');
      queryClient.invalidateQueries({ queryKey: ['clinicians'] });
      console.log('✅ [DELETE_CLINICIAN] Cache invalidation completed for clinician:', clinicianId);
    },
    onError: (error, clinicianId) => {
      console.error('💥 [DELETE_CLINICIAN] Mutation failed for clinician:', {
        clinicianId,
        error: error
      });
    }
  });
};
