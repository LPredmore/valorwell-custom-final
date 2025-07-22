
-- Fix the clinicians table structure and create trigger for automatic profile/clinician creation

-- First, ensure clinicians.profile_id has proper foreign key and is NOT NULL
ALTER TABLE public.clinicians 
ADD CONSTRAINT fk_clinicians_profile_id 
FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Make profile_id NOT NULL (after we ensure all existing records have values)
UPDATE public.clinicians 
SET profile_id = id 
WHERE profile_id IS NULL;

ALTER TABLE public.clinicians 
ALTER COLUMN profile_id SET NOT NULL;

-- Ensure clinicians.id has proper default
ALTER TABLE public.clinicians 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Create trigger function to handle new user registration with automatic profile and clinician creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role text;
  new_profile_id uuid;
BEGIN
  -- Extract role from user metadata, default to 'client'
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'client');
  
  -- Insert into profiles table with all available data
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    user_role::user_role,
    NOW(),
    NOW()
  );
  
  -- If the user is a clinician, also create a clinicians entry
  IF user_role = 'clinician' THEN
    INSERT INTO public.clinicians (
      id,
      profile_id,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      NEW.id,  -- This links to the profile via profile_id
      NOW(),
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile (and clinician if needed) when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
