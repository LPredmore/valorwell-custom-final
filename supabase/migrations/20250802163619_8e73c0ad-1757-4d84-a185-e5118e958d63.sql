-- Update RLS policies to treat admin as having clinician permissions

-- Update insurance_accepted policies
DROP POLICY IF EXISTS "Only admins can modify accepted insurance" ON public.insurance_accepted;
CREATE POLICY "Admins and clinicians can modify accepted insurance" 
ON public.insurance_accepted 
FOR ALL 
USING (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('admin', 'clinician')
))
WITH CHECK (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('admin', 'clinician')
));

-- Update insurance_companies policies  
DROP POLICY IF EXISTS "Only admins can modify insurance companies" ON public.insurance_companies;
CREATE POLICY "Admins and clinicians can modify insurance companies" 
ON public.insurance_companies 
FOR ALL 
USING (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('admin', 'clinician')
))
WITH CHECK (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('admin', 'clinician')
));

-- Update templates policies to allow both admins and clinicians
DROP POLICY IF EXISTS "Clinicians can create templates" ON public.templates;
DROP POLICY IF EXISTS "Clinicians can delete templates they created" ON public.templates;
DROP POLICY IF EXISTS "Clinicians can update templates they created" ON public.templates;
DROP POLICY IF EXISTS "Clinicians can view all templates" ON public.templates;

CREATE POLICY "Clinicians and admins can create templates" 
ON public.templates 
FOR INSERT 
WITH CHECK ((EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('clinician', 'admin')
)) AND (auth.uid() = created_by));

CREATE POLICY "Clinicians and admins can delete templates they created" 
ON public.templates 
FOR DELETE 
USING ((created_by = auth.uid()) AND (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('clinician', 'admin')
)));

CREATE POLICY "Clinicians and admins can update templates they created" 
ON public.templates 
FOR UPDATE 
USING ((created_by = auth.uid()) AND (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('clinician', 'admin')
)));

CREATE POLICY "Clinicians and admins can view all templates" 
ON public.templates 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('clinician', 'admin')
));

-- Update clients policies
DROP POLICY IF EXISTS "Clinicians can create clients" ON public.clients;
DROP POLICY IF EXISTS "Clinicians can update clients" ON public.clients;
DROP POLICY IF EXISTS "Clinicians can view all clients" ON public.clients;

CREATE POLICY "Clinicians and admins can create clients" 
ON public.clients 
FOR INSERT 
WITH CHECK (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('clinician', 'admin')
));

CREATE POLICY "Clinicians and admins can update clients" 
ON public.clients 
FOR UPDATE 
USING (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('clinician', 'admin')
));

CREATE POLICY "Clinicians and admins can view all clients" 
ON public.clients 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role IN ('clinician', 'admin')
));

-- Update form_submissions policies
DROP POLICY IF EXISTS "Clinicians can create form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Clinicians can update their form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Clinicians can view their form submissions" ON public.form_submissions;

CREATE POLICY "Clinicians and admins can create form submissions" 
ON public.form_submissions 
FOR INSERT 
WITH CHECK (EXISTS ( 
  SELECT 1 FROM clinicians 
  WHERE clinicians.id = form_submissions.clinician_id 
  AND clinicians.profile_id = auth.uid()
) OR EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE POLICY "Clinicians and admins can update form submissions" 
ON public.form_submissions 
FOR UPDATE 
USING (EXISTS ( 
  SELECT 1 FROM clinicians 
  WHERE clinicians.id = form_submissions.clinician_id 
  AND clinicians.profile_id = auth.uid()
) OR EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE POLICY "Clinicians and admins can view form submissions" 
ON public.form_submissions 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1 FROM clinicians 
  WHERE clinicians.id = form_submissions.clinician_id 
  AND clinicians.profile_id = auth.uid()
) OR EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));