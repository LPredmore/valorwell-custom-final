
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface ClinicianAvailability {
  id: string;
  profile_id: string;
  clinician_calendar_start_time: string;
  clinician_calendar_end_time: string;
  // Monday availability
  clinician_availability_start_monday_1?: string;
  clinician_availability_end_monday_1?: string;
  clinician_availability_start_monday_2?: string;
  clinician_availability_end_monday_2?: string;
  clinician_availability_start_monday_3?: string;
  clinician_availability_end_monday_3?: string;
  // Tuesday availability
  clinician_availability_start_tuesday_1?: string;
  clinician_availability_end_tuesday_1?: string;
  clinician_availability_start_tuesday_2?: string;
  clinician_availability_end_tuesday_2?: string;
  clinician_availability_start_tuesday_3?: string;
  clinician_availability_end_tuesday_3?: string;
  // Wednesday availability
  clinician_availability_start_wednesday_1?: string;
  clinician_availability_end_wednesday_1?: string;
  clinician_availability_start_wednesday_2?: string;
  clinician_availability_end_wednesday_2?: string;
  clinician_availability_start_wednesday_3?: string;
  clinician_availability_end_wednesday_3?: string;
  // Thursday availability
  clinician_availability_start_thursday_1?: string;
  clinician_availability_end_thursday_1?: string;
  clinician_availability_start_thursday_2?: string;
  clinician_availability_end_thursday_2?: string;
  clinician_availability_start_thursday_3?: string;
  clinician_availability_end_thursday_3?: string;
  // Friday availability
  clinician_availability_start_friday_1?: string;
  clinician_availability_end_friday_1?: string;
  clinician_availability_start_friday_2?: string;
  clinician_availability_end_friday_2?: string;
  clinician_availability_start_friday_3?: string;
  clinician_availability_end_friday_3?: string;
  // Saturday availability
  clinician_availability_start_saturday_1?: string;
  clinician_availability_end_saturday_1?: string;
  clinician_availability_start_saturday_2?: string;
  clinician_availability_end_saturday_2?: string;
  clinician_availability_start_saturday_3?: string;
  clinician_availability_end_saturday_3?: string;
  // Sunday availability
  clinician_availability_start_sunday_1?: string;
  clinician_availability_end_sunday_1?: string;
  clinician_availability_start_sunday_2?: string;
  clinician_availability_end_sunday_2?: string;
  clinician_availability_start_sunday_3?: string;
  clinician_availability_end_sunday_3?: string;
}

export const useClinicianAvailability = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['clinician-availability', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('clinicians')
        .select('*')
        .eq('profile_id', user.id)
        .single();

      if (error) throw error;
      return data as ClinicianAvailability;
    },
    enabled: !!user?.id,
  });
};

export const useUpdateClinicianAvailability = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (availability: Partial<ClinicianAvailability>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('clinicians')
        .update(availability)
        .eq('profile_id', user.id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinician-availability'] });
    },
  });
};
