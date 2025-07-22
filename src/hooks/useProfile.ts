
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Profile = {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
};

type UserRole = Database['public']['Enums']['user_role'];

export const useProfile = () => {
  return useQuery<Profile | null, Error>({
    queryKey: ['profile'],
    queryFn: async (): Promise<Profile | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase.rpc('get_user_profile', { 
        user_id: user.id 
      });
      if (error) throw error;
      return data;
    },
  });
};

export const useUserRole = () => {
  return useQuery<UserRole | null, Error>({
    queryKey: ['user-role'],
    queryFn: async (): Promise<UserRole | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase.rpc('get_user_role', { 
        user_id: user.id 
      });
      if (error) throw error;
      return data as UserRole;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Profile, Error, Partial<Profile>>({
    mutationFn: async (profileData: Partial<Profile>): Promise<Profile> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase.rpc('update_user_profile', {
        user_id: user.id,
        profile_data: profileData
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile',
      });
    }
  });
};
