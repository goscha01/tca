-- Comprehensive Fix for Business Profile Table
-- This script will resolve the 406 error you're seeing

-- First, let's check what tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check if businesses table exists and its structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'businesses' 
ORDER BY ordinal_position;

-- Drop and recreate the businesses table with the correct structure
DROP TABLE IF EXISTS public.businesses CASCADE;

CREATE TABLE public.businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
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
        "saturday": {"open": "10:00", "close": "15:00", "closed": false},
        "sunday": {"open": "10:00", "close": "15:00", "closed": true}
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view all businesses" ON public.businesses;
DROP POLICY IF EXISTS "Users can insert own business" ON public.businesses;
DROP POLICY IF EXISTS "Users can update own business" ON public.businesses;
DROP POLICY IF EXISTS "Users can delete own business" ON public.businesses;

-- Create RLS policies
CREATE POLICY "Users can view all businesses" ON public.businesses
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own business" ON public.businesses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business" ON public.businesses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own business" ON public.businesses
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON public.businesses(user_id);

-- Grant permissions
GRANT ALL ON public.businesses TO anon, authenticated;

-- Insert default business profile for existing users
INSERT INTO public.businesses (user_id, name, description, email, created_at, updated_at)
SELECT 
    u.id,
    COALESCE(u.company_name, 'Professional Services'),
    'Welcome to your business profile! Update this description to tell customers about your services.',
    u.email,
    NOW(),
    NOW()
FROM public.users u
LEFT JOIN public.businesses b ON u.id = b.user_id
WHERE b.user_id IS NULL;

-- Verify the setup
SELECT 'Business Profile Table Fixed' as status;
SELECT COUNT(*) as businesses_count FROM public.businesses;
SELECT COUNT(*) as users_count FROM public.users;

-- Test query to make sure it works
SELECT b.*, u.email as user_email 
FROM public.businesses b 
JOIN public.users u ON b.user_id = u.id 
LIMIT 5;
