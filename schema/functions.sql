-- Database Functions
-- All custom functions and stored procedures

-- Check Appointment Conflicts Function
CREATE OR REPLACE FUNCTION public.check_appointment_conflicts(
  p_clinician_id uuid, 
  p_start_at timestamp with time zone, 
  p_end_at timestamp with time zone, 
  p_exclude_appointment_id uuid DEFAULT NULL::uuid
)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.appointments
    WHERE clinician_id = p_clinician_id
    AND status = 'scheduled'
    AND (p_exclude_appointment_id IS NULL OR id != p_exclude_appointment_id)
    AND (
      (start_at <= p_start_at AND end_at > p_start_at) OR
      (start_at < p_end_at AND end_at >= p_end_at) OR
      (start_at >= p_start_at AND end_at <= p_end_at)
    )
  );
END;
$function$;

-- Handle New User Trigger Function
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
  
  -- Insert into profiles table with all available data
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
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        NEW.id,
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
$function$;

-- Log Appointment Changes Trigger Function
CREATE OR REPLACE FUNCTION public.log_appointment_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.appointment_audit (appointment_id, action, new_data, changed_by)
    VALUES (NEW.id, 'created', row_to_json(NEW), COALESCE(auth.uid(), NEW.client_id));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.appointment_audit (appointment_id, action, old_data, new_data, changed_by)
    VALUES (NEW.id, 'updated', row_to_json(OLD), row_to_json(NEW), COALESCE(auth.uid(), NEW.client_id));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.appointment_audit (appointment_id, action, old_data, changed_by)
    VALUES (OLD.id, 'cancelled', row_to_json(OLD), COALESCE(auth.uid(), OLD.client_id));
    RETURN OLD;
  END IF;
  RETURN NULL;
EXCEPTION WHEN OTHERS THEN
  -- Log the error and continue to allow the appointment insert to succeed
  RAISE WARNING 'Failed to log appointment change: %', SQLERRM;
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Update Updated At Column Function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;