-- Phase 1: Database Foundation - Critical Schema Improvements (Simplified)

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