import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ClientInsurance {
  id: string;
  client_id: string;
  insurance_type: 'primary' | 'secondary' | 'tertiary';
  insurance_company_id?: string;
  policy_number?: string;
  group_number?: string;
  member_id?: string;
  subscriber_name?: string;
  subscriber_relationship?: string;
  subscriber_date_of_birth?: string;
  subscriber_address_line1?: string;
  subscriber_address_line2?: string;
  subscriber_city?: string;
  subscriber_state?: string;
  subscriber_zip?: string;
  plan_name?: string;
  plan_type?: string;
  copay_amount?: number;
  phone_number?: string;
  website?: string;
  claims_address_line1?: string;
  claims_address_line2?: string;
  claims_city?: string;
  claims_state?: string;
  claims_zip?: string;
  signature_on_file?: boolean;
  authorization_payment?: boolean;
  health_benefit_plan_indicator?: string;
  condition_employment?: boolean;
  condition_auto_accident?: boolean;
  condition_other_accident?: boolean;
  other_insured_name?: string;
  other_insured_date_of_birth?: string;
  other_insured_sex?: string;
  other_insured_employer_school_name?: string;
  other_insured_plan_program_name?: string;
  other_insured_policy_group_number?: string;
  insurance_plan_program_name?: string;
  insured_employer_school_name?: string;
  insured_sex?: string;
  notes?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  insurance_companies?: {
    id: string;
    name: string;
    payer_id?: string;
  };
}

export const useClientInsurance = (clientId?: string) => {
  return useQuery({
    queryKey: ['client-insurance', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      
      const { data, error } = await supabase
        .from('client_insurance')
        .select(`
          *,
          insurance_companies (
            id,
            name,
            payer_id
          )
        `)
        .eq('client_id', clientId)
        .eq('is_active', true)
        .order('insurance_type', { ascending: true });

      if (error) throw error;
      return data as ClientInsurance[];
    },
    enabled: !!clientId,
  });
};

export const useCreateClientInsurance = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (insuranceData: Omit<ClientInsurance, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('client_insurance')
        .insert(insuranceData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['client-insurance', data.client_id] });
      toast({
        title: "Insurance Added",
        description: "Insurance information has been saved successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating client insurance:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save insurance information. Please try again.",
      });
    },
  });
};

export const useUpdateClientInsurance = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...insuranceData }: Partial<ClientInsurance> & { id: string }) => {
      const { data, error } = await supabase
        .from('client_insurance')
        .update(insuranceData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['client-insurance', data.client_id] });
      toast({
        title: "Insurance Updated",
        description: "Insurance information has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating client insurance:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update insurance information. Please try again.",
      });
    },
  });
};

export const useDeleteClientInsurance = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('client_insurance')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-insurance'] });
      toast({
        title: "Insurance Removed",
        description: "Insurance information has been removed successfully.",
      });
    },
    onError: (error) => {
      console.error('Error deleting client insurance:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove insurance information. Please try again.",
      });
    },
  });
};