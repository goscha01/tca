-- Fix the handle_new_user function to properly extract company name from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  company_name_param TEXT;
BEGIN
  -- Try to get company name and business link from the user's metadata if available
  company_name_param := COALESCE(NEW.raw_user_meta_data->>'company_name', 'Professional Services');
  
  -- Insert the user profile
  INSERT INTO public.users (id, email, company_name, business_link, membership_tier, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    company_name_param,
    NEW.raw_user_meta_data->>'business_link',
    'free',
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the trigger to ensure it runs properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS policies are correct
DROP POLICY IF EXISTS "Auth trigger can insert users" ON public.users;
CREATE POLICY "Auth trigger can insert users" ON public.users
    FOR INSERT WITH CHECK (true);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Allow users to view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);
