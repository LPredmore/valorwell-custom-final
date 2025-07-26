
-- Create a table to store completed form submissions
CREATE TABLE public.form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL,
  client_id UUID NOT NULL,
  clinician_id UUID NOT NULL,
  appointment_id UUID,
  form_data JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for form submissions
CREATE POLICY "Clinicians can create form submissions" 
  ON public.form_submissions 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clinicians 
      WHERE clinicians.id = form_submissions.clinician_id 
      AND clinicians.profile_id = auth.uid()
    )
  );

CREATE POLICY "Clinicians can view their form submissions" 
  ON public.form_submissions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM clinicians 
      WHERE clinicians.id = form_submissions.clinician_id 
      AND clinicians.profile_id = auth.uid()
    )
  );

CREATE POLICY "Clinicians can update their form submissions" 
  ON public.form_submissions 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM clinicians 
      WHERE clinicians.id = form_submissions.clinician_id 
      AND clinicians.profile_id = auth.uid()
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER form_submissions_updated_at 
  BEFORE UPDATE ON public.form_submissions 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();
