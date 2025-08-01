-- Create storage bucket for clinician profile images
INSERT INTO storage.buckets (id, name, public) VALUES ('clinician-avatars', 'clinician-avatars', true);

-- Create RLS policies for clinician avatar uploads
CREATE POLICY "Clinicians can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'clinician-avatars' AND auth.uid() IN (
  SELECT profile_id FROM clinicians WHERE id::text = (storage.foldername(name))[1]
));

CREATE POLICY "Anyone can view clinician avatars" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'clinician-avatars');

CREATE POLICY "Clinicians can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'clinician-avatars' AND auth.uid() IN (
  SELECT profile_id FROM clinicians WHERE id::text = (storage.foldername(name))[1]
));

CREATE POLICY "Clinicians can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'clinician-avatars' AND auth.uid() IN (
  SELECT profile_id FROM clinicians WHERE id::text = (storage.foldername(name))[1]
));