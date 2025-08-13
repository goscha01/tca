-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    company_name TEXT,
    membership_tier TEXT DEFAULT 'basic',
    membership_expires TIMESTAMP WITH TIME ZONE,
    logo_url TEXT,
    business_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Function to handle user creation during signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  company_name_param TEXT;
BEGIN
  -- Try to get company name from the user's metadata if available
  company_name_param := COALESCE(NEW.raw_user_meta_data->>'company_name', 'New Company');
  
  INSERT INTO public.users (id, email, company_name, membership_tier, membership_expires)
  VALUES (
    NEW.id,
    NEW.email,
    company_name_param,
    'basic',
    (NOW() + INTERVAL '1 year')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile when auth.users record is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS policies for users
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow the auth trigger to insert users (for signup process)
CREATE POLICY "Auth trigger can insert users" ON public.users
    FOR INSERT WITH CHECK (true);

-- Memberships table
CREATE TABLE public.memberships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    tier TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'expired', 'pending', 'cancelled')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    stripe_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- RLS policies for memberships
CREATE POLICY "Users can view own memberships" ON public.memberships
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own memberships" ON public.memberships
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Training courses table
CREATE TABLE public.training_courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    video_url TEXT,
    pdf_url TEXT,
    duration INTEGER, -- in minutes
    is_member_only BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.training_courses ENABLE ROW LEVEL SECURITY;

-- RLS policies for training courses
CREATE POLICY "Public can view non-member courses" ON public.training_courses
    FOR SELECT USING (NOT is_member_only);

CREATE POLICY "Members can view all courses" ON public.training_courses
    FOR SELECT USING (
        is_member_only = false OR 
        EXISTS (
            SELECT 1 FROM public.memberships m 
            JOIN public.users u ON m.user_id = u.id 
            WHERE u.id = auth.uid() AND m.status = 'active'
        )
    );

-- User course progress table
CREATE TABLE public.user_course_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.training_courses(id) ON DELETE CASCADE NOT NULL,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for user course progress
CREATE POLICY "Users can view own progress" ON public.user_course_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_course_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_course_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Awards table
CREATE TABLE public.awards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    category TEXT NOT NULL,
    business_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    google_business_url TEXT,
    special_achievements TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    review_score DECIMAL(3,1),
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;

-- RLS policies for awards
CREATE POLICY "Users can view own awards" ON public.awards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own awards" ON public.awards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own awards" ON public.awards
    FOR UPDATE USING (auth.uid() = user_id);

-- Public can view approved awards
CREATE POLICY "Public can view approved awards" ON public.awards
    FOR SELECT USING (status = 'approved');

-- Contact form submissions table
CREATE TABLE public.contact_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for contact submissions (only admins can view, anyone can insert)
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_memberships_user_id ON public.memberships(user_id);
CREATE INDEX idx_memberships_status ON public.memberships(status);
CREATE INDEX idx_training_courses_category ON public.training_courses(category);
CREATE INDEX idx_training_courses_member_only ON public.training_courses(is_member_only);
CREATE INDEX idx_user_course_progress_user_course ON public.user_course_progress(user_id, course_id);
CREATE INDEX idx_awards_status ON public.awards(status);
CREATE INDEX idx_awards_category ON public.awards(category);
CREATE INDEX idx_contact_submissions_status ON public.contact_submissions(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON public.memberships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_courses_updated_at BEFORE UPDATE ON public.training_courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_course_progress_updated_at BEFORE UPDATE ON public.user_course_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_awards_updated_at BEFORE UPDATE ON public.awards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON public.contact_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample training courses
INSERT INTO public.training_courses (title, description, category, duration, is_member_only) VALUES
('Introduction to Professional Cleaning', 'Learn the fundamentals of professional cleaning techniques and best practices.', 'Basics', 45, false),
('Advanced Stain Removal', 'Master advanced techniques for removing tough stains from various surfaces.', 'Advanced', 60, true),
('Customer Service Excellence', 'Develop exceptional customer service skills for the cleaning industry.', 'Business', 90, true),
('Eco-Friendly Cleaning Methods', 'Learn sustainable and environmentally friendly cleaning practices.', 'Sustainability', 75, true),
('Business Management for Cleaners', 'Essential business management skills for cleaning service owners.', 'Business', 120, true),
('Safety and Compliance', 'Understanding safety protocols and regulatory compliance in cleaning.', 'Safety', 45, false);

-- Note: Sample awards will be created after real users sign up
-- You can manually add sample awards in the Supabase dashboard after creating test users
