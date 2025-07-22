
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { VideoCall } from '@/features/telehealth/components/VideoCall';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const TelehealthSession = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  const { data: appointment, isLoading, error } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: async () => {
      if (!appointmentId) throw new Error('No appointment ID provided');

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients!inner(
            id,
            profiles (
              first_name,
              last_name
            )
          )
        `)
        .eq('id', appointmentId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!appointmentId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading appointment...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/appointments')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Appointments
          </Button>
        </div>
        <div className="text-center p-8">
          <p className="text-lg font-medium">Appointment not found</p>
          <p className="text-muted-foreground">The appointment you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const clientName = appointment.clients?.profiles
    ? `${appointment.clients.profiles.first_name} ${appointment.clients.profiles.last_name}`
    : 'Unknown Client';

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/appointments')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Appointments
        </Button>
      </div>

      <div className="h-[calc(100vh-8rem)]">
        <VideoCall
          appointmentId={appointment.id}
          videoRoomUrl={appointment.video_room_url}
          isHost={true}
          clientName={clientName}
          startTime={new Date(appointment.start_at)}
        />
      </div>
    </div>
  );
};

export default TelehealthSession;
