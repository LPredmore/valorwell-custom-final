-- Add missing requirement fields from insurance_companies to insurance_accepted table
-- All fields will be boolean with default false

ALTER TABLE public.insurance_accepted 
ADD COLUMN IF NOT EXISTS requires_insurance_plan_type boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_insured_id_number boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_insured_name boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_patient_relationship_to_insured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_insured_address boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_insured_date_of_birth boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_insured_sex boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_insured_employer_school_name boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_insurance_plan_program_name boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_other_insured_name boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_other_insured_policy_group_number boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_other_insured_date_of_birth boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_other_insured_sex boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_other_insured_employer_school_name boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_other_insured_plan_program_name boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_patient_condition_auto_accident boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_patient_condition_other_accident boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_patient_condition_employment boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_health_benefit_plan_indicator boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_signature_on_file boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_insured_authorization_payment boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_claims_address_line1 boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_claims_address_line2 boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_claims_city boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_claims_state boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_claims_zip boolean DEFAULT false;

-- Update existing requires_* columns to ensure they have the correct type and default
-- Some of these may already exist but we want to ensure consistency

-- These columns already exist but let's ensure they have proper defaults
ALTER TABLE public.insurance_accepted 
ALTER COLUMN requires_group_number SET DEFAULT false,
ALTER COLUMN requires_phone_number SET DEFAULT false,
ALTER COLUMN requires_website SET DEFAULT false,
ALTER COLUMN requires_copay_amount SET DEFAULT false,
ALTER COLUMN requires_notes SET DEFAULT false;

-- Add the requires_ columns that already exist but may be missing
ALTER TABLE public.insurance_accepted 
ADD COLUMN IF NOT EXISTS requires_group_number boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_phone_number boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_website boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_copay_amount boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_notes boolean DEFAULT false;