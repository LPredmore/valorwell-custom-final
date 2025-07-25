-- Reorder columns in clients table to put new fields at the beginning
CREATE TABLE public.clients_new (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name text,
  last_name text,
  email text,
  phone text,
  date_of_birth date,
  city text,
  state text,
  zip_code text,
  -- All existing columns in original order
  client_tricare_plan text,
  client_age integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  client_subscriber_dob_primary date,
  client_subscriber_dob_secondary date,
  client_subscriber_dob_tertiary date,
  client_treatmentplan_startdate date,
  client_nexttreatmentplanupdate date,
  eligibility_last_checked_primary timestamp with time zone,
  eligibility_response_details_primary_json jsonb,
  eligibility_copay_primary numeric,
  eligibility_deductible_primary numeric,
  eligibility_coinsurance_primary_percent numeric,
  eligibility_copay_secondary numeric,
  eligibility_deductible_secondary numeric,
  eligibility_coinsurance_secondary_percent numeric,
  eligibility_last_checked_secondary timestamp with time zone,
  eligibility_response_details_secondary_json jsonb,
  eligibility_copay_tertiary numeric,
  eligibility_deductible_tertiary numeric,
  eligibility_coinsurance_tertiary_percent numeric,
  eligibility_last_checked_tertiary timestamp with time zone,
  eligibility_response_details_tertiary_json jsonb,
  profile_id uuid,
  eligibility_claimmd_id_secondary text,
  eligibility_status_tertiary text,
  eligibility_claimmd_id_tertiary text,
  client_preferred_name text,
  client_middle_name text,
  client_address text,
  client_gender text,
  client_gender_identity text,
  client_time_zone text,
  client_minor text,
  client_referral_source text,
  client_self_goal text,
  client_status text,
  client_assigned_therapist text,
  client_is_profile_complete text,
  client_diagnosis text[],
  client_insurance_type_primary text,
  client_policy_number_primary text,
  client_group_number_primary text,
  client_subscriber_name_primary text,
  client_subscriber_relationship_primary text,
  client_insurance_type_secondary text,
  client_policy_number_secondary text,
  client_group_number_secondary text,
  client_subscriber_name_secondary text,
  client_subscriber_relationship_secondary text,
  client_insurance_type_tertiary text,
  client_policy_number_tertiary text,
  client_group_number_tertiary text,
  client_subscriber_name_tertiary text,
  client_subscriber_relationship_tertiary text,
  client_insurance_company_primary text,
  client_insurance_company_secondary text,
  client_insurance_company_tertiary text,
  client_planlength text,
  client_treatmentfrequency text,
  client_problem text,
  client_treatmentgoal text,
  client_primaryobjective text,
  client_intervention1 text,
  client_intervention2 text,
  client_secondaryobjective text,
  client_intervention3 text,
  client_intervention4 text,
  client_tertiaryobjective text,
  client_intervention5 text,
  client_intervention6 text,
  client_privatenote text,
  client_medications text,
  client_personsinattendance text,
  client_appearance text,
  client_attitude text,
  client_behavior text,
  client_speech text,
  client_affect text,
  client_thoughtprocess text,
  client_perception text,
  client_orientation text,
  client_memoryconcentration text,
  client_insightjudgement text,
  client_mood text,
  client_substanceabuserisk text,
  client_suicidalideation text,
  client_homicidalideation text,
  client_functioning text,
  client_prognosis text,
  client_progress text,
  client_sessionnarrative text,
  client_tricare_beneficiary_category text,
  client_tricare_sponsor_name text,
  client_tricare_sponsor_branch text,
  client_tricare_sponsor_id text,
  client_tricare_region text,
  client_tricare_policy_id text,
  client_tricare_has_referral text,
  client_tricare_referral_number text,
  client_champva text,
  client_relationship text,
  client_vacoverage text,
  client_branchOS text,
  client_recentdischarge text,
  client_disabilityrating text,
  client_currentsymptoms text,
  client_temppassword text,
  client_primary_payer_id text,
  client_secondary_payer_id text,
  client_tertiary_payer_id text,
  eligibility_status_primary text,
  eligibility_claimmd_id_primary text,
  stripe_customer_id text,
  eligibility_status_secondary text
);

