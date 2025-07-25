-- Remove redundant email columns from clients and clinicians tables
ALTER TABLE public.clients DROP COLUMN email RESTRICT;
ALTER TABLE public.clinicians DROP COLUMN email RESTRICT;