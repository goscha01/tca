-- Fix Business Link Field Not Being Copied
-- This script updates the database trigger to copy the business_link field from user metadata

-- First, let's check the current users table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add business_link column to users table if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS business_link TEXT;

-- Update existing users with business_link from their auth metadata
UPDATE public.users 
SET business_link = au.raw_user_meta_data->>'business_link'
FROM auth.users au 
WHERE public.users.id = au.id 
AND au.raw_user_meta_data->>'business_link' IS NOT NULL;

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Recreate the function to include business_link
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  company_name_value TEXT;
  business_link_value TEXT;
  email_parts TEXT[];
BEGIN
  -- Get company name from user metadata
  company_name_value := NEW.raw_user_meta_data->>'company_name';
  
  -- Get business link from user metadata
  business_link_value := NEW.raw_user_meta_data->>'business_link';
  
  -- If no company name in metadata, derive it from email
  IF company_name_value IS NULL OR company_name_value = '' OR company_name_value = 'undefined' THEN
    email_parts := string_to_array(NEW.email, '@');
    IF array_length(email_parts, 1) = 2 THEN
      company_name_value := initcap(email_parts[1]) || ' ' || initcap(email_parts[2]);
    ELSE
      company_name_value := 'Professional Services';
    END IF;
  END IF;
  
  -- Ensure we never have "New Company" or "Your Company"
  IF company_name_value IN ('New Company', 'Your Company', 'new company', 'your company', 'undefined') THEN
    email_parts := string_to_array(NEW.email, '@');
    IF array_length(email_parts, 1) = 2 THEN
      company_name_value := initcap(email_parts[1]) || ' ' || initcap(email_parts[2]);
    ELSE
      company_name_value := 'Professional Services';
    END IF;
  END IF;
  
  -- Insert the user profile with both company_name and business_link
  INSERT INTO public.users (
    id,
    email,
    company_name,
    business_link,
    membership_tier,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    company_name_value,
    business_link_value,
    'free',
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Verify the setup
SELECT 'Business Link Field Fixed' as status;
SELECT COUNT(*) as users_with_business_link FROM public.users WHERE business_link IS NOT NULL;
SELECT COUNT(*) as total_users FROM public.users;
