-- Create storage policies for projeto-images bucket
-- Allow authenticated users to upload images
CREATE POLICY "Users can upload project images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'projeto-images' AND 
  auth.uid() IS NOT NULL
);

-- Allow public read access (since bucket is already public)
CREATE POLICY "Anyone can view project images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'projeto-images');

-- Allow users to update their own uploaded images
CREATE POLICY "Users can update their own project images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'projeto-images' AND 
  auth.uid() IS NOT NULL
);

-- Allow users to delete their own uploaded images
CREATE POLICY "Users can delete their own project images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'projeto-images' AND 
  auth.uid() IS NOT NULL
);