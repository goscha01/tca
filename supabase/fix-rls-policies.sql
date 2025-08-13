-- Fix RLS Policies for TCA Application
-- This should resolve the 406 error

-- First, let's see what policies currently exist
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users';

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Auth trigger can insert users" ON public.users;
DROP POLICY IF EXISTS "Trigger function can insert users" ON public.users;

-- Recreate the policies with proper syntax
-- Policy for users to view their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Policy for users to update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Policy for users to insert their own profile (if needed)
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy to allow the trigger function to insert users
CREATE POLICY "Trigger function can insert users" ON public.users
    FOR INSERT WITH CHECK (true);

-- Verify the policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users';

-- Test if the policies work by checking what the current user can see
SELECT 
    'Testing RLS policies:' as message,
    COUNT(*) as visible_rows
FROM public.users;
