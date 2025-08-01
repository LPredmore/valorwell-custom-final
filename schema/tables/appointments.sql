-- Appointments Table
-- Core appointments/sessions table

CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  clinician_id uuid NOT NULL,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  status appointment_status NOT NULL DEFAULT 'scheduled'::appointment_status,
  type text NOT NULL,
  notes text,
  video_room_url text,
  appointment_recurring boolean,
  recurring_group_id uuid,
  template_id uuid,
  date_of_session text,
  client_name text,
  clinician_name text,
  clinician_email text,
  client_email text,
  client_timezone time_zones,
  buffer_before integer DEFAULT 0,
  buffer_after integer DEFAULT 0,
  is_flexible boolean DEFAULT false,
  flexibility_window jsonb,
  priority integer DEFAULT 5,
  real_time_update_source text,
  last_real_time_update timestamptz,
  last_synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE UNIQUE INDEX appointments_pkey ON appointments USING btree (id);
CREATE INDEX idx_appointments_availability ON appointments USING btree (clinician_id, start_at, end_at, status) WHERE (status = 'scheduled'::appointment_status);
CREATE INDEX idx_appointments_client_start ON appointments USING btree (client_id, start_at);
CREATE INDEX idx_appointments_clinician_start ON appointments USING btree (clinician_id, start_at);
CREATE INDEX idx_appointments_date_range ON appointments USING btree (start_at, end_at);
CREATE INDEX idx_appointments_end_at ON appointments USING btree (end_at);
CREATE INDEX idx_appointments_recurring_group ON appointments USING btree (recurring_group_id) WHERE (recurring_group_id IS NOT NULL);
CREATE INDEX idx_appointments_start_at ON appointments USING btree (start_at);
CREATE INDEX idx_appointments_status ON appointments USING btree (status);