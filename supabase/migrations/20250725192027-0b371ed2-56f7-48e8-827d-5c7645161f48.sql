-- Create the missing trigger for appointment audit logging
CREATE TRIGGER appointment_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.log_appointment_changes();