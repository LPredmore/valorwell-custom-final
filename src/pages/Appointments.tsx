
import React from 'react';
import { AppointmentCalendar } from '@/features/calendar/components/AppointmentCalendar';

const Appointments = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
        <p className="text-muted-foreground">
          Manage your appointment schedule and bookings.
        </p>
      </div>
      
      <AppointmentCalendar />
    </div>
  );
};

export default Appointments;
