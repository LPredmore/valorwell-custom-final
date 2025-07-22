
-- Update the handle_new_user trigger function to save the password from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role text;
  user_password text;
BEGIN
  -- Extract role from user metadata, default to 'client'
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'client');
  
  -- Extract password from user metadata (for invited users)
  user_password := NEW.raw_user_meta_data->>'password';
  
  -- Insert into profiles table with all available data
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    password,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    user_role::user_role,
    user_password,
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
