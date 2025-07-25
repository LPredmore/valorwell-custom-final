-- Phase 1: Database Foundation - Critical Schema Improvements (Fixed)

-- Add foreign key constraints for referential integrity
ALTER TABLE appointments 
ADD CONSTRAINT fk_appointments_client_id 
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

ALTER TABLE appointments 
ADD CONSTRAINT fk_appointments_clinician_id 
FOREIGN KEY (clinician_id) REFERENCES clinicians(id) ON DELETE CASCADE;

ALTER TABLE appointments 
ADD CONSTRAINT fk_appointments_template_id 
FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE SET NULL;

-- Fix data type inconsistencies
ALTER TABLE appointments 
ALTER COLUMN appointment_recurring TYPE boolean USING (appointment_recurring::boolean);

-- Create appointment duration/types lookup table for better normalization
CREATE TABLE IF NOT EXISTS appointment_duration_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  duration_minutes integer NOT NULL,
  color_code text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert standard appointment types
INSERT INTO appointment_duration_types (name, duration_minutes, color_code) VALUES
('Initial Consultation', 90, '#3B82F6'),
('Follow-up Session', 60, '#10B981'),
('Brief Check-in', 30, '#F59E0B'),
('Group Session', 120, '#8B5CF6'),
('Emergency Session', 45, '#EF4444');

-- Add performance indexes for common queries
CREATE INDEX IF NOT EXISTS idx_appointments_start_at ON appointments(start_at);
CREATE INDEX IF NOT EXISTS idx_appointments_end_at ON appointments(end_at);
CREATE INDEX IF NOT EXISTS idx_appointments_clinician_start ON appointments(clinician_id, start_at);
CREATE INDEX IF NOT EXISTS idx_appointments_client_start ON appointments(client_id, start_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_recurring_group ON appointments(recurring_group_id) WHERE recurring_group_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_appointments_date_range ON appointments USING BTREE (start_at, end_at);

-- Add composite index for availability queries (critical for performance)
CREATE INDEX IF NOT EXISTS idx_appointments_availability 
ON appointments(clinician_id, start_at, end_at, status) 
WHERE status = 'scheduled';

-- Add indexes for clients table (for self-scheduling performance)
CREATE INDEX IF NOT EXISTS idx_clients_profile_id ON clients(profile_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- Add indexes for clinicians table
CREATE INDEX IF NOT EXISTS idx_clinicians_profile_id ON clinicians(profile_id);

-- Create audit trail table for compliance and debugging
CREATE TABLE IF NOT EXISTS appointment_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL,
  action text NOT NULL, -- 'created', 'updated', 'cancelled', 'completed'
  old_data jsonb,
  new_data jsonb,
  changed_by uuid REFERENCES auth.users(id),
  changed_at timestamp with time zone DEFAULT now(),
  reason text
);

-- Enable RLS on audit table
ALTER TABLE appointment_audit ENABLE ROW LEVEL SECURITY;

-- RLS policy for audit table - clinicians can view audit for their appointments
CREATE POLICY "Clinicians can view audit for their appointments" ON appointment_audit
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM appointments a 
    JOIN clinicians c ON a.clinician_id = c.id 
    WHERE a.id = appointment_audit.appointment_id 
    AND c.profile_id = auth.uid()
  )
);

