
-- Drop the trigger that automatically creates profiles when a user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the handle_new_user function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Remove any other related functions/triggers
DROP FUNCTION IF EXISTS public.has_role(uuid, user_role);
DROP FUNCTION IF EXISTS public.is_assigned_clinician(uuid);
DROP FUNCTION IF EXISTS public.get_current_user_role();
DROP FUNCTION IF EXISTS public.get_user_role();
DROP FUNCTION IF EXISTS public.get_user_profile();
DROP FUNCTION IF EXISTS public.update_user_profile(json);
