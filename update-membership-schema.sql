-- Update Membership Schema Script
-- This script updates the database to reflect the new membership structure

-- First, let's see the current membership data
SELECT id, email, membership_tier, membership_expires, created_at 
FROM users 
WHERE membership_tier IS NOT NULL
ORDER BY created_at DESC;

-- Update existing "basic" memberships to "free"
UPDATE users 
SET membership_tier = 'free'
WHERE membership_tier = 'basic';

-- Update existing "standard" memberships to "yearly"
UPDATE users 
SET membership_tier = 'yearly'
WHERE membership_tier = 'standard';

-- Update existing "premium" memberships to "yearly"
UPDATE users 
SET membership_tier = 'yearly'
WHERE membership_tier = 'premium';

-- Add a new column for membership status (active, expired, etc.)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS membership_status VARCHAR(20) DEFAULT 'free';

-- Update membership status based on expiry date
UPDATE users 
SET membership_status = CASE 
  WHEN membership_tier = 'yearly' AND membership_expires IS NOT NULL THEN
    CASE 
      WHEN membership_expires > NOW() THEN 'active'
      ELSE 'expired'
    END
  WHEN membership_tier = 'free' THEN 'free'
  ELSE 'inactive'
END;

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_users_membership_tier ON users(membership_tier);
CREATE INDEX IF NOT EXISTS idx_users_membership_status ON users(membership_status);

-- Show the updated membership structure
SELECT 
  membership_tier,
  membership_status,
  COUNT(*) as user_count
FROM users 
GROUP BY membership_tier, membership_status
ORDER BY membership_tier, membership_status;

-- Show sample users with their new membership structure
SELECT 
  id,
  email,
  company_name,
  membership_tier,
  membership_status,
  membership_expires,
  created_at
FROM users 
ORDER BY created_at DESC 
LIMIT 10;

