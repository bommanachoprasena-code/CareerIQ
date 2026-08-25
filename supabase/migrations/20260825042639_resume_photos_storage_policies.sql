/*
# Storage policies for resume-photos bucket

1. Purpose
   Allow each authenticated user to upload/read/update/delete their own
   profile photo in the public "resume-photos" bucket. Files are stored
   under a path prefixed with the user's id (e.g. "<user_id>/profile.jpg"),
   so ownership is enforced by matching the first path segment to auth.uid().

2. Security
   - SELECT (public read): anyone can read the photo since the bucket is
     public and photos are meant to be displayed on resumes.
   - INSERT/UPDATE/DELETE: only the owner (first path segment = auth.uid()).
*/

DROP POLICY IF EXISTS "read_resume_photos" ON storage.objects;
CREATE POLICY "read_resume_photos" ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'resume-photos');

DROP POLICY IF EXISTS "insert_own_resume_photo" ON storage.objects;
CREATE POLICY "insert_own_resume_photo" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resume-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "update_own_resume_photo" ON storage.objects;
CREATE POLICY "update_own_resume_photo" ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resume-photos' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'resume-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "delete_own_resume_photo" ON storage.objects;
CREATE POLICY "delete_own_resume_photo" ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'resume-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
