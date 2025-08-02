-- Fix the state enum type error in handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  user_role text;
  user_password text;
  profile_insert_result record;
  clinician_insert_result record;
  client_insert_result record;
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
  
  -- Insert into profiles table with basic auth data only
  BEGIN
    INSERT INTO public.profiles (
      id,
      email,
      role,
      password,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.email,
      user_role::public.user_role,
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
        first_name,
        last_name,
        phone,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        NEW.id,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'phone',
        NOW(),
        NOW()
      ) RETURNING * INTO clinician_insert_result;
      
      RAISE LOG '[TRIGGER_HANDLE_NEW_USER] Successfully inserted into clinicians table: id=%, profile_id=%', 
        clinician_insert_result.id, clinician_insert_result.profile_id;
        
    EXCEPTION WHEN OTHERS THEN
      RAISE LOG '[TRIGGER_HANDLE_NEW_USER] ERROR inserting into clinicians table: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
      RAISE;
    END;
  
  -- If the user is a client, also create a clients entry
  ELSIF user_role = 'client' THEN
    RAISE LOG '[TRIGGER_HANDLE_NEW_USER] User role is client, preparing to insert into clients table';
    
    BEGIN
      INSERT INTO public.clients (
        id,
        profile_id,
        first_name,
        last_name,
        email,
        phone,
        state,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        NEW.id,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        (NEW.raw_user_meta_data->>'state')::public.states,
        NOW(),
        NOW()
      ) RETURNING * INTO client_insert_result;
      
      RAISE LOG '[TRIGGER_HANDLE_NEW_USER] Successfully inserted into clients table: id=%, profile_id=%', 
        client_insert_result.id, client_insert_result.profile_id;
        
    EXCEPTION WHEN OTHERS THEN
      RAISE LOG '[TRIGGER_HANDLE_NEW_USER] ERROR inserting into clients table: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
      RAISE;
    END;
  ELSE
    RAISE LOG '[TRIGGER_HANDLE_NEW_USER] User role is %, skipping additional table inserts', user_role;
  END IF;
  
  RAISE LOG '[TRIGGER_HANDLE_NEW_USER] Function completed successfully for user_id: %', NEW.id;
  RETURN NEW;
  
EXCEPTION WHEN OTHERS THEN
  RAISE LOG '[TRIGGER_HANDLE_NEW_USER] FATAL ERROR in trigger function: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
  RAISE;
END;
$function$;