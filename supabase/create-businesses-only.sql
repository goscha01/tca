-- Create only the businesses table (companies table already exists)
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

-- Create unique constraint on user_id for businesses
CREATE UNIQUE INDEX IF NOT EXISTS businesses_user_id_unique ON public.businesses(user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS businesses_company_id_idx ON public.businesses(company_id);
CREATE INDEX IF NOT EXISTS businesses_city_idx ON public.businesses(city);
CREATE INDEX IF NOT EXISTS businesses_state_idx ON public.businesses(state);
CREATE INDEX IF NOT EXISTS businesses_services_idx ON public.businesses USING GIN(services);
CREATE INDEX IF NOT EXISTS businesses_specialties_idx ON public.businesses USING GIN(specialties);

-- Enable RLS on businesses table
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for businesses table
CREATE POLICY "Users can view all business profiles" ON public.businesses
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own business profile" ON public.businesses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business profile" ON public.businesses
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete their own business profile" ON public.businesses
  FOR DELETE USING (auth.uid() = id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_businesses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_businesses_updated_at();

-- Verify the table was created
SELECT 'Businesses table created successfully' as status;
SELECT COUNT(*) as business_count FROM public.businesses;

