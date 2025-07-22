
-- Create storage buckets for practice branding
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('practice-logos', 'practice-logos', true),
  ('practice-banners', 'practice-banners', true);

-- Create RLS policies for practice-logos bucket
CREATE POLICY "Allow authenticated users to upload practice logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'practice-logos');

CREATE POLICY "Allow authenticated users to view practice logos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'practice-logos');

CREATE POLICY "Allow authenticated users to update practice logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'practice-logos');

CREATE POLICY "Allow authenticated users to delete practice logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'practice-logos');

-- Create RLS policies for practice-banners bucket
CREATE POLICY "Allow authenticated users to upload practice banners"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'practice-banners');

CREATE POLICY "Allow authenticated users to view practice banners"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'practice-banners');

CREATE POLICY "Allow authenticated users to update practice banners"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'practice-banners');

CREATE POLICY "Allow authenticated users to delete practice banners"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'practice-banners');