-- Copy all data from old table to new table
INSERT INTO public.clients_new SELECT 
  id, first_name, last_name, email, phone, date_of_birth, city, state, zip_code,
  client_tricare_plan, client_age, created_at, updated_at, client_subscriber_dob_primary,
  client_subscriber_dob_secondary, client_subscriber_dob_tertiary, client_treatmentplan_startdate,
  client_nexttreatmentplanupdate, eligibility_last_checked_primary, eligibility_response_details_primary_json,
  eligibility_copay_primary, eligibility_deductible_primary, eligibility_coinsurance_primary_percent,
  eligibility_copay_secondary, eligibility_deductible_secondary, eligibility_coinsurance_secondary_percent,
  eligibility_last_checked_secondary, eligibility_response_details_secondary_json, eligibility_copay_tertiary,
  eligibility_deductible_tertiary, eligibility_coinsurance_tertiary_percent, eligibility_last_checked_tertiary,
  eligibility_response_details_tertiary_json, profile_id, eligibility_claimmd_id_secondary,
  eligibility_status_tertiary, eligibility_claimmd_id_tertiary, client_preferred_name, client_middle_name,
  client_address, client_gender, client_gender_identity, client_time_zone, client_minor,
  client_referral_source, client_self_goal, client_status, client_assigned_therapist,
  client_is_profile_complete, client_diagnosis, client_insurance_type_primary, client_policy_number_primary,
  client_group_number_primary, client_subscriber_name_primary, client_subscriber_relationship_primary,
  client_insurance_type_secondary, client_policy_number_secondary, client_group_number_secondary,
  client_subscriber_name_secondary, client_subscriber_relationship_secondary, client_insurance_type_tertiary,
  client_policy_number_tertiary, client_group_number_tertiary, client_subscriber_name_tertiary,
  client_subscriber_relationship_tertiary, client_insurance_company_primary, client_insurance_company_secondary,
  client_insurance_company_tertiary, client_planlength, client_treatmentfrequency, client_problem,
  client_treatmentgoal, client_primaryobjective, client_intervention1, client_intervention2,
  client_secondaryobjective, client_intervention3, client_intervention4, client_tertiaryobjective,
  client_intervention5, client_intervention6, client_privatenote, client_medications,
  client_personsinattendance, client_appearance, client_attitude, client_behavior, client_speech,
  client_affect, client_thoughtprocess, client_perception, client_orientation, client_memoryconcentration,
  client_insightjudgement, client_mood, client_substanceabuserisk, client_suicidalideation,
  client_homicidalideation, client_functioning, client_prognosis, client_progress, client_sessionnarrative,
  client_tricare_beneficiary_category, client_tricare_sponsor_name, client_tricare_sponsor_branch,
  client_tricare_sponsor_id, client_tricare_region, client_tricare_policy_id, client_tricare_has_referral,
  client_tricare_referral_number, client_champva, client_relationship, client_vacoverage, client_branchOS,
  client_recentdischarge, client_disabilityrating, client_currentsymptoms, client_temppassword,
  client_primary_payer_id, client_secondary_payer_id, client_tertiary_payer_id, eligibility_status_primary,
  eligibility_claimmd_id_primary, stripe_customer_id, eligibility_status_secondary
FROM public.clients;

-- Drop the old table
DROP TABLE public.clients;

-- Rename new table to original name
ALTER TABLE public.clients_new RENAME TO clients;

-- Add primary key constraint
ALTER TABLE public.clients ADD CONSTRAINT clients_pkey PRIMARY KEY (id);

-- Recreate the RLS policies
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their own record" ON public.clients
FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Clinicians can create clients" ON public.clients
FOR INSERT WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'clinician'::user_role
));

CREATE POLICY "Clinicians can update clients" ON public.clients
FOR UPDATE USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'clinician'::user_role
));

CREATE POLICY "Clinicians can view all clients" ON public.clients
FOR SELECT USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'clinician'::user_role
));

