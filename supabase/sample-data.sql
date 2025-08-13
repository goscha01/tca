-- Sample Data for TCA Application
-- Run this AFTER you have created at least one user account
-- You can get a real user ID from the users table in your Supabase dashboard

-- First, let's get a real user ID to use for sample data
-- Replace 'your-email@example.com' with an actual email from your users table
DO $$
DECLARE
    sample_user_id UUID;
BEGIN
    -- Get the first user from the users table
    SELECT id INTO sample_user_id FROM public.users LIMIT 1;
    
    -- Only insert sample data if we have a real user
    IF sample_user_id IS NOT NULL THEN
        -- Insert sample awards (replace with real user ID)
        INSERT INTO public.awards (user_id, category, business_name, contact_name, contact_email, status, review_score) VALUES
        (sample_user_id, 'Excellence in Service', 'Sparkle Clean Pro', 'John Smith', 'john@sparklecleanpro.com', 'approved', 4.8),
        (sample_user_id, 'Innovation Award', 'Green Clean Solutions', 'Sarah Johnson', 'sarah@greencleansolutions.com', 'approved', 4.9),
        (sample_user_id, 'Customer Satisfaction', 'Elite Cleaning Services', 'Mike Davis', 'mike@elitecleaningservices.com', 'approved', 4.7);
        
        RAISE NOTICE 'Sample data inserted successfully for user ID: %', sample_user_id;
    ELSE
        RAISE NOTICE 'No users found. Please create a user account first, then run this script again.';
    END IF;
END $$;

-- Alternative: Manual insertion (uncomment and modify as needed)
-- INSERT INTO public.awards (user_id, category, business_name, contact_name, contact_email, status, review_score) VALUES
-- ('REPLACE-WITH-REAL-USER-ID', 'Excellence in Service', 'Sparkle Clean Pro', 'John Smith', 'john@sparklecleanpro.com', 'approved', 4.8);

-- To get a real user ID, run this query in your Supabase dashboard:
-- SELECT id, email, company_name FROM public.users LIMIT 5;
