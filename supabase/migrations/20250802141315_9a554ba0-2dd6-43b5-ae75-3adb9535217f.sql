-- Create insurance companies table to store master list of insurance providers
CREATE TABLE public.insurance_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  payer_id TEXT,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create insurance accepted table to store insurance plans the practice accepts
CREATE TABLE public.insurance_accepted (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insurance_company_id UUID NOT NULL REFERENCES public.insurance_companies(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  payer_id TEXT,
  group_number TEXT,
  phone_number TEXT,
  website TEXT,
  claims_address_line1 TEXT,
  claims_address_line2 TEXT,
  claims_city TEXT,
  claims_state TEXT,
  claims_zip TEXT,
  electronic_claims_supported BOOLEAN NOT NULL DEFAULT false,
  prior_authorization_required BOOLEAN NOT NULL DEFAULT false,
  copay_amount NUMERIC,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.insurance_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_accepted ENABLE ROW LEVEL SECURITY;

-- Create policies for insurance_companies
CREATE POLICY "Anyone can view insurance companies" 
ON public.insurance_companies 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify insurance companies" 
ON public.insurance_companies 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::user_role
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::user_role
));

-- Create policies for insurance_accepted
CREATE POLICY "Anyone can view accepted insurance" 
ON public.insurance_accepted 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify accepted insurance" 
ON public.insurance_accepted 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::user_role
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::user_role
));

-- Create triggers for updated_at columns
CREATE TRIGGER update_insurance_companies_updated_at
BEFORE UPDATE ON public.insurance_companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_insurance_accepted_updated_at
BEFORE UPDATE ON public.insurance_accepted
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some common insurance companies
INSERT INTO public.insurance_companies (name, payer_id, is_custom) VALUES
('Aetna', '60054', false),
('Blue Cross Blue Shield', '61000', false),
('Cigna', '62308', false),
('UnitedHealthcare', '87726', false),
('Humana', '47269', false),
('Kaiser Permanente', '85134', false),
('Anthem', '60055', false),
('Medicaid', '00000', false),
('Medicare', '00001', false),
('Tricare', '00002', false);