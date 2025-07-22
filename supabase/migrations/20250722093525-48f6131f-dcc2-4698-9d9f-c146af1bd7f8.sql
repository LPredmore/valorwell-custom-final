-- Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN date_of_birth DATE,
ADD COLUMN city TEXT,
ADD COLUMN state TEXT,
ADD COLUMN zip_code TEXT;

-- Drop duplicate columns from clients table
ALTER TABLE public.clients
DROP COLUMN IF EXISTS client_date_of_birth,
DROP COLUMN IF EXISTS client_city,
DROP COLUMN IF EXISTS client_state,
DROP COLUMN IF EXISTS client_zip_code,
DROP COLUMN IF EXISTS client_address;

-- Note: clinicians table doesn't have these duplicate columns based on schema review