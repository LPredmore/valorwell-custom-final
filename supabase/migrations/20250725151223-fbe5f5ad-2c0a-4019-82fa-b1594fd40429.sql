-- Enable RLS on appointment_types table
ALTER TABLE public.appointment_types ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view appointment types (since they're used for dropdowns)
CREATE POLICY "Anyone can view appointment types" 
ON public.appointment_types 
FOR SELECT 
USING (true);

-- Only admins can modify appointment types
CREATE POLICY "Only admins can modify appointment types" 
ON public.appointment_types 
FOR ALL 
USING (EXISTS ( 
  SELECT 1 
  FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'::user_role
))
WITH CHECK (EXISTS ( 
  SELECT 1 
  FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'::user_role
));