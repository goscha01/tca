-- Create the missing businesses table for TCA Application
-- Run this in your Supabase SQL Editor

-- Create the businesses table
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- RLS policies for businesses
CREATE POLICY "Users can view own business profile" ON public.businesses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business profile" ON public.businesses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business profile" ON public.businesses
    FOR UPDATE USING (auth.uid() = user_id);

-- Public can view business profiles (for business listings)
CREATE POLICY "Public can view business profiles" ON public.businesses
    FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_businesses_user_id ON public.businesses(user_id);
CREATE INDEX idx_businesses_name ON public.businesses(name);
CREATE INDEX idx_businesses_city ON public.businesses(city);
CREATE INDEX idx_businesses_state ON public.businesses(state);

-- Apply updated_at trigger
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert existing user data into businesses table if they have company names
INSERT INTO public.businesses (user_id, name, description, logo_url, website, phone, email, created_at, updated_at)
SELECT 
    id as user_id,
    COALESCE(company_name, 'Your Company') as name,
    '' as description,
    logo_url,
    business_link as website,
    phone,
    email,
    created_at,
    updated_at
FROM public.users
WHERE NOT EXISTS (
    SELECT 1 FROM public.businesses WHERE user_id = users.id
);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Businesses table created successfully!';
    RAISE NOTICE 'Existing users have been migrated to the businesses table.';
    RAISE NOTICE 'You can now use the full business profile system in the dashboard.';
END $$;

