
export interface AppointmentEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    id: string;
    client_id: string;
    clinician_id: string;
    status: 'scheduled' | 'documented' | 'no show' | 'cancelled';
    type: string;
    notes?: string;
    client_timezone?: string;
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
