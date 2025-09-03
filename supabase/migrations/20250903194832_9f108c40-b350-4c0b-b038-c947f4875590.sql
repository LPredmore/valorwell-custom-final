-- Fix clients table schema - add missing client_ prefixed columns
-- These columns are expected by the frontend code but missing in the database

-- Add missing client_ prefixed columns to match what the code expects
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS client_first_name text,
ADD COLUMN IF NOT EXISTS client_last_name text,
ADD COLUMN IF NOT EXISTS client_email text,
ADD COLUMN IF NOT EXISTS client_preferred_name text,
ADD COLUMN IF NOT EXISTS client_middle_name text,
ADD COLUMN IF NOT EXISTS client_address text,
ADD COLUMN IF NOT EXISTS client_city text,
ADD COLUMN IF NOT EXISTS client_zip_code text,
ADD COLUMN IF NOT EXISTS client_phone text,
ADD COLUMN IF NOT EXISTS client_gender text,
ADD COLUMN IF NOT EXISTS client_gender_identity text,
ADD COLUMN IF NOT EXISTS client_time_zone text,
ADD COLUMN IF NOT EXISTS client_minor text,
ADD COLUMN IF NOT EXISTS client_referral_source text,
ADD COLUMN IF NOT EXISTS client_self_goal text,
ADD COLUMN IF NOT EXISTS client_status text,
ADD COLUMN IF NOT EXISTS client_planlength text,
ADD COLUMN IF NOT EXISTS client_treatmentfrequency text,
ADD COLUMN IF NOT EXISTS client_problem text,
ADD COLUMN IF NOT EXISTS client_treatmentgoal text,
ADD COLUMN IF NOT EXISTS client_primaryobjective text,
ADD COLUMN IF NOT EXISTS client_intervention1 text,
ADD COLUMN IF NOT EXISTS client_secondaryobjective text,
ADD COLUMN IF NOT EXISTS client_intervention2 text,
ADD COLUMN IF NOT EXISTS client_ssn text;

-- Copy existing data from non-prefixed columns to prefixed columns
UPDATE clients SET
  client_first_name = first_name,
  client_last_name = last_name,
  client_email = email,
  client_preferred_name = preferred_name,
  client_middle_name = middle_name,
  client_address = address,
  client_city = city,
  client_zip_code = zip_code,
  client_phone = phone,
  client_gender = gender::text,
  client_gender_identity = gender_identity,
  client_time_zone = time_zone::text,
  client_minor = CASE WHEN minor = true THEN 'Yes' WHEN minor = false THEN 'No' ELSE 'No' END,
  client_referral_source = referral_source,
  client_self_goal = self_goal,
  client_status = status::text,
  client_planlength = planlength::text,
  client_treatmentfrequency = treatmentfrequency,
  client_problem = problem,
  client_treatmentgoal = treatmentgoal,
  client_primaryobjective = primaryobjective,
  client_intervention1 = intervention1,
  client_secondaryobjective = secondaryobjective,
  client_intervention2 = intervention2
WHERE 
  client_first_name IS NULL OR 
  client_last_name IS NULL OR 
  client_email IS NULL;