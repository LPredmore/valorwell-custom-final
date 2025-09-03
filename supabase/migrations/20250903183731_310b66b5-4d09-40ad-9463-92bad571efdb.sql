-- Insert client user zzzBobby Bouche with assigned therapist
INSERT INTO clients (
  id,
  first_name,
  last_name,
  email,
  assigned_therapist,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'zzzBobby',
  'Bouche',
  'predmoreluke+bobby@gmail.com',
  'Luke Predmore, BA',
  'active',
  NOW(),
  NOW()
);