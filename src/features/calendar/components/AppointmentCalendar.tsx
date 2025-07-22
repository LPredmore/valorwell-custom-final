
import React, { useState, useCallback } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentEvent } from '../types/calendar';
import { AppointmentModal } from './AppointmentModal';

const localizer = momentLocalizer(moment);

export const AppointmentCalendar: React.FC = () => {
  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<AppointmentEvent | null>(null);

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', date],
    queryFn: async () => {
      const startOfMonth = moment(date).startOf('month').toISOString();
      const endOfMonth = moment(date).endOf('month').toISOString();
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients!inner(
            id,
            profiles (
              first_name,
              last_name,
              email
            )
          )
        `)
        .gte('start_at', startOfMonth)
        .lte('start_at', endOfMonth);

      if (error) throw error;

      return data.map(appointment => ({
        id: appointment.id,
        title: `${appointment.clients.profiles?.first_name || 'Unknown'} ${appointment.clients.profiles?.last_name || 'Client'}`,
        start: new Date(appointment.start_at),
        end: new Date(appointment.end_at),
        resource: appointment
      }));
    },
  });

  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
    setShowModal(true);
  }, []);

  const handleSelectEvent = useCallback((event: AppointmentEvent) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setShowModal(true);
  }, []);

  const eventStyleGetter = (event: AppointmentEvent) => {
    const status = event.resource?.status;
    let backgroundColor = '#3174ad';
    
    switch (status) {
      case 'scheduled':
        backgroundColor = '#10b981';
        break;
      case 'documented':
        backgroundColor = '#3b82f6';
        break;
      case 'no show':
        backgroundColor = '#f59e0b';
        break;
      case 'cancelled':
        backgroundColor = '#ef4444';
        break;
      default:
        backgroundColor = '#3174ad';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Appointment Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <Calendar
              localizer={localizer}
              events={appointments}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              eventPropGetter={eventStyleGetter}
              step={15}
              timeslots={4}
              defaultView="week"
              views={['month', 'week', 'day']}
              min={new Date(0, 0, 0, 8, 0, 0)}
              max={new Date(0, 0, 0, 20, 0, 0)}
            />
          </div>
        </CardContent>
      </Card>

      <AppointmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedSlot={selectedSlot}
        selectedEvent={selectedEvent}
      />
    </div>
  );
};
