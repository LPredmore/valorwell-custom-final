-- Create function to calculate client age from date of birth
CREATE OR REPLACE FUNCTION public.calculate_client_age(birth_date date)
RETURNS integer AS $$
BEGIN
  -- Return null if birth_date is null
  IF birth_date IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Calculate age in years using PostgreSQL's age function
  RETURN EXTRACT(YEAR FROM age(current_date, birth_date))::integer;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create trigger function to update client age
CREATE OR REPLACE FUNCTION public.update_client_age()
RETURNS trigger AS $$
BEGIN
  -- Calculate and set the client_age based on date_of_birth
  NEW.client_age := public.calculate_client_age(NEW.date_of_birth);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on clients table to automatically update age
CREATE TRIGGER trigger_update_client_age
  BEFORE INSERT OR UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_client_age();