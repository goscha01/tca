-- Complete Authentication Fix Script
-- This script fixes all authentication and user profile issues

-- Step 1: Drop existing tables and functions to start fresh
DROP TABLE IF EXISTS public.businesses CASCADE;
DROP TABLE IF EXISTS public.memberships CASCADE;
DROP TABLE IF EXISTS public.training_courses CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Step 2: Create the users table with proper structure
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    company_name TEXT NOT NULL,
    membership_tier TEXT DEFAULT 'free',
    membership_expires TIMESTAMP WITH TIME ZONE,
    logo_url TEXT,
    business_link TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create the businesses table
CREATE TABLE public.businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
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
    operating_hours JSONB DEFAULT '{}',
    social_media JSONB DEFAULT '{}',
    services TEXT[] DEFAULT '{}',
    specialties TEXT[] DEFAULT '{}',
    certifications TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create the memberships table
CREATE TABLE public.memberships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    tier TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'pending', 'cancelled')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    stripe_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Create the training_courses table
CREATE TABLE public.training_courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    video_url TEXT,
    pdf_url TEXT,
    duration INTEGER,
    is_member_only BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_courses ENABLE ROW LEVEL SECURITY;

-- Step 7: Create the user profile creation function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  company_name_value TEXT;
  email_parts TEXT[];
BEGIN
  -- First, try to get company name from user metadata
  company_name_value := NEW.raw_user_meta_data->>'company_name';
  
  -- If no company name in metadata, derive it from email
  IF company_name_value IS NULL OR company_name_value = '' OR company_name_value = 'undefined' THEN
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
  IF company_name_value IN ('New Company', 'Your Company', 'new company', 'your company', 'undefined') THEN
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

-- Step 8: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 9: Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Auth trigger can insert users" ON public.users
    FOR INSERT WITH CHECK (true);

-- Step 10: Create RLS policies for businesses table
CREATE POLICY "Users can view all businesses" ON public.businesses
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own business" ON public.businesses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business" ON public.businesses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own business" ON public.businesses
    FOR DELETE USING (auth.uid() = user_id);

-- Step 11: Create RLS policies for memberships table
CREATE POLICY "Users can view own memberships" ON public.memberships
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own memberships" ON public.memberships
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own memberships" ON public.memberships
    FOR UPDATE USING (auth.uid() = user_id);

-- Step 12: Create RLS policies for training_courses table
CREATE POLICY "Anyone can view training courses" ON public.training_courses
    FOR SELECT USING (true);

-- Step 13: Insert any missing user profiles from existing auth.users
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
  COALESCE(au.created_at, NOW()),
  NOW()
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Step 14: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON public.businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_training_courses_category ON public.training_courses(category);

-- Step 15: Grant necessary permissions (removed problematic sequence grants)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.businesses TO anon, authenticated;
GRANT ALL ON public.memberships TO anon, authenticated;
GRANT ALL ON public.training_courses TO anon, authenticated;

-- Step 16: Verify the setup
SELECT 'Setup Complete' as status;
SELECT COUNT(*) as users_count FROM public.users;
SELECT COUNT(*) as businesses_count FROM public.businesses;
