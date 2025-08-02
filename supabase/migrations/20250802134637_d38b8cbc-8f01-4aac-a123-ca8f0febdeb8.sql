-- Add missing client_* columns that are needed for basic client information
ALTER TABLE public.clients ADD COLUMN client_first_name text;
ALTER TABLE public.clients ADD COLUMN client_last_name text;
ALTER TABLE public.clients ADD COLUMN client_email text;
ALTER TABLE public.clients ADD COLUMN client_phone text;
ALTER TABLE public.clients ADD COLUMN client_city text;
ALTER TABLE public.clients ADD COLUMN client_zip_code text;