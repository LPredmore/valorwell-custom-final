-- First update empty strings to NULL
UPDATE public.clients 
SET client_status = NULL 
WHERE client_status = '';

-- Now change the type
ALTER TABLE public.clients 
ALTER COLUMN client_status DROP DEFAULT;

ALTER TABLE public.clients 
ALTER COLUMN client_status TYPE client_status USING 
  CASE 
    WHEN client_status IS NULL THEN 'New'::client_status
    ELSE client_status::client_status
  END;

ALTER TABLE public.clients 
ALTER COLUMN client_status SET DEFAULT 'New'::client_status;