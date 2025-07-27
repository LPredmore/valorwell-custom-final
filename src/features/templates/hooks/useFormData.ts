
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FormContext, FormData } from '../types/formContext';

export const useFormData = (context: FormContext) => {
  return useQuery({
    queryKey: ['formData', context],
    queryFn: async (): Promise<FormData> => {
      const formData: FormData = {};

      // Fetch client data if client_id is provided
      if (context.client_id) {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', context.client_id)
          .maybeSingle();
        
        if (clientError) {
          console.error('Error fetching client data:', clientError);
        } else if (clientData) {
          // Add client data with 'clients_' prefix (plural) for field mapping
          Object.entries(clientData).forEach(([key, value]) => {
            formData[`clients_${key}`] = value;
          });
        }
      }

      // Fetch clinician data if clinician_id is provided
      if (context.clinician_id) {
        const { data: clinicianData, error: clinicianError } = await supabase
          .from('clinicians')
          .select('*')
          .eq('id', context.clinician_id)
          .maybeSingle();
        
        if (clinicianError) {
          console.error('Error fetching clinician data:', clinicianError);
        } else if (clinicianData) {
          // Add clinician data with 'clinicians_' prefix (plural) for field mapping
          Object.entries(clinicianData).forEach(([key, value]) => {
            formData[`clinicians_${key}`] = value;
          });
        }
      }

      // Fetch appointment data if appointment_id is provided
      if (context.appointment_id) {
        const { data: appointmentData, error: appointmentError } = await supabase
          .from('appointments')
          .select('*')
          .eq('id', context.appointment_id)
          .maybeSingle();
        
        if (appointmentError) {
          console.error('Error fetching appointment data:', appointmentError);
        } else if (appointmentData) {
          // Add appointment data with 'appointments_' prefix (plural) for field mapping
          Object.entries(appointmentData).forEach(([key, value]) => {
            formData[`appointments_${key}`] = value;
          });
        }
      }

      return formData;
    },
    enabled: !!(context.client_id || context.clinician_id || context.appointment_id),
  });
};
