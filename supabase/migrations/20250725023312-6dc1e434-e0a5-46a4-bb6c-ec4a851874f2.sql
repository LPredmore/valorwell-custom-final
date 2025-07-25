-- Add personal information columns to clients table at the beginning
ALTER TABLE public.clients 
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT,
ADD COLUMN email TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN date_of_birth DATE,
ADD COLUMN city TEXT,
ADD COLUMN state TEXT,
ADD COLUMN zip_code TEXT;

-- Add personal information columns to clinicians table at the beginning  
ALTER TABLE public.clinicians
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT,
ADD COLUMN email TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN date_of_birth DATE,
ADD COLUMN city TEXT,
ADD COLUMN state TEXT,
ADD COLUMN zip_code TEXT;