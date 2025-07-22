
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateDailyRoomParams {
  roomName: string;
  maxParticipants?: number;
}

interface CreateDailyRoomResponse {
  url: string;
  name: string;
  roomId: string;
}

export const useCreateDailyRoom = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ roomName, maxParticipants = 2 }: CreateDailyRoomParams): Promise<CreateDailyRoomResponse> => {
      const { data, error } = await supabase.functions.invoke('create-daily-room', {
        body: {
          roomName,
          maxParticipants,
        },
      });

      if (error) {
        console.error('Error creating Daily room:', error);
        throw new Error('Failed to create video room');
      }

      return data;
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create video room',
      });
    },
  });
};

export const useUpdateAppointmentWithVideoRoom = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ appointmentId, videoRoomUrl }: { appointmentId: string; videoRoomUrl: string }) => {
      const { data, error } = await supabase
        .from('appointments')
        .update({ video_room_url: videoRoomUrl })
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Video room added to appointment',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update appointment with video room',
      });
    },
  });
};
