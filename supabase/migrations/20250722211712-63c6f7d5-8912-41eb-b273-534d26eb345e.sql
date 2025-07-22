-- Create specialty_type enum
CREATE TYPE specialty_type AS ENUM (
  'general_practice',
  'psychiatry', 
  'psychology',
  'counseling',
  'social_work',
  'marriage_family_therapy',
  'substance_abuse',
  'child_adolescent',
  'geriatric',
  'group_therapy',
  'neuropsychology',
  'behavioral_analysis'
);

-- Update cpt_codes table to use the enum
ALTER TABLE public.cpt_codes 
ALTER COLUMN specialty_type TYPE specialty_type USING specialty_type::specialty_type;