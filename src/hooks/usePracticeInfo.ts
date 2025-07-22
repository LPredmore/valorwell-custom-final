
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

export interface PracticeInfo {
  id: string;
  practice_name: string | null;
  practice_taxid: string | null;
  practice_npi: string | null;
  practice_taxonomy: string | null;
  practice_address1: string | null;
  practice_address2: string | null;
  practice_city: string | null;
  practice_state: string | null;
  practice_zip: string | null;
  primary_specialty?: Database['public']['Enums']['specialty_type'] | null;
  logo_url: string | null;
  banner_url: string | null;
}

export const usePracticeInfo = () => {
  return useQuery({
    queryKey: ['practiceInfo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('practiceinfo')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return data as PracticeInfo | null;
    },
  });
};

export const usePracticeUpdate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Partial<PracticeInfo>) => {
      // Check if any practice info exists
      const { data: existing } = await supabase
        .from('practiceinfo')
        .select('id')
        .single();

      if (existing) {
        // Update existing record
        const { data: updated, error } = await supabase
          .from('practiceinfo')
          .update(data)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return updated;
      } else {
        // Create new record
        const { data: created, error } = await supabase
          .from('practiceinfo')
          .insert(data)
          .select()
          .single();

        if (error) throw error;
        return created;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['practiceInfo'] });
      toast({
        title: "Success",
        description: "Practice information updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update practice information.",
        variant: "destructive",
      });
      console.error('Error updating practice info:', error);
    },
  });
};
