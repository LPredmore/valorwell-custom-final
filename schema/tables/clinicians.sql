-- Clinicians Table
-- Clinician profiles and availability settings

CREATE TABLE clinicians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  first_name text,
  last_name text,
  phone text,
  city text,
  state text,
  zip_code text,
  date_of_birth date,
  
  -- Professional Information
  clinician_professional_name text,
  clinician_type text,
  clinician_license_type text,
  clinician_npi_number text,
  clinician_taxonomy_code text,
  clinician_licensed_states text[],
  clinician_nameinsurance text,
  clinician_bio text,
  clinician_treatment_approaches text[],
  clinician_image_url text,
  
  -- Client Management
  clinician_accepting_new_clients boolean,
  clinician_min_client_age integer DEFAULT 18,
  clinician_min_notice_days integer DEFAULT 1,
  clinician_max_advance_days integer DEFAULT 30,
  
  -- Calendar Settings
  clinician_calendar_start_time time DEFAULT '08:00:00'::time,
  clinician_calendar_end_time time DEFAULT '21:00:00'::time,
  clinician_time_zone text DEFAULT 'America/New_York'::text,
  clinician_time_granularity text DEFAULT 'hour'::text,
  clinician_timezone text[],
  
  -- Weekly Availability (3 slots per day)
  -- Monday
  clinician_availability_start_monday_1 time,
  clinician_availability_end_monday_1 time,
  clinician_availability_start_monday_2 time,
  clinician_availability_end_monday_2 time,
  clinician_availability_start_monday_3 time,
  clinician_availability_end_monday_3 time,
  
  -- Tuesday
  clinician_availability_start_tuesday_1 time,
  clinician_availability_end_tuesday_1 time,
  clinician_availability_start_tuesday_2 time,
  clinician_availability_end_tuesday_2 time,
  clinician_availability_start_tuesday_3 time,
  clinician_availability_end_tuesday_3 time,
  
  -- Wednesday
  clinician_availability_start_wednesday_1 time,
  clinician_availability_end_wednesday_1 time,
  clinician_availability_start_wednesday_2 time,
  clinician_availability_end_wednesday_2 time,
  clinician_availability_start_wednesday_3 time,
  clinician_availability_end_wednesday_3 time,
  
  -- Thursday
  clinician_availability_start_thursday_1 time,
  clinician_availability_end_thursday_1 time,
  clinician_availability_start_thursday_2 time,
  clinician_availability_end_thursday_2 time,
  clinician_availability_start_thursday_3 time,
  clinician_availability_end_thursday_3 time,
  
  -- Friday
  clinician_availability_start_friday_1 time,
  clinician_availability_end_friday_1 time,
  clinician_availability_start_friday_2 time,
  clinician_availability_end_friday_2 time,
  clinician_availability_start_friday_3 time,
  clinician_availability_end_friday_3 time,
  
  -- Saturday
  clinician_availability_start_saturday_1 time,
  clinician_availability_end_saturday_1 time,
  clinician_availability_start_saturday_2 time,
  clinician_availability_end_saturday_2 time,
  clinician_availability_start_saturday_3 time,
  clinician_availability_end_saturday_3 time,
  
  -- Sunday
  clinician_availability_start_sunday_1 time,
  clinician_availability_end_sunday_1 time,
  clinician_availability_start_sunday_2 time,
  clinician_availability_end_sunday_2 time,
  clinician_availability_start_sunday_3 time,
  clinician_availability_end_sunday_3 time,
  
  -- System Fields
  clinician_temppassword text,
  last_google_sync timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE UNIQUE INDEX clinicians_pkey ON clinicians USING btree (id);
CREATE INDEX idx_clinicians_profile_id ON clinicians USING btree (profile_id);