-- Fix Database Trigger Script
-- This script fixes the handle_new_user function and trigger

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create a better handle_new_user function
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

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Test the function with a sample user
-- SELECT handle_new_user();

-- Show the current trigger status
SELECT 
  trigger_name,
  event_manipulation,
  event_object_schema,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

