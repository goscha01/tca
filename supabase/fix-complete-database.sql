-- Complete Database Fix Script
-- This script fixes all the database issues including missing user profiles

-- First, let's see what we have
SELECT 'Current users in auth.users:' as info;
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;

SELECT 'Current users in public.users:' as info;
SELECT id, email, company_name, created_at FROM public.users ORDER BY created_at DESC LIMIT 5;

-- Step 1: Drop and recreate the handle_new_user function with better logic
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  company_name_value TEXT;
BEGIN
  -- Extract company name from user metadata, with better fallback logic
  company_name_value := COALESCE(
    NEW.raw_user_meta_data->>'company_name',
    CASE 
      WHEN NEW.email LIKE '%@%' THEN 
        CONCAT(
          UPPER(LEFT(SPLIT_PART(NEW.email, '@', 1), 1)),
          LOWER(SUBSTRING(SPLIT_PART(NEW.email, '@', 1), 2)),
          ' ',
          UPPER(LEFT(SPLIT_PART(NEW.email, '@', 2), 1)),
          LOWER(SUBSTRING(SPLIT_PART(NEW.email, '@', 2), 2))
        )
      ELSE 'Professional Services'
    END
  );
  
  -- Insert the user profile with the proper company name
  INSERT INTO public.users (
    id,
    email,
    company_name,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    company_name_value,
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 3: Fix existing users who are missing from public.users
-- Insert users from auth.users who don't exist in public.users
INSERT INTO public.users (id, email, company_name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'company_name',
    CASE 
      WHEN au.email LIKE '%@%' THEN 
        CONCAT(
          UPPER(LEFT(SPLIT_PART(au.email, '@', 1), 1)),
          LOWER(SUBSTRING(SPLIT_PART(au.email, '@', 1), 2)),
          ' ',
          UPPER(LEFT(SPLIT_PART(au.email, '@', 2), 1)),
          LOWER(SUBSTRING(SPLIT_PART(au.email, '@', 2), 2))
        )
      ELSE 'Professional Services'
    END
  ) as company_name,
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Step 4: Update existing users with problematic company names
UPDATE public.users 
SET 
  company_name = CASE 
    WHEN email LIKE '%@%' THEN 
      CONCAT(
        UPPER(LEFT(SPLIT_PART(email, '@', 1), 1)),
        LOWER(SUBSTRING(SPLIT_PART(email, '@', 1), 2)),
        ' ',
        UPPER(LEFT(SPLIT_PART(email, '@', 2), 1)),
        LOWER(SUBSTRING(SPLIT_PART(email, '@', 2), 2))
      )
    ELSE 'Professional Services'
  END,
  updated_at = NOW()
WHERE company_name IN ('New Company', 'Your Company');

-- Step 5: Set default membership tier for existing users
UPDATE public.users 
SET membership_tier = 'free'
WHERE membership_tier IS NULL;

-- Step 6: Verify the fixes
SELECT 'After fix - users in public.users:' as info;
SELECT id, email, company_name, membership_tier, created_at, updated_at 
FROM public.users 
ORDER BY updated_at DESC 
LIMIT 10;

-- Step 7: Show summary
SELECT 'Summary of company names:' as info;
SELECT company_name, COUNT(*) as user_count
FROM public.users 
GROUP BY company_name 
ORDER BY user_count DESC;

SELECT 'Summary of membership tiers:' as info;
SELECT membership_tier, COUNT(*) as user_count
FROM public.users 
GROUP BY membership_tier 
ORDER BY user_count DESC;

-- Step 8: Test the trigger function
SELECT 'Testing trigger function...' as info;
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

