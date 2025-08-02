-- Fix security warnings by setting search_path for functions

-- Update calculate_client_age function with proper search_path
CREATE OR REPLACE FUNCTION public.calculate_client_age(birth_date date)
RETURNS integer 
LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE
SET search_path = ''
AS $$
BEGIN
  -- Return null if birth_date is null
  IF birth_date IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Calculate age in years using PostgreSQL's age function
  RETURN EXTRACT(YEAR FROM age(current_date, birth_date))::integer;
END;
$$;

-- Update trigger function with proper search_path
CREATE OR REPLACE FUNCTION public.update_client_age()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Calculate and set the client_age based on date_of_birth
  NEW.client_age := public.calculate_client_age(NEW.date_of_birth);
  
  RETURN NEW;
END;
$$;