
import type { Database } from '@/integrations/supabase/types';

export type AppointmentStatus = Database['public']['Enums']['appointment_status'];

export interface AppointmentEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    id: string;
    client_id: string;
    clinician_id: string;
    status: AppointmentStatus;
    type: string;
    notes?: string;
    client_timezone?: string;
    recurring_group_id?: string;
    video_room_url?: string;
    clients: {
      client_first_name: string;
      client_last_name: string;
      client_email: string;
    };
  };
}

export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface CalendarSettings {
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: number[];
  timeZone: string;
}
