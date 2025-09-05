-- Create client user zzzBobby Bouche with assigned therapist
DO $$
DECLARE
    profile_uuid uuid := gen_random_uuid();
    client_uuid uuid := gen_random_uuid();
BEGIN
    -- Insert into profiles table
    INSERT INTO public.profiles (
        id,
        email,
        role,
        created_at,
        updated_at
    ) VALUES (
        profile_uuid,
        'predmoreluke+bobby@gmail.com',
        ARRAY['client'::public.user_role],
        NOW(),
        NOW()
    );
    
    -- Insert into clients table
    INSERT INTO public.clients (
        id,
        profile_id,
        first_name,
        last_name,
        client_first_name,
        client_last_name,
        email,
        client_email,
        assigned_therapist,
        created_at,
        updated_at
    ) VALUES (
        client_uuid,
        profile_uuid,
        'zzzBobby',
        'Bouche',
        'zzzBobby',
        'Bouche',
        'predmoreluke+bobby@gmail.com',
        'predmoreluke+bobby@gmail.com',
        '888aa79a-bb69-4196-a219-9ac47cc297fe',
        NOW(),
        NOW()
    );
    
    RAISE NOTICE 'Successfully created client zzzBobby Bouche with ID: % and assigned therapist Lucas Predmore', client_uuid;
END $$;