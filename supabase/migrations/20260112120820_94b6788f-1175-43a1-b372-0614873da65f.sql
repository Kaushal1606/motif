-- Fix overly permissive UPDATE policies on avatars table
DROP POLICY IF EXISTS "Allow updates on avatars" ON public.avatars;
CREATE POLICY "Users can update own avatars" ON public.avatars
  FOR UPDATE
  USING (auth.email() = user_email)
  WITH CHECK (auth.email() = user_email);

-- Fix overly permissive UPDATE policies on scenes table
DROP POLICY IF EXISTS "Allow updates on scenes" ON public.scenes;
CREATE POLICY "Users can update own scenes" ON public.scenes
  FOR UPDATE
  USING (auth.email() = user_email)
  WITH CHECK (auth.email() = user_email);

-- Fix overly permissive UPDATE policies on videos table
DROP POLICY IF EXISTS "Allow updates on videos" ON public.videos;
CREATE POLICY "Users can update own videos" ON public.videos
  FOR UPDATE
  USING (scene_id IN (SELECT id FROM scenes WHERE user_email = auth.email()))
  WITH CHECK (scene_id IN (SELECT id FROM scenes WHERE user_email = auth.email()));