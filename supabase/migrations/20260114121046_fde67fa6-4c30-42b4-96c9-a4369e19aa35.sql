-- Fix scenes table RLS policies
DROP POLICY IF EXISTS "Allow webhook inserts for scenes" ON public.scenes;

-- Users can insert their own scenes
CREATE POLICY "Users can insert own scenes"
ON public.scenes
FOR INSERT
TO authenticated
WITH CHECK (auth.email() = user_email);

-- Add DELETE policy for own scenes
CREATE POLICY "Users can delete own scenes"
ON public.scenes
FOR DELETE
TO authenticated
USING (auth.email() = user_email);

-- Fix videos table RLS policies
DROP POLICY IF EXISTS "Allow webhook inserts for videos" ON public.videos;

-- Videos INSERT should only be allowed via service role (for webhooks)
-- No INSERT policy for authenticated users means they can't insert directly

-- Add DELETE policy for own videos
CREATE POLICY "Users can delete own videos"
ON public.videos
FOR DELETE
TO authenticated
USING (scene_id IN (
  SELECT scenes.id FROM scenes WHERE scenes.user_email = auth.email()
));