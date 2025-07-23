-- Create templates table for form templates
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  schema_json JSONB NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Create policies for template access
CREATE POLICY "Clinicians can view all templates" 
ON public.templates 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('clinician', 'admin')
));

CREATE POLICY "Clinicians can create templates" 
ON public.templates 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('clinician', 'admin')
) AND auth.uid() = created_by);

CREATE POLICY "Clinicians can update templates they created" 
ON public.templates 
FOR UPDATE 
USING (created_by = auth.uid() AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('clinician', 'admin')
));

CREATE POLICY "Clinicians can delete templates they created" 
ON public.templates 
FOR DELETE 
USING (created_by = auth.uid() AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('clinician', 'admin')
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();