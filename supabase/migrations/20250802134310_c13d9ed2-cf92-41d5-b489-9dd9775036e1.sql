-- Remove redundant columns that have client_* equivalents
-- Keep only the client_* prefixed columns for consistency

-- Drop redundant columns (these have client_* equivalents)
ALTER TABLE public.clients DROP COLUMN IF EXISTS first_name;
ALTER TABLE public.clients DROP COLUMN IF EXISTS last_name; 
ALTER TABLE public.clients DROP COLUMN IF EXISTS email;
ALTER TABLE public.clients DROP COLUMN IF EXISTS phone;
ALTER TABLE public.clients DROP COLUMN IF EXISTS city;
ALTER TABLE public.clients DROP COLUMN IF EXISTS zip_code;

-- Note: date_of_birth and state don't have client_* equivalents, so we keep them
-- The schema shows these are the main columns we should use:
-- - date_of_birth (no client_ equivalent)
-- - state (no client_ equivalent) 
-- - All other personal info should use client_* columns