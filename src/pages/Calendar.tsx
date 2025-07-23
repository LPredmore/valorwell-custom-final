
import React from 'react';
import { AppointmentCalendar } from '@/features/calendar/components/AppointmentCalendar';
import { SyncStatus } from '@/features/calendar/components/SyncStatus';
import { DebugPanel } from '@/components/debug/DebugPanel';

export const Calendar: React.FC = () => {
  console.log('=== CALENDAR PAGE RENDER ===');
  console.log('Calendar page component mounted');
  
  return (
    <div className="space-y-6 p-6">
      {/* Debug Panel for Troubleshooting */}
      <DebugPanel />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your appointments and availability
          </p>
        </div>
      </div>

      {/* Sync Status */}
      <SyncStatus />

      {/* Calendar Component */}
      <div className="space-y-4">
        <AppointmentCalendar />
      </div>
    </div>
  );
};

export default Calendar;
