-- Add missing columns to cpt_codes table
ALTER TABLE public.cpt_codes 
ADD COLUMN time_reserved integer DEFAULT 50,
ADD COLUMN online_scheduling boolean DEFAULT true,
ADD COLUMN active boolean DEFAULT true,
ADD COLUMN specialty_type text DEFAULT '';

-- Remove status column
ALTER TABLE public.cpt_codes 
DROP COLUMN IF EXISTS status;