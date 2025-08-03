-- Change client_status column from text to client_status enum
ALTER TABLE public.clients 
ALTER COLUMN client_status TYPE client_status USING client_status::client_status;