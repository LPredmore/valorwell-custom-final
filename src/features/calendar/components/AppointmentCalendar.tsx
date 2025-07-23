
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
import { utcToBrowserTime, formatInTimezone, getTimezoneAbbreviation, DATE_FORMATS } from '@/utils/date';

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
        start: utcToBrowserTime(appointment.start_at),
        end: utcToBrowserTime(appointment.end_at),
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            Appointment Calendar
            <span className="text-sm font-normal text-muted-foreground">
              ({getTimezoneAbbreviation()})
            </span>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={view === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('day')}
            >
              Day
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('week')}
            >
              Week
            </Button>
            <Button
              variant={view === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('month')}
            >
              Month
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
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
              popup
              showMultiDayTimes
              formats={{
                timeGutterFormat: 'h:mm A',
                eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                  `${localizer?.format(start, 'h:mm A', culture)} - ${localizer?.format(end, 'h:mm A', culture)}`,
                agendaTimeFormat: 'h:mm A',
                agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
                  `${localizer?.format(start, 'h:mm A', culture)} - ${localizer?.format(end, 'h:mm A', culture)}`,
              }}
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
