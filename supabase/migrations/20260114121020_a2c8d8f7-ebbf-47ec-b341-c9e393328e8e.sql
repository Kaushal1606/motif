-- Fix avatars table RLS policies

-- Drop the permissive INSERT policy
DROP POLICY IF EXISTS "Allow webhook inserts for avatars" ON public.avatars;

-- Create proper INSERT policy that only allows users to insert their own avatars
CREATE POLICY "Users can insert own avatars"
ON public.avatars
FOR INSERT
TO authenticated
WITH CHECK (auth.email() = user_email);

-- Ensure UPDATE policy exists and is correct (already exists but let's make sure)
DROP POLICY IF EXISTS "Users can update own avatars" ON public.avatars;
CREATE POLICY "Users can update own avatars"
ON public.avatars
FOR UPDATE
TO authenticated
USING (auth.email() = user_email)
WITH CHECK (auth.email() = user_email);

-- Add DELETE policy for own avatars
CREATE POLICY "Users can delete own avatars"
ON public.avatars
FOR DELETE
TO authenticated
USING (auth.email() = user_email);

-- Fix user_credits table RLS policies

-- Drop permissive INSERT policy
DROP POLICY IF EXISTS "Allow credit inserts" ON public.user_credits;

-- Drop UPDATE policy for authenticated users
DROP POLICY IF EXISTS "Users can update own credits" ON public.user_credits;

-- SELECT policy already exists and is correct, but let's ensure it
DROP POLICY IF EXISTS "Users can view own credits" ON public.user_credits;
CREATE POLICY "Users can view own credits"
ON public.user_credits
FOR SELECT
TO authenticated
USING (auth.email() = user_email);

-- INSERT only allowed for service role (handled by Supabase - service role bypasses RLS)
-- No INSERT policy for authenticated users means they can't insert

-- UPDATE only allowed for service role (handled by Supabase - service role bypasses RLS)
-- No UPDATE policy for authenticated users means they can't update