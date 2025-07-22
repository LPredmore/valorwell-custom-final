
-- Drop the existing function that has the wrong type reference
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Recreate the function with proper user_role enum reference
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role text;
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
    password,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    user_role::user_role,
    NEW.encrypted_password,
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
