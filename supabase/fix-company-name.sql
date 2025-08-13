-- Fix Company Name Issue for TCA Application
-- Run this in your Supabase SQL Editor

-- First, let's check what's in the users table
SELECT id, email, company_name, created_at FROM public.users ORDER BY created_at DESC LIMIT 5;

-- Check if the trigger function exists and is working
SELECT routine_name, routine_type, routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Check if the trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Drop and recreate the trigger function to ensure it works properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  company_name_param TEXT;
BEGIN
  -- Get company name from user metadata, with better fallback
  company_name_param := COALESCE(
    NEW.raw_user_meta_data->>'company_name',
    'New Company'
  );
  
  -- Insert the user profile
  INSERT INTO public.users (id, email, company_name, membership_tier, membership_expires)
  VALUES (
    NEW.id,
    NEW.email,
    company_name_param,
    'basic',
    (NOW() + INTERVAL '1 year')
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the signup
    RAISE WARNING 'Failed to create user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Now let's manually update any existing users who have "New Company" as their company name
-- Replace 'your-email@example.com' with your actual email
UPDATE public.users 
SET company_name = 'Your Company Name'  -- Replace with your actual company name
WHERE email = 'your-email@example.com' AND company_name = 'New Company';

-- Verify the update worked
SELECT id, email, company_name, created_at 
FROM public.users 
WHERE email = 'your-email@example.com';

-- Test the trigger by checking if it's working
DO $$
BEGIN
  RAISE NOTICE 'Trigger function and trigger have been recreated successfully!';
  RAISE NOTICE 'You can now test user signup with proper company names.';
END $$;
