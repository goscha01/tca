-- Diagnose 406 Error for TCA Application
-- Run this in your Supabase SQL Editor

-- 1. Check if the users table exists and has the right structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- 2. Check RLS policies on the users table
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

-- 3. Check if RLS is enabled on the users table
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'users';

-- 4. Check if the current user has access to the users table
SELECT current_user, session_user;

-- 5. Test a simple query to see if basic access works
SELECT COUNT(*) FROM public.users;

-- 6. Check if there are any users in the table
SELECT id, email, company_name, created_at 
FROM public.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 7. Check the trigger function
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 8. Check if the trigger exists
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 9. Test the RLS policies by checking what the current user can see
-- This will help identify if RLS is blocking access
SELECT 
    'Current user can see this many rows:' as message,
    COUNT(*) as row_count
FROM public.users;
