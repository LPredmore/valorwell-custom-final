-- Database Indexes
-- Performance and uniqueness indexes for all tables

-- ======================
-- Primary Key Indexes (Automatic)
-- ======================
-- These are created automatically with PRIMARY KEY constraints

-- ======================
-- CMS1500_claims Indexes
-- ======================
CREATE UNIQUE INDEX claims_pkey ON "CMS1500_claims" USING btree (id);

-- ======================
-- Appointments Indexes
-- ======================
CREATE UNIQUE INDEX appointments_pkey ON appointments USING btree (id);
CREATE INDEX idx_appointments_availability ON appointments USING btree (clinician_id, start_at, end_at, status) WHERE (status = 'scheduled'::appointment_status);
CREATE INDEX idx_appointments_client_start ON appointments USING btree (client_id, start_at);
CREATE INDEX idx_appointments_clinician_start ON appointments USING btree (clinician_id, start_at);
CREATE INDEX idx_appointments_date_range ON appointments USING btree (start_at, end_at);
CREATE INDEX idx_appointments_end_at ON appointments USING btree (end_at);
CREATE INDEX idx_appointments_recurring_group ON appointments USING btree (recurring_group_id) WHERE (recurring_group_id IS NOT NULL);
CREATE INDEX idx_appointments_start_at ON appointments USING btree (start_at);
CREATE INDEX idx_appointments_status ON appointments USING btree (status);

-- ======================
-- Clients Indexes
-- ======================
CREATE UNIQUE INDEX clients_pkey ON clients USING btree (id);
CREATE INDEX idx_clients_email ON clients USING btree (email);
CREATE INDEX idx_clients_profile_id ON clients USING btree (profile_id);

-- ======================
-- Clinicians Indexes
-- ======================
CREATE UNIQUE INDEX clinicians_pkey ON clinicians USING btree (id);
CREATE INDEX idx_clinicians_profile_id ON clinicians USING btree (profile_id);

-- ======================
-- CPT Codes Indexes
-- ======================
CREATE UNIQUE INDEX cpt_codes_pkey ON cpt_codes USING btree (code);

-- ======================
-- Form Submissions Indexes
-- ======================
CREATE UNIQUE INDEX form_submissions_pkey ON form_submissions USING btree (id);

-- ======================
-- ICD10 Indexes
-- ======================
CREATE UNIQUE INDEX icd10_pkey ON icd10 USING btree (id);
CREATE INDEX idx_icd10_code ON icd10 USING btree (icd10);
CREATE UNIQUE INDEX unique_icd10 ON icd10 USING btree (icd10);

-- ======================
-- Nylas Accounts Indexes
-- ======================
CREATE INDEX idx_nylas_accounts_account_id ON nylas_accounts USING btree (account_id);
CREATE INDEX idx_nylas_accounts_user_id ON nylas_accounts USING btree (user_id);
CREATE UNIQUE INDEX nylas_accounts_pkey ON nylas_accounts USING btree (id);
CREATE UNIQUE INDEX nylas_accounts_user_id_key ON nylas_accounts USING btree (user_id);

-- ======================
-- Nylas Events Indexes
-- ======================
CREATE INDEX idx_nylas_events_calendar_id ON nylas_events USING btree (calendar_id);
CREATE INDEX idx_nylas_events_user_id ON nylas_events USING btree (user_id);
CREATE INDEX idx_nylas_events_when_start ON nylas_events USING btree (when_start);
CREATE UNIQUE INDEX nylas_events_pkey ON nylas_events USING btree (event_id);

-- ======================
-- Practice Info Indexes
-- ======================
CREATE UNIQUE INDEX practiceinfo_pkey ON practiceinfo USING btree (id);

-- ======================
-- Profiles Indexes
-- ======================
CREATE UNIQUE INDEX profiles_pkey ON profiles USING btree (id);

-- ======================
-- Templates Indexes
-- ======================
CREATE UNIQUE INDEX templates_pkey ON templates USING btree (id);

-- ======================
-- Appointment Types Indexes
-- ======================
CREATE UNIQUE INDEX appointment_types_pkey ON appointment_types USING btree (id);

-- ======================
-- Appointment Duration Types Indexes
-- ======================
CREATE UNIQUE INDEX appointment_duration_types_pkey ON appointment_duration_types USING btree (id);

-- ======================
-- Appointment Audit Indexes
-- ======================
CREATE UNIQUE INDEX appointment_audit_pkey ON appointment_audit USING btree (id);

-- ======================
-- Performance Notes
-- ======================
-- 
-- Key indexes for common query patterns:
-- 1. Appointment availability queries use clinician_id + date range + status
-- 2. Calendar views use start_at and end_at date ranges
-- 3. Client and clinician lookups use profile_id foreign keys
-- 4. Code lookups (CPT, ICD10) use code fields
-- 5. Nylas integration uses account_id and user_id for API calls
-- 6. Recurring appointments use recurring_group_id when present
--
-- All indexes are btree type for optimal range queries and equality checks
-- Partial indexes used where appropriate (e.g., WHERE status = 'scheduled')