import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export interface InsuranceCompany {
  id: string;
  name: string;
  payer_id: string | null;
  is_custom: boolean;
  created_at: string;
  updated_at: string;
  // Boolean fields indicating what information needs to be collected
  requires_insurance_plan_type: boolean;
  requires_insured_id_number: boolean;
  requires_insured_name: boolean;
  requires_patient_relationship_to_insured: boolean;
  requires_insured_address: boolean;
  requires_insured_date_of_birth: boolean;
  requires_insured_sex: boolean;
  requires_insured_employer_school_name: boolean;
  requires_insurance_plan_program_name: boolean;
  requires_other_insured_name: boolean;
  requires_other_insured_policy_group_number: boolean;
  requires_other_insured_date_of_birth: boolean;
  requires_other_insured_sex: boolean;
  requires_other_insured_employer_school_name: boolean;
  requires_other_insured_plan_program_name: boolean;
  requires_patient_condition_employment: boolean;
  requires_patient_condition_auto_accident: boolean;
  requires_patient_condition_other_accident: boolean;
  requires_health_benefit_plan_indicator: boolean;
  requires_signature_on_file: boolean;
  requires_insured_authorization_payment: boolean;
  requires_group_number: boolean;
  requires_phone_number: boolean;
  requires_website: boolean;
  requires_claims_address_line1: boolean;
  requires_claims_address_line2: boolean;
  requires_claims_city: boolean;
  requires_claims_state: boolean;
  requires_claims_zip: boolean;
  requires_copay_amount: boolean;
  requires_notes: boolean;
}

export interface AcceptedInsurance {
  id: string;
  insurance_company_id: string;
  plan_name: string;
  payer_id: string | null;
  group_number: string | null;
  phone_number: string | null;
  website: string | null;
  claims_address_line1: string | null;
  claims_address_line2: string | null;
  claims_city: string | null;
  claims_state: string | null;
  claims_zip: string | null;
  electronic_claims_supported: boolean;
  prior_authorization_required: boolean;
  copay_amount: number | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  insurance_companies?: InsuranceCompany;
}

export const useInsuranceCompanies = () => {
  return useQuery({
    queryKey: ['insurance-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_companies')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as InsuranceCompany[];
    }
  });
};

export const useAcceptedInsurance = () => {
  return useQuery({
    queryKey: ['accepted-insurance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_accepted')
        .select(`
          *,
          insurance_companies (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AcceptedInsurance[];
    }
  });
};

export const useCreateInsuranceCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (company: Pick<InsuranceCompany, 'name' | 'payer_id'>) => {
      const { data, error } = await supabase
        .from('insurance_companies')
        .insert({ ...company, is_custom: true })
        .select()
        .single();
      
      if (error) throw error;
      return data as InsuranceCompany;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-companies'] });
    }
  });
};

export const useCreateAcceptedInsurance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (insurance: Omit<AcceptedInsurance, 'id' | 'created_at' | 'updated_at' | 'insurance_companies'>) => {
      const { data, error } = await supabase
        .from('insurance_accepted')
        .insert(insurance)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accepted-insurance'] });
    }
  });
};

export const useUpdateAcceptedInsurance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AcceptedInsurance> }) => {
      const { error } = await supabase
        .from('insurance_accepted')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accepted-insurance'] });
    }
  });
};

export const useDeleteAcceptedInsurance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('insurance_accepted')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accepted-insurance'] });
    }
  });
};