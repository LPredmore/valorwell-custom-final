
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClinicianAvailability, useUpdateClinicianAvailability } from '../hooks/useClinicianAvailability';
import { toast } from '@/hooks/use-toast';

interface AvailabilityFormProps {
  availability: ClinicianAvailability | null;
}

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

export const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ availability }) => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: availability || {}
  });

  const updateAvailability = useUpdateClinicianAvailability();

  const onSubmit = async (data: any) => {
    try {
      await updateAvailability.mutateAsync(data);
      toast({
        title: 'Success',
        description: 'Availability updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update availability',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Calendar Hours Section */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar Display Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clinician_calendar_start_time">Start Time</Label>
              <Input
                id="clinician_calendar_start_time"
                type="time"
                {...register('clinician_calendar_start_time')}
              />
            </div>
            <div>
              <Label htmlFor="clinician_calendar_end_time">End Time</Label>
              <Input
                id="clinician_calendar_end_time"
                type="time"
                {...register('clinician_calendar_end_time')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Availability Section */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {DAYS.map((day) => (
            <div key={day.key} className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {day.label}
              </h4>
              <div className="grid grid-cols-1 gap-3">
                  {[1, 2, 3].map((slot) => {
                    const startFieldName = `clinician_availability_start_${day.key}_${slot}` as keyof ClinicianAvailability;
                    const endFieldName = `clinician_availability_end_${day.key}_${slot}` as keyof ClinicianAvailability;
                    
                    return (
                      <div key={slot} className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={startFieldName}>
                            Slot {slot} Start
                          </Label>
                          <Input
                            id={startFieldName}
                            type="time"
                            {...register(startFieldName)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={endFieldName}>
                            Slot {slot} End
                          </Label>
                          <Input
                            id={endFieldName}
                            type="time"
                            {...register(endFieldName)}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Availability'}
        </Button>
      </div>
    </form>
  );
};
