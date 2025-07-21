
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ClientData {
  client_first_name: string;
  client_last_name: string;
  client_preferred_name?: string;
  client_email?: string;
  client_phone?: string;
  client_date_of_birth?: string;
  client_gender?: string;
  client_address?: string;
  client_city?: string;
  client_state?: string;
  client_zip_code?: string;
  client_time_zone?: string;
  client_status?: string;
  client_assigned_therapist?: string;
  client_referral_source?: string;
  client_treatmentgoal?: string;
  client_insurance_company_primary?: string;
  client_insurance_type_primary?: string;
  client_policy_number_primary?: string;
  client_group_number_primary?: string;
}

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (clientData: ClientData) => {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: 'Success',
        description: 'Client created successfully',
      });
      navigate(`/clients/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create client. Please try again.',
        variant: 'destructive',
      });
      console.error('Error creating client:', error);
    },
  });
};

export const useUpdateClient = (clientId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (clientData: Partial<ClientData>) => {
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', clientId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', clientId] });
      toast({
        title: 'Success',
        description: 'Client updated successfully',
      });
      navigate(`/clients/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update client. Please try again.',
        variant: 'destructive',
      });
      console.error('Error updating client:', error);
    },
  });
};
