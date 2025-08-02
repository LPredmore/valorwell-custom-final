-- Convert insurance_accepted table to store boolean configuration fields
-- indicating what information needs to be collected for each insurance plan type

-- First, let's add all the new boolean columns
ALTER TABLE public.insurance_accepted 
ADD COLUMN requires_insurance_plan_type boolean DEFAULT false,
ADD COLUMN requires_insured_id_number boolean DEFAULT false,
ADD COLUMN requires_insured_name boolean DEFAULT false,
ADD COLUMN requires_patient_relationship_to_insured boolean DEFAULT false,
ADD COLUMN requires_insured_address boolean DEFAULT false,
ADD COLUMN requires_insured_date_of_birth boolean DEFAULT false,
ADD COLUMN requires_insured_sex boolean DEFAULT false,
ADD COLUMN requires_insured_employer_school_name boolean DEFAULT false,
ADD COLUMN requires_insurance_plan_program_name boolean DEFAULT false,
ADD COLUMN requires_other_insured_name boolean DEFAULT false,
ADD COLUMN requires_other_insured_policy_group_number boolean DEFAULT false,
ADD COLUMN requires_other_insured_date_of_birth boolean DEFAULT false,
ADD COLUMN requires_other_insured_sex boolean DEFAULT false,
ADD COLUMN requires_other_insured_employer_school_name boolean DEFAULT false,
ADD COLUMN requires_other_insured_plan_program_name boolean DEFAULT false,
ADD COLUMN requires_patient_condition_employment boolean DEFAULT false,
ADD COLUMN requires_patient_condition_auto_accident boolean DEFAULT false,
ADD COLUMN requires_patient_condition_other_accident boolean DEFAULT false,
ADD COLUMN requires_health_benefit_plan_indicator boolean DEFAULT false,
ADD COLUMN requires_signature_on_file boolean DEFAULT false,
ADD COLUMN requires_insured_authorization_payment boolean DEFAULT false;

-- Convert existing non-boolean fields to boolean configuration fields
-- First backup the data by renaming columns, then create new boolean columns

-- Handle group_number
ALTER TABLE public.insurance_accepted RENAME COLUMN group_number TO old_group_number;
ALTER TABLE public.insurance_accepted ADD COLUMN requires_group_number boolean DEFAULT false;

-- Handle phone_number  
ALTER TABLE public.insurance_accepted RENAME COLUMN phone_number TO old_phone_number;
ALTER TABLE public.insurance_accepted ADD COLUMN requires_phone_number boolean DEFAULT false;

-- Handle website
ALTER TABLE public.insurance_accepted RENAME COLUMN website TO old_website;
ALTER TABLE public.insurance_accepted ADD COLUMN requires_website boolean DEFAULT false;

-- Handle claims address fields
ALTER TABLE public.insurance_accepted RENAME COLUMN claims_address_line1 TO old_claims_address_line1;
ALTER TABLE public.insurance_accepted ADD COLUMN requires_claims_address_line1 boolean DEFAULT false;

ALTER TABLE public.insurance_accepted RENAME COLUMN claims_address_line2 TO old_claims_address_line2;
ALTER TABLE public.insurance_accepted ADD COLUMN requires_claims_address_line2 boolean DEFAULT false;

ALTER TABLE public.insurance_accepted RENAME COLUMN claims_city TO old_claims_city;
ALTER TABLE public.insurance_accepted ADD COLUMN requires_claims_city boolean DEFAULT false;

ALTER TABLE public.insurance_accepted RENAME COLUMN claims_state TO old_claims_state;
ALTER TABLE public.insurance_accepted ADD COLUMN requires_claims_state boolean DEFAULT false;

ALTER TABLE public.insurance_accepted RENAME COLUMN claims_zip TO old_claims_zip;
ALTER TABLE public.insurance_accepted ADD COLUMN requires_claims_zip boolean DEFAULT false;

-- Handle copay_amount
ALTER TABLE public.insurance_accepted RENAME COLUMN copay_amount TO old_copay_amount;
ALTER TABLE public.insurance_accepted ADD COLUMN requires_copay_amount boolean DEFAULT false;

-- Handle notes
ALTER TABLE public.insurance_accepted RENAME COLUMN notes TO old_notes;
ALTER TABLE public.insurance_accepted ADD COLUMN requires_notes boolean DEFAULT false;

-- Keep existing boolean fields as they are:
-- electronic_claims_supported, prior_authorization_required

-- Update existing records to set some reasonable defaults
UPDATE public.insurance_accepted SET 
requires_insurance_plan_type = true,
requires_insured_id_number = true,
requires_insured_name = true,
requires_patient_relationship_to_insured = true,
requires_group_number = (old_group_number IS NOT NULL),
requires_phone_number = (old_phone_number IS NOT NULL),
requires_claims_address_line1 = (old_claims_address_line1 IS NOT NULL);

-- Drop the old columns after migration
ALTER TABLE public.insurance_accepted 
DROP COLUMN old_group_number,
DROP COLUMN old_phone_number,
DROP COLUMN old_website,
DROP COLUMN old_claims_address_line1,
DROP COLUMN old_claims_address_line2,
DROP COLUMN old_claims_city,
DROP COLUMN old_claims_state,
DROP COLUMN old_claims_zip,
DROP COLUMN old_copay_amount,
DROP COLUMN old_notes;