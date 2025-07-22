
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Clinicians can view assigned clients' profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

DROP POLICY IF EXISTS "Clients can view their own client record" ON public.clients;
DROP POLICY IF EXISTS "Clients can update their own client record" ON public.clients;
DROP POLICY IF EXISTS "Clients can insert their own client record" ON public.clients;
DROP POLICY IF EXISTS "Assigned clinicians can view their clients" ON public.clients;
DROP POLICY IF EXISTS "Assigned clinicians can update their clients" ON public.clients;
DROP POLICY IF EXISTS "Clinicians can insert client records" ON public.clients;
DROP POLICY IF EXISTS "Admins can view all clients" ON public.clients;
DROP POLICY IF EXISTS "Admins can update all clients" ON public.clients;
DROP POLICY IF EXISTS "Admins can insert client records" ON public.clients;

DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Clinicians can insert appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can view all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can update all appointments" ON public.appointments;

DROP POLICY IF EXISTS "Clinicians can view their own record" ON public.clinicians;
DROP POLICY IF EXISTS "Clinicians can update their own record" ON public.clinicians;
DROP POLICY IF EXISTS "Clinicians can insert their own record" ON public.clinicians;
DROP POLICY IF EXISTS "Admins can view all clinicians" ON public.clinicians;
DROP POLICY IF EXISTS "Admins can update all clinicians" ON public.clinicians;

DROP POLICY IF EXISTS "Authenticated users can view CPT codes" ON public.cpt_codes;
DROP POLICY IF EXISTS "Authenticated users can view ICD10 codes" ON public.icd10;
DROP POLICY IF EXISTS "Authenticated users can view practice info" ON public.practiceinfo;

DROP POLICY IF EXISTS "Clinicians can view all claims" ON public.CMS1500_claims;
DROP POLICY IF EXISTS "Clinicians can insert claims" ON public.CMS1500_claims;
DROP POLICY IF EXISTS "Clinicians can update claims" ON public.CMS1500_claims;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.has_role(uuid, user_role);
DROP FUNCTION IF EXISTS public.is_assigned_clinician(uuid);

-- Add role column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'client';

-- Update the handle_new_user function to properly use the role column
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role text;
BEGIN
  -- Extract role from user metadata, default to 'client'
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'client');
  
  -- Insert into profiles table with all available data
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    user_role::user_role,
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create helper function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role = _role FROM public.profiles WHERE id = _user_id;
$$;

-- Create helper function to check if current user is assigned clinician for a client
CREATE OR REPLACE FUNCTION public.is_assigned_clinician(_client_profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.clients 
    WHERE profile_id = _client_profile_id 
    AND client_assigned_therapist = auth.uid()
  );
$$;

-- Enable RLS on all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cpt_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.icd10 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practiceinfo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.CMS1500_claims ENABLE ROW LEVEL SECURITY;

-- Profiles table RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Clinicians can view assigned clients' profiles"
  ON public.profiles
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'clinician') AND 
    public.is_assigned_clinician(id)
  );

CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Clients table RLS policies
CREATE POLICY "Clients can view their own client record"
  ON public.clients
  FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Clients can update their own client record"
  ON public.clients
  FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Clients can insert their own client record"
  ON public.clients
  FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Assigned clinicians can view their clients"
  ON public.clients
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'clinician') AND 
    client_assigned_therapist = auth.uid()
  );

CREATE POLICY "Assigned clinicians can update their clients"
  ON public.clients
  FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'clinician') AND 
    client_assigned_therapist = auth.uid()
  );

CREATE POLICY "Clinicians can insert client records"
  ON public.clients
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'clinician'));

CREATE POLICY "Admins can view all clients"
  ON public.clients
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all clients"
  ON public.clients
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert client records"
  ON public.clients
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Appointments table RLS policies
CREATE POLICY "Users can view their own appointments"
  ON public.appointments
  FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = clinician_id);

CREATE POLICY "Users can update their own appointments"
  ON public.appointments
  FOR UPDATE
  USING (auth.uid() = client_id OR auth.uid() = clinician_id);

CREATE POLICY "Clinicians can insert appointments"
  ON public.appointments
  FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'clinician') OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can view all appointments"
  ON public.appointments
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all appointments"
  ON public.appointments
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Clinicians table RLS policies
CREATE POLICY "Clinicians can view their own record"
  ON public.clinicians
  FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Clinicians can update their own record"
  ON public.clinicians
  FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Clinicians can insert their own record"
  ON public.clinicians
  FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Admins can view all clinicians"
  ON public.clinicians
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all clinicians"
  ON public.clinicians
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Reference tables - allow read access to authenticated users
CREATE POLICY "Authenticated users can view CPT codes"
  ON public.cpt_codes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view ICD10 codes"
  ON public.icd10
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view practice info"
  ON public.practiceinfo
  FOR SELECT
  TO authenticated
  USING (true);

-- Claims table - clinicians and admins only
CREATE POLICY "Clinicians can view all claims"
  ON public.CMS1500_claims
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'clinician') OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Clinicians can insert claims"
  ON public.CMS1500_claims
  FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'clinician') OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Clinicians can update claims"
  ON public.CMS1500_claims
  FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'clinician') OR 
    public.has_role(auth.uid(), 'admin')
  );