-- Create trigger for updated_at
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Now do the same for clinicians table
CREATE TABLE public.clinicians_new (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name text,
  last_name text,
  email text,
  phone text,
  date_of_birth date,
  city text,
  state text,
  zip_code text,
  -- All existing columns in original order
  clinician_license_type text,
  clinician_npi_number text,
  clinician_taxonomy_code text,
  clinician_licensed_states text[],
  clinician_image_url text,
  clinician_accepting_new_clients boolean,
  clinician_time_granularity text DEFAULT 'hour'::text,
  clinician_bio text,
  clinician_treatment_approaches text[],
  clinician_temppassword text,
  clinician_time_zone text DEFAULT 'America/New_York'::text,
  clinician_availability_start_tuesday_1 time without time zone,
  clinician_availability_end_monday_3 time without time zone,
  clinician_availability_start_monday_3 time without time zone,
  clinician_availability_end_monday_2 time without time zone,
  clinician_availability_start_monday_2 time without time zone,
  clinician_availability_end_monday_1 time without time zone,
  clinician_availability_start_monday_1 time without time zone,
  clinician_timezone text[],
  clinician_availability_end_tuesday_3 time without time zone,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  clinician_availability_start_tuesday_3 time without time zone,
  clinician_availability_end_tuesday_2 time without time zone,
  clinician_availability_start_tuesday_2 time without time zone,
  clinician_calendar_end_time time without time zone DEFAULT '21:00:00'::time without time zone,
  clinician_calendar_start_time time without time zone DEFAULT '08:00:00'::time without time zone,
  profile_id uuid NOT NULL,
  last_google_sync timestamp with time zone,
  clinician_min_notice_days integer DEFAULT 1,
  clinician_max_advance_days integer DEFAULT 30,
  clinician_availability_end_sunday_3 time without time zone,
  clinician_availability_start_sunday_3 time without time zone,
  clinician_availability_end_sunday_2 time without time zone,
  clinician_availability_start_sunday_2 time without time zone,
  clinician_availability_end_sunday_1 time without time zone,
  clinician_availability_start_sunday_1 time without time zone,
  clinician_availability_end_saturday_3 time without time zone,
  clinician_availability_start_saturday_3 time without time zone,
  clinician_availability_end_saturday_2 time without time zone,
  clinician_availability_start_saturday_2 time without time zone,
  clinician_availability_end_saturday_1 time without time zone,
  clinician_availability_start_saturday_1 time without time zone,
  clinician_availability_end_friday_3 time without time zone,
  clinician_availability_start_friday_3 time without time zone,
  clinician_availability_end_friday_2 time without time zone,
  clinician_availability_start_friday_2 time without time zone,
  clinician_availability_end_friday_1 time without time zone,
  clinician_availability_start_friday_1 time without time zone,
  clinician_availability_end_thursday_3 time without time zone,
  clinician_availability_start_thursday_3 time without time zone,
  clinician_availability_end_thursday_2 time without time zone,
  clinician_min_client_age integer DEFAULT 18,
  clinician_availability_start_thursday_2 time without time zone,
  clinician_availability_end_thursday_1 time without time zone,
  clinician_availability_start_thursday_1 time without time zone,
  clinician_availability_end_wednesday_3 time without time zone,
  clinician_availability_start_wednesday_3 time without time zone,
  clinician_availability_end_wednesday_2 time without time zone,
  clinician_availability_start_wednesday_2 time without time zone,
  clinician_availability_end_wednesday_1 time without time zone,
  clinician_availability_start_wednesday_1 time without time zone,
  clinician_availability_end_tuesday_1 time without time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  clinician_nameinsurance text,
  clinician_professional_name text,
  clinician_type text
);

-- Copy all data from old table to new table
INSERT INTO public.clinicians_new SELECT 
  id, first_name, last_name, email, phone, date_of_birth, city, state, zip_code,
  clinician_license_type, clinician_npi_number, clinician_taxonomy_code, clinician_licensed_states,
  clinician_image_url, clinician_accepting_new_clients, clinician_time_granularity, clinician_bio,
  clinician_treatment_approaches, clinician_temppassword, clinician_time_zone, clinician_availability_start_tuesday_1,
  clinician_availability_end_monday_3, clinician_availability_start_monday_3, clinician_availability_end_monday_2,
  clinician_availability_start_monday_2, clinician_availability_end_monday_1, clinician_availability_start_monday_1,
  clinician_timezone, clinician_availability_end_tuesday_3, updated_at, clinician_availability_start_tuesday_3,
  clinician_availability_end_tuesday_2, clinician_availability_start_tuesday_2, clinician_calendar_end_time,
  clinician_calendar_start_time, profile_id, last_google_sync, clinician_min_notice_days, clinician_max_advance_days,
  clinician_availability_end_sunday_3, clinician_availability_start_sunday_3, clinician_availability_end_sunday_2,
  clinician_availability_start_sunday_2, clinician_availability_end_sunday_1, clinician_availability_start_sunday_1,
  clinician_availability_end_saturday_3, clinician_availability_start_saturday_3, clinician_availability_end_saturday_2,
  clinician_availability_start_saturday_2, clinician_availability_end_saturday_1, clinician_availability_start_saturday_1,
  clinician_availability_end_friday_3, clinician_availability_start_friday_3, clinician_availability_end_friday_2,
  clinician_availability_start_friday_2, clinician_availability_end_friday_1, clinician_availability_start_friday_1,
  clinician_availability_end_thursday_3, clinician_availability_start_thursday_3, clinician_availability_end_thursday_2,
  clinician_min_client_age, clinician_availability_start_thursday_2, clinician_availability_end_thursday_1,
  clinician_availability_start_thursday_1, clinician_availability_end_wednesday_3, clinician_availability_start_wednesday_3,
  clinician_availability_end_wednesday_2, clinician_availability_start_wednesday_2, clinician_availability_end_wednesday_1,
  clinician_availability_start_wednesday_1, clinician_availability_end_tuesday_1, created_at, clinician_nameinsurance,
  clinician_professional_name, clinician_type
FROM public.clinicians;

-- Drop the old table
DROP TABLE public.clinicians;

-- Rename new table to original name
ALTER TABLE public.clinicians_new RENAME TO clinicians;

-- Add primary key constraint
ALTER TABLE public.clinicians ADD CONSTRAINT clinicians_pkey PRIMARY KEY (id);

-- Recreate the RLS policies
ALTER TABLE public.clinicians ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinicians can update their own record" ON public.clinicians
FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can view all clinicians" ON public.clinicians
FOR SELECT USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_clinicians_updated_at
BEFORE UPDATE ON public.clinicians
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();