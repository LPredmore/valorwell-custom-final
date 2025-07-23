
-- Update the handle_new_user trigger function with comprehensive logging
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role text;
  user_password text;
  profile_insert_result record;
  clinician_insert_result record;
BEGIN
  -- Log the start of the function
  RAISE LOG '[TRIGGER_HANDLE_NEW_USER] Function started for user_id: %, email: %', NEW.id, NEW.email;
  
  -- Extract role from user metadata, default to 'client'
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'client');
  RAISE LOG '[TRIGGER_HANDLE_NEW_USER] Extracted role from metadata: % (raw: %)', user_role, NEW.raw_user_meta_data;
  
  -- Extract password from user metadata (for invited users)
  user_password := NEW.raw_user_meta_data->>'password';
  RAISE LOG '[TRIGGER_HANDLE_NEW_USER] Extracted password from metadata: %', 
    CASE WHEN user_password IS NOT NULL THEN 'present (length: ' || length(user_password) || ')' ELSE 'null' END;
  
  -- Log the data we're about to insert into profiles
  RAISE LOG '[TRIGGER_HANDLE_NEW_USER] Preparing to insert into profiles table with data: id=%, email=%, first_name=%, last_name=%, role=%, password=%',
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    user_role,
    CASE WHEN user_password IS NOT NULL THEN 'present' ELSE 'null' END;
  
  -- Insert into profiles table with all available data
  BEGIN
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
    ) RETURNING * INTO profile_insert_result;
    
    RAISE LOG '[TRIGGER_HANDLE_NEW_USER] Successfully inserted into profiles table: id=%, email=%, role=%', 
      profile_insert_result.id, profile_insert_result.email, profile_insert_result.role;
      
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG '[TRIGGER_HANDLE_NEW_USER] ERROR inserting into profiles table: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
    RAISE;
  END;
  
  -- If the user is a clinician, also create a clinicians entry
  IF user_role = 'clinician' THEN
    RAISE LOG '[TRIGGER_HANDLE_NEW_USER] User role is clinician, preparing to insert into clinicians table';
    
    BEGIN
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
      ) RETURNING * INTO clinician_insert_result;
      
      RAISE LOG '[TRIGGER_HANDLE_NEW_USER] Successfully inserted into clinicians table: id=%, profile_id=%', 
        clinician_insert_result.id, clinician_insert_result.profile_id;
        
    EXCEPTION WHEN OTHERS THEN
      RAISE LOG '[TRIGGER_HANDLE_NEW_USER] ERROR inserting into clinicians table: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
      RAISE;
    END;
  ELSE
    RAISE LOG '[TRIGGER_HANDLE_NEW_USER] User role is %, skipping clinicians table insert', user_role;
  END IF;
  
  RAISE LOG '[TRIGGER_HANDLE_NEW_USER] Function completed successfully for user_id: %', NEW.id;
  RETURN NEW;
  
EXCEPTION WHEN OTHERS THEN
  RAISE LOG '[TRIGGER_HANDLE_NEW_USER] FATAL ERROR in trigger function: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
  RAISE;
END;
$$;

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add some additional logging for debugging
RAISE LOG '[TRIGGER_SETUP] handle_new_user trigger function updated with comprehensive logging';
