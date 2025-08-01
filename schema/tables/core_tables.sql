-- Core System Tables
-- Essential tables for system functionality

-- Profiles Table (User authentication data)
CREATE TABLE profiles (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  role user_role NOT NULL DEFAULT 'client'::user_role,
  password text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- CPT Codes Table (Procedure codes)
CREATE TABLE cpt_codes (
  code text PRIMARY KEY,
  name text NOT NULL,
  description text,
  fee numeric NOT NULL,
  specialty_type specialty_type,
  time_reserved integer DEFAULT 50,
  online_scheduling boolean DEFAULT true,
  active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ICD10 Codes Table (Diagnosis codes)
CREATE TABLE icd10 (
  id integer PRIMARY KEY,
  icd10 varchar UNIQUE NOT NULL,
  diagnosis_name varchar NOT NULL
);

-- Practice Information Table
CREATE TABLE practiceinfo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_name text,
  practice_npi text,
  practice_taxid text,
  practice_taxonomy text,
  practice_address1 text,
  practice_address2 text,
  practice_city text,
  practice_state text,
  practice_zip text,
  primary_specialty specialty_type,
  logo_url text,
  banner_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Templates Table (Form templates)
CREATE TABLE templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  schema_json jsonb NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Form Submissions Table
CREATE TABLE form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL,
  client_id uuid NOT NULL,
  clinician_id uuid NOT NULL,
  appointment_id uuid,
  form_data jsonb NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Appointment Types Table
CREATE TABLE appointment_types (
  id bigint PRIMARY KEY,
  name text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Appointment Duration Types Table
CREATE TABLE appointment_duration_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  duration_minutes integer NOT NULL,
  color_code text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Appointment Audit Table
CREATE TABLE appointment_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL,
  action text NOT NULL,
  old_data jsonb,
  new_data jsonb,
  reason text,
  changed_by uuid,
  changed_at timestamptz DEFAULT now()
);

-- Indexes for core tables
CREATE UNIQUE INDEX profiles_pkey ON profiles USING btree (id);
CREATE UNIQUE INDEX cpt_codes_pkey ON cpt_codes USING btree (code);
CREATE UNIQUE INDEX icd10_pkey ON icd10 USING btree (id);
CREATE INDEX idx_icd10_code ON icd10 USING btree (icd10);
CREATE UNIQUE INDEX unique_icd10 ON icd10 USING btree (icd10);
CREATE UNIQUE INDEX practiceinfo_pkey ON practiceinfo USING btree (id);
CREATE UNIQUE INDEX templates_pkey ON templates USING btree (id);
CREATE UNIQUE INDEX form_submissions_pkey ON form_submissions USING btree (id);
CREATE UNIQUE INDEX appointment_types_pkey ON appointment_types USING btree (id);
CREATE UNIQUE INDEX appointment_duration_types_pkey ON appointment_duration_types USING btree (id);
CREATE UNIQUE INDEX appointment_audit_pkey ON appointment_audit USING btree (id);