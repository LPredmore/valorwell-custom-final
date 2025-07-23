
import React from 'react';
import { AppointmentCalendar } from '@/features/calendar/components/AppointmentCalendar';

export const Calendar: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your appointments and availability
          </p>
        </div>
      </div>

      {/* Calendar Component */}
      <div className="space-y-4">
        <AppointmentCalendar />
      </div>
    </div>
  );
};

export default Calendar;
