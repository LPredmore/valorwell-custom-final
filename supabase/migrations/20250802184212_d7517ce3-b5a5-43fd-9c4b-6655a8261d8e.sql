-- Add SSN column to clients table
ALTER TABLE public.clients 
ADD COLUMN client_ssn text;