import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CptCode {
  code: string;
  name: string;
  description?: string;
  fee: number;
  clinical_type?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

export const useCptCodes = () => {
  return useQuery({
    queryKey: ['cpt-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cpt_codes')
        .select('*')
        .order('code');
      
      if (error) throw error;
      return data as CptCode[];
    }
  });
};

export const useDeleteCptCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (code: string) => {
      const { error } = await supabase
        .from('cpt_codes')
        .delete()
        .eq('code', code);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cpt-codes'] });
    }
  });
};