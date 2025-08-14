-- Diagnostic Script for Company Name Issue
-- Run this to see what's happening with company names

-- Check current users table structure
SELECT 'Current users table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check current user data
SELECT 'Current user data:' as info;
SELECT id, email, company_name, membership_tier, created_at, updated_at
FROM public.users
ORDER BY created_at DESC
LIMIT 10;

-- Check auth.users metadata
SELECT 'Auth users metadata:' as info;
SELECT id, email, raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- Check for users where company_name equals email
SELECT 'Users where company_name equals email:' as info;
SELECT id, email, company_name
FROM public.users
WHERE company_name = email
ORDER BY created_at DESC;

-- Check for problematic company names
SELECT 'Problematic company names:' as info;
SELECT company_name, COUNT(*) as count
FROM public.users
WHERE company_name IN ('New Company', 'Your Company', 'new company', 'your company', 'undefined')
   OR company_name IS NULL
   OR company_name = email
GROUP BY company_name
ORDER BY count DESC;

-- Check trigger status
SELECT 'Trigger status:' as info;
SELECT 
  trigger_name,
  event_manipulation,
  event_object_schema,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check function definition
SELECT 'Function definition:' as info;
SELECT pg_get_functiondef(oid) as function_definition
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Check RLS policies
SELECT 'RLS policies on users table:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'users';

