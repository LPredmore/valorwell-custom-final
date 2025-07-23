-- Fix RLS security warnings for existing tables that don't have RLS enabled
-- Enable RLS on all existing tables that are missing it

-- Enable RLS on appointments table
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Enable RLS on clients table  
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Enable RLS on clinicians table
ALTER TABLE public.clinicians ENABLE ROW LEVEL SECURITY;

-- Enable RLS on cpt_codes table
ALTER TABLE public.cpt_codes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on icd10 table
ALTER TABLE public.icd10 ENABLE ROW LEVEL SECURITY;

-- Enable RLS on practiceinfo table
ALTER TABLE public.practiceinfo ENABLE ROW LEVEL SECURITY;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on CMS1500_claims table
ALTER TABLE public."CMS1500_claims" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for appointments
CREATE POLICY "Users can view appointments they are involved in" 
ON public.appointments 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT profile_id FROM public.clinicians WHERE id = appointments.clinician_id
    UNION
    SELECT profile_id FROM public.clients WHERE id = appointments.client_id
  )
);

CREATE POLICY "Clinicians can create appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT profile_id FROM public.clinicians WHERE id = appointments.clinician_id
  )
);

CREATE POLICY "Users can update their own appointments" 
ON public.appointments 
FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT profile_id FROM public.clinicians WHERE id = appointments.clinician_id
    UNION
    SELECT profile_id FROM public.clients WHERE id = appointments.client_id
  )
);

CREATE POLICY "Clinicians can delete appointments" 
ON public.appointments 
FOR DELETE 
USING (
  auth.uid() IN (
    SELECT profile_id FROM public.clinicians WHERE id = appointments.clinician_id
  )
);

-- Create RLS policies for clients
CREATE POLICY "Clinicians can view all clients" 
ON public.clients 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'clinician'
  )
);

CREATE POLICY "Clients can view their own record" 
ON public.clients 
FOR SELECT 
USING (auth.uid() = profile_id);

CREATE POLICY "Clinicians can create clients" 
ON public.clients 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'clinician'
  )
);

CREATE POLICY "Clinicians can update clients" 
ON public.clients 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'clinician'
  )
);

-- Create RLS policies for clinicians
CREATE POLICY "Users can view all clinicians" 
ON public.clinicians 
FOR SELECT 
USING (true);

CREATE POLICY "Clinicians can update their own record" 
ON public.clinicians 
FOR UPDATE 
USING (auth.uid() = profile_id);

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "New users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create policies for public read access to reference tables
CREATE POLICY "Anyone can view CPT codes" 
ON public.cpt_codes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view ICD10 codes" 
ON public.icd10 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view practice info" 
ON public.practiceinfo 
FOR SELECT 
USING (true);

-- Restrict write access to reference tables to admins only
CREATE POLICY "Only admins can modify CPT codes" 
ON public.cpt_codes 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Only admins can modify practice info" 
ON public.practiceinfo 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create policies for CMS1500_claims
CREATE POLICY "Clinicians can view their claims" 
ON public."CMS1500_claims" 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.appointments a
    JOIN public.clinicians c ON a.clinician_id = c.id
    WHERE a.id = "CMS1500_claims".appointment_id AND c.profile_id = auth.uid()
  )
);

CREATE POLICY "Clinicians can create claims" 
ON public."CMS1500_claims" 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.appointments a
    JOIN public.clinicians c ON a.clinician_id = c.id
    WHERE a.id = "CMS1500_claims".appointment_id AND c.profile_id = auth.uid()
  )
);

-- Fix the function search path issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;