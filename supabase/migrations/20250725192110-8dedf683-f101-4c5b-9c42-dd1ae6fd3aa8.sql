-- Fix the log_appointment_changes function with explicit schema references
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
$function$