-- Create function to log appointment changes
CREATE OR REPLACE FUNCTION log_appointment_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO appointment_audit (appointment_id, action, new_data, changed_by)
    VALUES (NEW.id, 'created', row_to_json(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO appointment_audit (appointment_id, action, old_data, new_data, changed_by)
    VALUES (NEW.id, 'updated', row_to_json(OLD), row_to_json(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO appointment_audit (appointment_id, action, old_data, changed_by)
    VALUES (OLD.id, 'cancelled', row_to_json(OLD), auth.uid());
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for audit logging
CREATE TRIGGER appointment_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON appointments
  FOR EACH ROW EXECUTE FUNCTION log_appointment_changes();

-- Create function to check appointment conflicts (critical for enterprise use)
CREATE OR REPLACE FUNCTION check_appointment_conflicts(
  p_clinician_id uuid,
  p_start_at timestamp with time zone,
  p_end_at timestamp with time zone,
  p_exclude_appointment_id uuid DEFAULT NULL
)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM appointments
    WHERE clinician_id = p_clinician_id
    AND status = 'scheduled'
    AND (p_exclude_appointment_id IS NULL OR id != p_exclude_appointment_id)
    AND (
      (start_at <= p_start_at AND end_at > p_start_at) OR
      (start_at < p_end_at AND end_at >= p_end_at) OR
      (start_at >= p_start_at AND end_at <= p_end_at)
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create function for bulk recurring appointment creation (enterprise performance)
CREATE OR REPLACE FUNCTION create_recurring_appointments(
  p_base_appointment jsonb,
  p_frequency text,
  p_repeat_until date,
  p_clinician_id uuid
)
RETURNS uuid[] AS $$
DECLARE
  appointment_ids uuid[] := '{}';
  recurring_group_id uuid;
  current_date date;
  interval_val interval;
  appointment_data jsonb;
  new_appointment_id uuid;
BEGIN
  -- Generate unique group ID for this recurring series
  recurring_group_id := gen_random_uuid();
  
  -- Determine interval based on frequency
  CASE p_frequency
    WHEN 'weekly' THEN interval_val := '1 week'::interval;
    WHEN 'every-2-weeks' THEN interval_val := '2 weeks'::interval;
    WHEN 'every-3-weeks' THEN interval_val := '3 weeks'::interval;
    WHEN 'every-4-weeks' THEN interval_val := '4 weeks'::interval;
    ELSE interval_val := '1 week'::interval;
  END CASE;
  
  current_date := (p_base_appointment->>'start_at')::timestamp with time zone::date;
  
  WHILE current_date <= p_repeat_until LOOP
    -- Check for conflicts before creating
    IF NOT check_appointment_conflicts(
      p_clinician_id,
      (current_date::text || ' ' || split_part(p_base_appointment->>'start_at', 'T', 2))::timestamp with time zone,
      (current_date::text || ' ' || split_part(p_base_appointment->>'end_at', 'T', 2))::timestamp with time zone
    ) THEN
      
      -- Create appointment data with updated dates
      appointment_data := p_base_appointment;
      appointment_data := jsonb_set(appointment_data, '{start_at}', 
        to_jsonb((current_date::text || ' ' || split_part(p_base_appointment->>'start_at', 'T', 2))::timestamp with time zone));
      appointment_data := jsonb_set(appointment_data, '{end_at}', 
        to_jsonb((current_date::text || ' ' || split_part(p_base_appointment->>'end_at', 'T', 2))::timestamp with time zone));
      appointment_data := jsonb_set(appointment_data, '{recurring_group_id}', to_jsonb(recurring_group_id));
      appointment_data := jsonb_set(appointment_data, '{appointment_recurring}', 'true');
      
      -- Insert the appointment
      INSERT INTO appointments (
        client_id, clinician_id, start_at, end_at, type, status, notes,
        recurring_group_id, appointment_recurring, video_room_url
      ) VALUES (
        (appointment_data->>'client_id')::uuid,
        (appointment_data->>'clinician_id')::uuid,
        (appointment_data->>'start_at')::timestamp with time zone,
        (appointment_data->>'end_at')::timestamp with time zone,
        appointment_data->>'type',
        (appointment_data->>'status')::appointment_status,
        appointment_data->>'notes',
        recurring_group_id,
        true,
        appointment_data->>'video_room_url'
      ) RETURNING id INTO new_appointment_id;
      
      appointment_ids := array_append(appointment_ids, new_appointment_id);
    END IF;
    
    current_date := current_date + interval_val;
  END LOOP;
  
  RETURN appointment_ids;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get clinician availability (critical for self-scheduling)
CREATE OR REPLACE FUNCTION get_clinician_availability(
  p_clinician_id uuid,
  p_start_date date,
  p_end_date date,
  p_duration_minutes integer DEFAULT 60
)
RETURNS TABLE (
  available_slot timestamp with time zone,
  slot_end timestamp with time zone
) AS $$
DECLARE
  working_hours record;
  current_date date;
  slot_start timestamp with time zone;
  slot_end timestamp with time zone;
BEGIN
  current_date := p_start_date;
  
  WHILE current_date <= p_end_date LOOP
    -- Get clinician working hours for this day of week
    SELECT 
      clinician_calendar_start_time,
      clinician_calendar_end_time
    INTO working_hours
    FROM clinicians 
    WHERE id = p_clinician_id;
    
    IF working_hours IS NOT NULL THEN
      slot_start := current_date + working_hours.clinician_calendar_start_time;
      
      WHILE slot_start + (p_duration_minutes || ' minutes')::interval <= current_date + working_hours.clinician_calendar_end_time LOOP
        slot_end := slot_start + (p_duration_minutes || ' minutes')::interval;
        
        -- Check if slot is available (no conflicts)
        IF NOT check_appointment_conflicts(p_clinician_id, slot_start, slot_end) THEN
          available_slot := slot_start;
          RETURN NEXT;
        END IF;
        
        slot_start := slot_start + '30 minutes'::interval; -- 30-minute increments
      END LOOP;
    END IF;
    
    current_date := current_date + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;