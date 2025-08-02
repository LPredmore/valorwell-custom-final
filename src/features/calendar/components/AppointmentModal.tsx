
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppointmentEvent, AppointmentStatus } from '../types/calendar';
import { format } from 'date-fns';
import { useCreateDailyRoom } from '@/features/telehealth/hooks/useTelehealth';
import { useAuth } from '@/context/AuthContext';
import { createRecurringAppointments } from '@/services/appointmentService';

interface AppointmentType {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

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
    type: '',
    notes: '',
    date: null as Date | null,
    hour: '9',
    minute: '00',
    ampm: 'AM',
    plannedLength: '60',
    status: 'scheduled' as AppointmentStatus,
    enableTelehealth: false,
    isRecurring: false,
    frequency: 'weekly',
    repeatUntil: null as Date | null
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createDailyRoomMutation = useCreateDailyRoom();
  const { user } = useAuth();

  // Get current user's clinician ID
  const { data: currentClinician } = useQuery({
    queryKey: ['current-clinician', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('clinicians')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          id,
          client_first_name,
          client_last_name
        `)
        .order('created_at');

      if (error) throw error;
      return data;
    },
  });

  const { data: appointmentTypes = [] } = useQuery<AppointmentType[]>({
    queryKey: ['appointment-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointment_types' as any)
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return (data as unknown) as AppointmentType[];
    },
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: typeof formData) => {
      if (!currentClinician?.id) {
        throw new Error('Clinician ID not found. Please ensure you are logged in as a clinician.');
      }

      let video_room_url = null;
      
      // Create Daily.co room if telehealth is enabled
      if (appointmentData.enableTelehealth) {
        const roomName = `appt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const roomData = await createDailyRoomMutation.mutateAsync({ roomName });
        video_room_url = roomData.url;
      }

      // Calculate start and end times
      const hour24 = appointmentData.ampm === 'PM' && appointmentData.hour !== '12' 
        ? parseInt(appointmentData.hour) + 12 
        : appointmentData.ampm === 'AM' && appointmentData.hour === '12'
        ? 0
        : parseInt(appointmentData.hour);
      
      const startDate = new Date(appointmentData.date!);
      startDate.setHours(hour24, parseInt(appointmentData.minute), 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + parseInt(appointmentData.plannedLength));

      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          client_id: appointmentData.client_id,
          clinician_id: currentClinician.id,
          type: appointmentData.type,
          notes: appointmentData.notes,
          status: appointmentData.status,
          start_at: startDate.toISOString(),
          end_at: endDate.toISOString(),
          video_room_url
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
      // Get current appointment to check existing video room
      const { data: currentAppointment, error: fetchError } = await supabase
        .from('appointments')
        .select('video_room_url')
        .eq('id', appointmentData.id)
        .single();

      if (fetchError) throw fetchError;

      let video_room_url = currentAppointment.video_room_url;
      
      // Handle telehealth room creation/removal
      if (appointmentData.enableTelehealth && !currentAppointment.video_room_url) {
        // Create new Daily.co room if telehealth enabled and no existing room
        const roomName = `appt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const roomData = await createDailyRoomMutation.mutateAsync({ roomName });
        video_room_url = roomData.url;
      } else if (!appointmentData.enableTelehealth) {
        // Remove video room URL if telehealth is disabled
        video_room_url = null;
      }
      // If telehealth enabled and room exists, keep existing room

      // Calculate start and end times
      const hour24 = appointmentData.ampm === 'PM' && appointmentData.hour !== '12' 
        ? parseInt(appointmentData.hour) + 12 
        : appointmentData.ampm === 'AM' && appointmentData.hour === '12'
        ? 0
        : parseInt(appointmentData.hour);
      
      const startDate = new Date(appointmentData.date!);
      startDate.setHours(hour24, parseInt(appointmentData.minute), 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + parseInt(appointmentData.plannedLength));

      const { data, error } = await supabase
        .from('appointments')
        .update({
          client_id: appointmentData.client_id,
          type: appointmentData.type,
          notes: appointmentData.notes,
          status: appointmentData.status,
          start_at: startDate.toISOString(),
          end_at: endDate.toISOString(),
          video_room_url
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
      const startDate = selectedSlot.start;
      const hour12 = startDate.getHours() > 12 ? startDate.getHours() - 12 : startDate.getHours() === 0 ? 12 : startDate.getHours();
      const ampm = startDate.getHours() >= 12 ? 'PM' : 'AM';
      const minutes = Math.floor(startDate.getMinutes() / 15) * 15; // Round to nearest 15 minutes
      
      setFormData({
        client_id: '',
        type: '',
        notes: '',
        date: startDate,
        hour: hour12.toString(),
        minute: minutes.toString().padStart(2, '0'),
        ampm,
        plannedLength: '60',
        status: 'scheduled' as AppointmentStatus,
        enableTelehealth: false,
        isRecurring: false,
        frequency: 'weekly',
        repeatUntil: null
      });
    } else if (selectedEvent) {
      const startDate = selectedEvent.start;
      const endDate = selectedEvent.end;
      const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60)); // Duration in minutes
      const hour12 = startDate.getHours() > 12 ? startDate.getHours() - 12 : startDate.getHours() === 0 ? 12 : startDate.getHours();
      const ampm = startDate.getHours() >= 12 ? 'PM' : 'AM';
      
      setFormData({
        client_id: selectedEvent.resource?.client_id || '',
        type: selectedEvent.resource?.type || '',
        notes: selectedEvent.resource?.notes || '',
        date: startDate,
        hour: hour12.toString(),
        minute: startDate.getMinutes().toString().padStart(2, '0'),
        ampm,
        plannedLength: duration.toString(),
        status: selectedEvent.resource?.status || 'scheduled' as AppointmentStatus,
        enableTelehealth: !!selectedEvent.resource?.video_room_url,
        isRecurring: false,
        frequency: 'weekly',
        repeatUntil: null
      });
    }
  }, [selectedSlot, selectedEvent]);

  const createRecurringMutation = useMutation({
    mutationFn: async (appointmentData: typeof formData) => {
      if (!currentClinician?.id) {
        throw new Error('Clinician ID not found. Please ensure you are logged in as a clinician.');
      }

      let video_room_url = null;
      
      // Create Daily.co room if telehealth is enabled
      if (appointmentData.enableTelehealth) {
        const roomName = `recurring-appt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const roomData = await createDailyRoomMutation.mutateAsync({ roomName });
        video_room_url = roomData.url;
      }

      // Calculate start and end times
      const hour24 = appointmentData.ampm === 'PM' && appointmentData.hour !== '12' 
        ? parseInt(appointmentData.hour) + 12 
        : appointmentData.ampm === 'AM' && appointmentData.hour === '12'
        ? 0
        : parseInt(appointmentData.hour);
      
      const startDate = new Date(appointmentData.date!);
      startDate.setHours(hour24, parseInt(appointmentData.minute), 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + parseInt(appointmentData.plannedLength));

      const recurringData = {
        client_id: appointmentData.client_id,
        clinician_id: currentClinician.id,
        type: appointmentData.type,
        notes: appointmentData.notes,
        status: appointmentData.status,
        start_at: startDate.toISOString(),
        end_at: endDate.toISOString(),
        is_recurring: true,
        frequency: appointmentData.frequency as 'weekly' | 'every-2-weeks' | 'every-3-weeks' | 'every-4-weeks',
        repeat_until: appointmentData.repeatUntil!,
        video_room_url
      };

      const result = await createRecurringAppointments(recurringData);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: 'Success',
        description: 'Recurring appointments created successfully',
      });
      onClose();
    },
    onError: (error) => {
      console.error('Recurring appointment error:', error);
      const errorMessage = error?.message || 'Failed to create recurring appointments';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    }
  });

  const deleteAppointmentMutation = useMutation({
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
      onClose();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete appointment',
      });
    }
  });

  const deleteFutureAppointmentsMutation = useMutation({
    mutationFn: async ({ appointmentId, recurringGroupId }: { appointmentId: string; recurringGroupId: string }) => {
      // Get the current appointment date
      const { data: currentAppointment, error: fetchError } = await supabase
        .from('appointments')
        .select('start_at')
        .eq('id', appointmentId)
        .single();

      if (fetchError) throw fetchError;

      // Delete all appointments in the same recurring group that start on or after this appointment's date
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('recurring_group_id', recurringGroupId)
        .gte('start_at', currentAppointment.start_at);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: 'Success',
        description: 'Future appointments deleted successfully',
      });
      onClose();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete future appointments',
      });
    }
  });

  const handleDeleteClick = () => {
    if (selectedEvent?.resource?.recurring_group_id) {
      setShowDeleteDialog(true);
    } else {
      // Single appointment, delete directly
      deleteAppointmentMutation.mutate(selectedEvent!.id);
    }
  };

  const handleDeleteSingle = () => {
    deleteAppointmentMutation.mutate(selectedEvent!.id);
    setShowDeleteDialog(false);
  };

  const handleDeleteFuture = () => {
    deleteFutureAppointmentsMutation.mutate({
      appointmentId: selectedEvent!.id,
      recurringGroupId: selectedEvent!.resource!.recurring_group_id
    });
    setShowDeleteDialog(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate recurring appointments
    if (formData.isRecurring && !formData.repeatUntil) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a "repeat until" date for recurring appointments.',
      });
      return;
    }
    
    if (selectedEvent) {
      updateAppointmentMutation.mutate({
        ...formData,
        id: selectedEvent.id
      });
    } else if (formData.isRecurring) {
      createRecurringMutation.mutate(formData);
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
                    {client.client_first_name || 'Unknown'} {client.client_last_name || 'Client'}
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
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                {appointmentTypes.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => setFormData({ ...formData, date })}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Start Time</Label>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Hour</Label>
                <Select
                  value={formData.hour}
                  onValueChange={(value) => setFormData({ ...formData, hour: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Minutes</Label>
                <Select
                  value={formData.minute}
                  onValueChange={(value) => setFormData({ ...formData, minute: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="00">00</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="45">45</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">AM/PM</Label>
                <Select
                  value={formData.ampm}
                  onValueChange={(value) => setFormData({ ...formData, ampm: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Planned Length</Label>
                <Select
                  value={formData.plannedLength}
                  onValueChange={(value) => setFormData({ ...formData, plannedLength: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="telehealth"
              checked={formData.enableTelehealth}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, enableTelehealth: checked })
              }
            />
            <Label htmlFor="telehealth">Enable Telehealth Video Session</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="recurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, isRecurring: checked as boolean })
              }
            />
            <Label htmlFor="recurring">Recurring</Label>
          </div>

          {formData.isRecurring && (
            <div className="space-y-4 p-4 border rounded-md bg-muted/20">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="every-2-weeks">Every 2 Weeks</SelectItem>
                    <SelectItem value="every-3-weeks">Every 3 Weeks</SelectItem>
                    <SelectItem value="every-4-weeks">Every 4 Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Repeat Until</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.repeatUntil && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.repeatUntil ? format(formData.repeatUntil, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.repeatUntil}
                      onSelect={(date) => setFormData({ ...formData, repeatUntil: date })}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {selectedEvent && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: AppointmentStatus) => 
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

          <div className="flex justify-between">
            {selectedEvent && (
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm"
                    onClick={handleDeleteClick}
                    disabled={deleteAppointmentMutation.isPending || deleteFutureAppointmentsMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
                    <AlertDialogDescription>
                      This appointment is part of a recurring series. What would you like to delete?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteSingle}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Delete this occurrence only
                    </AlertDialogAction>
                    <AlertDialogAction
                      onClick={handleDeleteFuture}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete this and all future occurrences
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            
            <div className="flex space-x-2 ml-auto">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createAppointmentMutation.isPending || updateAppointmentMutation.isPending || createRecurringMutation.isPending}
              >
                {selectedEvent ? 'Update' : formData.isRecurring ? 'Create Recurring' : 'Create'} Appointment
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
