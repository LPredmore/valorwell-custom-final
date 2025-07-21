
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppointmentEvent } from '../types/calendar';
import { format } from 'date-fns';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlot: { start: Date; end: Date } | null;
  selectedEvent: AppointmentEvent | null;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  selectedSlot,
  selectedEvent
}) => {
  const [formData, setFormData] = useState({
    client_id: '',
    type: 'therapy',
    notes: '',
    start_at: '',
    end_at: '',
    status: 'scheduled' as const
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, client_first_name, client_last_name, client_email')
        .order('client_first_name');

      if (error) throw error;
      return data;
    },
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: typeof formData) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          ...appointmentData,
          clinician_id: '00000000-0000-0000-0000-000000000000', // Replace with actual clinician ID
          start_at: new Date(appointmentData.start_at).toISOString(),
          end_at: new Date(appointmentData.end_at).toISOString()
        }])
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
      onClose();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create appointment',
      });
    }
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: typeof formData & { id: string }) => {
      const { data, error } = await supabase
        .from('appointments')
        .update({
          client_id: appointmentData.client_id,
          type: appointmentData.type,
          notes: appointmentData.notes,
          status: appointmentData.status,
          start_at: new Date(appointmentData.start_at).toISOString(),
          end_at: new Date(appointmentData.end_at).toISOString()
        })
        .eq('id', appointmentData.id)
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
      onClose();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update appointment',
      });
    }
  });

  useEffect(() => {
    if (selectedSlot) {
      setFormData({
        client_id: '',
        type: 'therapy',
        notes: '',
        start_at: format(selectedSlot.start, "yyyy-MM-dd'T'HH:mm"),
        end_at: format(selectedSlot.end, "yyyy-MM-dd'T'HH:mm"),
        status: 'scheduled'
      });
    } else if (selectedEvent) {
      setFormData({
        client_id: selectedEvent.resource?.client_id || '',
        type: selectedEvent.resource?.type || 'therapy',
        notes: selectedEvent.resource?.notes || '',
        start_at: format(selectedEvent.start, "yyyy-MM-dd'T'HH:mm"),
        end_at: format(selectedEvent.end, "yyyy-MM-dd'T'HH:mm"),
        status: selectedEvent.resource?.status || 'scheduled'
      });
    }
  }, [selectedSlot, selectedEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedEvent) {
      updateAppointmentMutation.mutate({
        ...formData,
        id: selectedEvent.id
      });
    } else {
      createAppointmentMutation.mutate(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {selectedEvent ? 'Edit Appointment' : 'New Appointment'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select
              value={formData.client_id}
              onValueChange={(value) => setFormData({ ...formData, client_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.client_first_name} {client.client_last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="therapy">Therapy Session</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_at">Start Time</Label>
              <Input
                id="start_at"
                type="datetime-local"
                value={formData.start_at}
                onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_at">End Time</Label>
              <Input
                id="end_at"
                type="datetime-local"
                value={formData.end_at}
                onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                required
              />
            </div>
          </div>

          {selectedEvent && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'scheduled' | 'documented' | 'no show' | 'cancelled') => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="documented">Documented</SelectItem>
                  <SelectItem value="no show">No Show</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createAppointmentMutation.isPending || updateAppointmentMutation.isPending}
            >
              {selectedEvent ? 'Update' : 'Create'} Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
