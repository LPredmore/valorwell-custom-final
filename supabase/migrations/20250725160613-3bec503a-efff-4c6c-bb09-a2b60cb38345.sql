-- Fix security issues from the linter

-- Enable RLS on appointment_duration_types table
ALTER TABLE appointment_duration_types ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for appointment_duration_types
CREATE POLICY "Anyone can view appointment duration types" ON appointment_duration_types
FOR SELECT USING (true);

CREATE POLICY "Only admins can modify appointment duration types" ON appointment_duration_types
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Fix search path for functions
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix search path for conflict check function
CREATE OR REPLACE FUNCTION check_appointment_conflicts(
  p_clinician_id uuid,
  p_start_at timestamp with time zone,
  p_end_at timestamp with time zone,
  p_exclude_appointment_id uuid DEFAULT NULL
)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.appointments
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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = '';