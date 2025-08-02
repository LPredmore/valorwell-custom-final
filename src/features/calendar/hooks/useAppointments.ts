
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type AppointmentStatus = Database['public']['Enums']['appointment_status'];

interface CreateAppointmentData {
  client_id: string;
  clinician_id: string;
  start_at: string;
  end_at: string;
  type: string;
  notes?: string;
  status: AppointmentStatus;
}

interface UpdateAppointmentData extends Partial<CreateAppointmentData> {
  id: string;
}

export const useAppointments = (dateRange?: { start: Date; end: Date }) => {
  return useQuery({
    queryKey: ['appointments', dateRange],
    queryFn: async () => {
      let query = supabase
        .from('appointments')
        .select(`
          *,
           clients!appointments_client_id_fkey(
             id,
             client_first_name,
             client_last_name
           )
        `)
        .order('start_at');

      if (dateRange) {
        query = query
          .gte('start_at', dateRange.start.toISOString())
          .lte('start_at', dateRange.end.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (appointmentData: CreateAppointmentData) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: 'Success',
        description: 'Appointment created successfully',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create appointment',
      });
    }
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateAppointmentData) => {
      const { data, error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: 'Success',
        description: 'Appointment updated successfully',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update appointment',
      });
    }
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: 'Success',
        description: 'Appointment deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete appointment',
      });
    }
  });
};
