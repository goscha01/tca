-- Fix RLS Policies for TCA
-- Run this script in your Supabase SQL Editor to fix the authorization issues

-- Step 1: Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  company_name TEXT,
  business_link TEXT,
  membership_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create companies table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  industry TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create businesses table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  operating_hours JSONB DEFAULT '{
    "monday": {"open": "09:00", "close": "17:00", "closed": false},
    "tuesday": {"open": "09:00", "close": "17:00", "closed": false},
    "wednesday": {"open": "09:00", "close": "17:00", "closed": false},
    "thursday": {"open": "09:00", "close": "17:00", "closed": false},
    "friday": {"open": "09:00", "close": "17:00", "closed": false},
    "saturday": {"open": "09:00", "close": "17:00", "closed": false},
    "sunday": {"open": "09:00", "close": "17:00", "closed": false}
  }',
  social_media JSONB DEFAULT '{
    "facebook": "",
    "instagram": "",
    "twitter": "",
    "linkedin": ""
  }',
  services TEXT[] DEFAULT '{}',
  specialties TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Companies are viewable by everyone" ON public.companies;
DROP POLICY IF EXISTS "Companies can be created by authenticated users" ON public.companies;
DROP POLICY IF EXISTS "Companies can be updated by authenticated users" ON public.companies;
DROP POLICY IF EXISTS "Users can view all business profiles" ON public.businesses;
DROP POLICY IF EXISTS "Users can insert their own business profile" ON public.businesses;
DROP POLICY IF EXISTS "Users can update their own business profile" ON public.businesses;

-- Step 6: Create proper RLS policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 7: Create proper RLS policies for companies table
CREATE POLICY "Companies are viewable by everyone" ON public.companies
  FOR SELECT USING (true);

CREATE POLICY "Companies can be created by authenticated users" ON public.companies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Companies can be updated by authenticated users" ON public.companies
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Step 8: Create proper RLS policies for businesses table
CREATE POLICY "Users can view all business profiles" ON public.businesses
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own business profile" ON public.businesses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business profile" ON public.businesses
  FOR UPDATE USING (auth.uid() = user_id);

-- Step 9: Insert sample companies
INSERT INTO public.companies (name, description, industry) VALUES
  ('ABC Cleaning Services', 'Professional cleaning services for residential and commercial properties', 'Cleaning Services'),
  ('Green Clean Solutions', 'Eco-friendly cleaning services using sustainable products', 'Cleaning Services'),
  ('Elite Maintenance', 'High-end maintenance and cleaning for luxury properties', 'Cleaning Services'),
  ('Quick Clean Pro', 'Fast and efficient cleaning services for busy professionals', 'Cleaning Services'),
  ('Spotless Solutions', 'Specialized stain removal and deep cleaning services', 'Cleaning Services'),
  ('Fresh Start Cleaning', 'New construction cleanup and post-renovation cleaning', 'Cleaning Services'),
  ('Crystal Clear Cleaners', 'Window cleaning and glass maintenance specialists', 'Cleaning Services'),
  ('Pro Clean Team', 'Commercial cleaning for offices and retail spaces', 'Cleaning Services'),
  ('Home Sweet Clean', 'Residential cleaning with personalized service', 'Cleaning Services'),
  ('Business Clean Plus', 'Comprehensive business cleaning and maintenance', 'Cleaning Services')
ON CONFLICT (name) DO NOTHING;

-- Step 10: Create indexes for better performance
CREATE INDEX IF NOT EXISTS businesses_user_id_idx ON public.businesses(user_id);
CREATE INDEX IF NOT EXISTS businesses_company_id_idx ON public.businesses(company_id);
CREATE INDEX IF NOT EXISTS companies_name_idx ON public.companies(name);

-- Step 11: Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, company_name, membership_tier, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Professional Services'),
    'free',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 12: Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 13: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.companies TO authenticated;
GRANT ALL ON public.businesses TO authenticated;

-- Success message
SELECT 'RLS policies and tables created successfully!' as status;
