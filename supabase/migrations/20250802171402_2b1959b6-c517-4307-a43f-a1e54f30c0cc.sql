-- Create insurance_type enum first
CREATE TYPE insurance_type AS ENUM (
  'primary',
  'secondary',
  'tertiary'
);

-- Create client_insurance table to handle primary and secondary insurance data
CREATE TABLE public.client_insurance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  insurance_type insurance_type NOT NULL DEFAULT 'primary',
  insurance_company_id UUID,
  
  -- Patient-specific insurance information
  policy_number TEXT,
  group_number TEXT,
  member_id TEXT,
  subscriber_name TEXT,
  subscriber_relationship TEXT DEFAULT 'Self',
  subscriber_date_of_birth DATE,
  subscriber_address_line1 TEXT,
  subscriber_address_line2 TEXT,
  subscriber_city TEXT,
  subscriber_state TEXT,
  subscriber_zip TEXT,
  
  -- Insurance plan details
  plan_name TEXT,
  plan_type TEXT,
  copay_amount NUMERIC,
  
  -- Additional fields based on insurance_accepted requirements
  phone_number TEXT,
  website TEXT,
  claims_address_line1 TEXT,
  claims_address_line2 TEXT,
  claims_city TEXT,
  claims_state TEXT,
  claims_zip TEXT,
  
  -- Special conditions and authorizations
  signature_on_file BOOLEAN DEFAULT false,
  authorization_payment BOOLEAN DEFAULT false,
  health_benefit_plan_indicator TEXT,
  
  -- Patient condition fields
  condition_employment BOOLEAN DEFAULT false,
  condition_auto_accident BOOLEAN DEFAULT false,
  condition_other_accident BOOLEAN DEFAULT false,
  
  -- Other insured information
  other_insured_name TEXT,
  other_insured_date_of_birth DATE,
  other_insured_sex TEXT,
  other_insured_employer_school_name TEXT,
  other_insured_plan_program_name TEXT,
  other_insured_policy_group_number TEXT,
  
  -- Additional insurance details
  insurance_plan_program_name TEXT,
  insured_employer_school_name TEXT,
  insured_sex TEXT,
  
  -- Notes and additional information
  notes TEXT,
  
  -- Metadata
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.client_insurance 
ADD CONSTRAINT client_insurance_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

ALTER TABLE public.client_insurance 
ADD CONSTRAINT client_insurance_insurance_company_id_fkey 
FOREIGN KEY (insurance_company_id) REFERENCES public.insurance_companies(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_client_insurance_client_id ON public.client_insurance(client_id);
CREATE INDEX idx_client_insurance_type ON public.client_insurance(client_id, insurance_type);

-- Enable Row Level Security
ALTER TABLE public.client_insurance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Clients can view their own insurance" 
ON public.client_insurance 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM clients 
    WHERE clients.id = client_insurance.client_id 
    AND clients.profile_id = auth.uid()
  )
);

CREATE POLICY "Clients can update their own insurance" 
ON public.client_insurance 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM clients 
    WHERE clients.id = client_insurance.client_id 
    AND clients.profile_id = auth.uid()
  )
);

CREATE POLICY "Clients can insert their own insurance" 
ON public.client_insurance 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM clients 
    WHERE clients.id = client_insurance.client_id 
    AND clients.profile_id = auth.uid()
  )
);

CREATE POLICY "Clients can delete their own insurance" 
ON public.client_insurance 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM clients 
    WHERE clients.id = client_insurance.client_id 
    AND clients.profile_id = auth.uid()
  )
);

CREATE POLICY "Clinicians and admins can view all client insurance" 
ON public.client_insurance 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('clinician', 'admin')
  )
);

CREATE POLICY "Clinicians and admins can modify all client insurance" 
ON public.client_insurance 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('clinician', 'admin')
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('clinician', 'admin')
  )
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_client_insurance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_client_insurance_updated_at_trigger
  BEFORE UPDATE ON public.client_insurance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_client_insurance_updated_at();