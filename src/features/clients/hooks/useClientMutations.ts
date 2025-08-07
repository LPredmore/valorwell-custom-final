
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Database } from '@/integrations/supabase/types';

interface ClientData {
  first_name: string;
  last_name: string;
  preferred_name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  time_zone?: string;
  status?: Database['public']['Enums']['client_status'];
  assigned_therapist?: string;
  referral_source?: string;
  treatmentgoal?: string;
  insurance_company_primary?: string;
  insurance_type_primary?: string;
  policy_number_primary?: string;
  group_number_primary?: string;
}

interface ClientDataWithId extends ClientData {
  id: string;
}

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (clientData: ClientData) => {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData as any])
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
        .update(clientData as any)
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

/**
 * Flexible upsert function for clients using Supabase
 * Handles both single and bulk updates efficiently
 */
export const useUpsertClients = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (clients: ClientDataWithId[]) => {
      const { data, error } = await supabase
        .from('clients')
        .upsert(clients as any, { onConflict: 'id' })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      // Invalidate individual client queries for updated clients
      data?.forEach(client => {
        queryClient.invalidateQueries({ queryKey: ['client', client.id] });
      });
      toast({
        title: 'Success',
        description: `${data?.length || 0} client(s) updated successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update clients. Please try again.',
        variant: 'destructive',
      });
      console.error('Error upserting clients:', error);
    },
  });
};
