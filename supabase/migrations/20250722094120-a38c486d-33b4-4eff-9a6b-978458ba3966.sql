-- Add 'admin' to existing user_role enum
ALTER TYPE user_role ADD VALUE 'admin';

-- Create user profiles table with new location columns
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name text,
  last_name text,
  email text,
  phone text,
  date_of_birth DATE,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create RPC function to get user profile
CREATE OR REPLACE FUNCTION public.get_user_profile()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT row_to_json(profiles.*)
  FROM public.profiles
  WHERE id = auth.uid();
$$;

-- Create RPC function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Create RPC function to update user profile (includes new location fields)
CREATE OR REPLACE FUNCTION public.update_user_profile(profile_data json)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_profile profiles%ROWTYPE;
BEGIN
  UPDATE public.profiles
  SET 
    first_name = COALESCE((profile_data->>'first_name')::text, first_name),
    last_name = COALESCE((profile_data->>'last_name')::text, last_name),
    phone = COALESCE((profile_data->>'phone')::text, phone),
    date_of_birth = COALESCE((profile_data->>'date_of_birth')::date, date_of_birth),
    city = COALESCE((profile_data->>'city')::text, city),
    state = COALESCE((profile_data->>'state')::text, state),
    zip_code = COALESCE((profile_data->>'zip_code')::text, zip_code),
    updated_at = now()
  WHERE id = auth.uid()
  RETURNING * INTO updated_profile;
  
  RETURN row_to_json(updated_profile);
END;
$$;

-- Profiles RLS policies
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

CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- User roles RLS policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage user roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email
  );
  
  -- Assign default clinician role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'clinician');
  
  RETURN NEW;
END;
$$;

-- Create trigger to run the function on user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Drop duplicate columns from clients table
ALTER TABLE public.clients
DROP COLUMN IF EXISTS client_date_of_birth,
DROP COLUMN IF EXISTS client_city,
DROP COLUMN IF EXISTS client_state,
DROP COLUMN IF EXISTS client_zip_code,
DROP COLUMN IF EXISTS client_address;