-- Fix RLS Policies for TCA Application
-- Run this in your Supabase SQL Editor after running the main schema.sql

-- First, drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Auth trigger can insert users" ON public.users;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the user creation function with proper security
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, company_name, membership_tier, membership_expires)
  VALUES (
    NEW.id,
    NEW.email,
    'New Company', -- Default company name
    'basic', -- Default membership tier
    (NOW() + INTERVAL '1 year') -- Default 1 year membership
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recreate RLS policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Allow the trigger function to insert users
CREATE POLICY "Trigger function can insert users" ON public.users
    FOR INSERT WITH CHECK (true);

-- Test the setup
DO $$
BEGIN
  RAISE NOTICE 'RLS policies and triggers have been recreated successfully!';
  RAISE NOTICE 'You can now test user signup.';
END $$;
