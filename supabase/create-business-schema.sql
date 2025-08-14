-- Business Schema Setup for TCA
-- This script creates the necessary tables for companies and business profiles

-- Step 1: Create companies table (for company selection during signup)
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  industry TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create businesses table (for detailed business profiles)
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

-- Step 3: Create unique constraint on user_id for businesses
CREATE UNIQUE INDEX IF NOT EXISTS businesses_user_id_unique ON public.businesses(user_id);

-- Step 4: Create indexes for better performance
CREATE INDEX IF NOT EXISTS businesses_company_id_idx ON public.businesses(company_id);
CREATE INDEX IF NOT EXISTS businesses_city_idx ON public.businesses(city);
CREATE INDEX IF NOT EXISTS businesses_state_idx ON public.businesses(state);
CREATE INDEX IF NOT EXISTS businesses_services_idx ON public.businesses USING GIN(services);
CREATE INDEX IF NOT EXISTS businesses_specialties_idx ON public.businesses USING GIN(specialties);

-- Step 5: Insert some sample companies
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

-- Step 6: Set up Row Level Security (RLS)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS policies for companies table
CREATE POLICY "Companies are viewable by everyone" ON public.companies
  FOR SELECT USING (true);

CREATE POLICY "Companies can be created by authenticated users" ON public.companies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Companies can be updated by authenticated users" ON public.companies
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Step 8: Create RLS policies for businesses table
CREATE POLICY "Users can view all business profiles" ON public.businesses
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own business profile" ON public.businesses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business profile" ON public.businesses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business profile" ON public.businesses
  FOR DELETE USING (auth.uid() = user_id);

-- Step 9: Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_businesses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 10: Create trigger for updated_at
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_businesses_updated_at();

-- Step 11: Create function to update companies updated_at timestamp
CREATE OR REPLACE FUNCTION update_companies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 12: Create trigger for companies updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION update_companies_updated_at();

-- Step 13: Create storage bucket for business assets
-- Note: This needs to be run in Supabase dashboard or via API
-- INSERT INTO storage.buckets (id, name, public) VALUES ('tca-assets', 'tca-assets', true);

-- Step 14: Create storage policies for tca-assets bucket
-- Note: These policies need to be created in Supabase dashboard or via API
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'tca-assets');
-- CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'tca-assets' AND auth.role() = 'authenticated');
-- CREATE POLICY "Users can update their own files" ON storage.objects FOR UPDATE USING (bucket_id = 'tca-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Step 15: Verify the setup
SELECT 'Companies table created successfully' as status;
SELECT COUNT(*) as company_count FROM public.companies;

SELECT 'Businesses table created successfully' as status;
SELECT 'RLS policies created successfully' as status;
SELECT 'Triggers created successfully' as status;
