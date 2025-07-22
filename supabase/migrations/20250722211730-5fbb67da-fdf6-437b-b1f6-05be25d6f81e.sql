-- Update cpt_codes table to use the existing specialty_type enum
ALTER TABLE public.cpt_codes 
ALTER COLUMN specialty_type TYPE specialty_type USING 
  CASE 
    WHEN specialty_type = '' OR specialty_type IS NULL THEN 'general_practice'::specialty_type
    ELSE specialty_type::specialty_type
  END;