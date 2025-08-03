-- First drop the default, then change the type, then add the default back
ALTER TABLE public.clients 
ALTER COLUMN client_status DROP DEFAULT;

ALTER TABLE public.clients 
ALTER COLUMN client_status TYPE client_status USING client_status::client_status;

ALTER TABLE public.clients 
ALTER COLUMN client_status SET DEFAULT 'New'::client_status;