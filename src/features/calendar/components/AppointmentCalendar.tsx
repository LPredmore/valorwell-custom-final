
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
import { AvailabilityMenu } from './AvailabilityMenu';
import { useClinicianAvailability } from '../hooks/useClinicianAvailability';
import { utcToBrowserTime, formatInTimezone, getTimezoneAbbreviation, DATE_FORMATS } from '@/utils/date';
import { Settings, Plus } from 'lucide-react';

const localizer = momentLocalizer(moment);

export const AppointmentCalendar: React.FC = () => {
  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showAvailabilityMenu, setShowAvailabilityMenu] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<AppointmentEvent | null>(null);

  const { data: availability } = useClinicianAvailability();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', date],
    queryFn: async () => {
      const startOfMonth = moment(date).startOf('month').toISOString();
      const endOfMonth = moment(date).endOf('month').toISOString();
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          client_name,
          recurring_group_id,
          video_room_url
        `)
        .gte('start_at', startOfMonth)
        .lte('start_at', endOfMonth);

      if (error) throw error;

      return data.map(appointment => ({
        id: appointment.id,
        title: appointment.client_name || 'Unknown Client',
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

  // Get calendar min/max times from availability settings
  const getCalendarTimes = () => {
    const defaultStart = new Date(0, 0, 0, 8, 0, 0); // 8:00 AM
    const defaultEnd = new Date(0, 0, 0, 21, 0, 0); // 9:00 PM

    if (!availability) {
      return { min: defaultStart, max: defaultEnd };
    }

    let min = defaultStart;
    let max = defaultEnd;

    if (availability.calendar_start_time) {
      const [hours, minutes] = availability.calendar_start_time.split(':').map(Number);
      min = new Date(0, 0, 0, hours, minutes, 0);
    }

    if (availability.calendar_end_time) {
      const [hours, minutes] = availability.calendar_end_time.split(':').map(Number);
      max = new Date(0, 0, 0, hours, minutes, 0);
    }

    return { min, max };
  };

  const { min, max } = getCalendarTimes();

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
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                const now = new Date();
                const defaultSlot = {
                  start: now,
                  end: new Date(now.getTime() + 60 * 60 * 1000) // 1 hour later
                };
                setSelectedSlot(defaultSlot);
                setSelectedEvent(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Appointment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAvailabilityMenu(true)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Availability
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
              min={min}
              max={max}
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

      <AvailabilityMenu
        isOpen={showAvailabilityMenu}
        onClose={() => setShowAvailabilityMenu(false)}
      />
    </div>
  );
};
