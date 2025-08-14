-- Complete Database Fix Script v2
-- This script completely rebuilds the user creation system to fix the "New Company" issue

-- Step 1: Drop all existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Step 2: Create a completely new handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  company_name_value TEXT;
  email_parts TEXT[];
BEGIN
  -- First, try to get company name from user metadata
  company_name_value := NEW.raw_user_meta_data->>'company_name';
  
  -- If no company name in metadata, derive it from email
  IF company_name_value IS NULL OR company_name_value = '' THEN
    email_parts := string_to_array(NEW.email, '@');
    IF array_length(email_parts, 1) = 2 THEN
      -- Convert first part to proper case (e.g., "john" -> "John")
      company_name_value := initcap(email_parts[1]);
      
      -- Add domain as company identifier (e.g., "John Example")
      company_name_value := company_name_value || ' ' || initcap(email_parts[2]);
    ELSE
      company_name_value := 'Professional Services';
    END IF;
  END IF;
  
  -- Ensure we never have "New Company" or "Your Company"
  IF company_name_value IN ('New Company', 'Your Company', 'new company', 'your company') THEN
    email_parts := string_to_array(NEW.email, '@');
    IF array_length(email_parts, 1) = 2 THEN
      company_name_value := initcap(email_parts[1]) || ' ' || initcap(email_parts[2]);
    ELSE
      company_name_value := 'Professional Services';
    END IF;
  END IF;
  
  -- Insert the user profile with the proper company name
  INSERT INTO public.users (
    id,
    email,
    company_name,
    membership_tier,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    company_name_value,
    'free',
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 4: Fix existing users with problematic company names
UPDATE public.users 
SET 
  company_name = CASE 
    WHEN email LIKE '%@%' THEN 
      CONCAT(
        initcap(split_part(email, '@', 1)),
        ' ',
        initcap(split_part(email, '@', 2))
      )
    ELSE 'Professional Services'
  END,
  membership_tier = COALESCE(membership_tier, 'free'),
  updated_at = NOW()
WHERE company_name IN ('New Company', 'Your Company', 'new company', 'your company')
   OR company_name IS NULL;

-- Step 5: Insert any missing user profiles from auth.users
INSERT INTO public.users (id, email, company_name, membership_tier, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.email LIKE '%@%' THEN 
      CONCAT(
        initcap(split_part(au.email, '@', 1)),
        ' ',
        initcap(split_part(au.email, '@', 2))
      )
    ELSE 'Professional Services'
  END as company_name,
  'free',
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

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

-- Step 9: Show function definition
SELECT 'Function definition:' as info;
SELECT pg_get_functiondef(oid) as function_definition
FROM pg_proc 
WHERE proname = 'handle_new_user';

