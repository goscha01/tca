-- Database Diagnostic Script for TCA
-- Run this to see what's currently in your database

-- Check if tables exist
SELECT 
  'Tables' as category,
  table_name,
  CASE WHEN table_name IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'companies', 'businesses');

-- Check RLS status
SELECT 
  'RLS Status' as category,
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'companies', 'businesses');

-- Check existing policies
SELECT 
  'Policies' as category,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'companies', 'businesses');

-- Check if trigger function exists
SELECT 
  'Trigger Function' as category,
  routine_name,
  CASE WHEN routine_name IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'handle_new_user';

-- Check if trigger exists
SELECT 
  'Trigger' as category,
  trigger_name,
  CASE WHEN trigger_name IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
  AND trigger_name = 'on_auth_user_created';

-- Check current user and role
SELECT 
  'Current User' as category,
  current_user,
  current_setting('role') as current_role;

-- Check if we can see auth.users
SELECT 
  'Auth Access' as category,
  COUNT(*) as auth_users_count
FROM auth.users;

