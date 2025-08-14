-- Fix Company Names Script
-- This script fixes users with "New Company" names

-- First, let's see what users we have with problematic company names
SELECT id, email, company_name, created_at 
FROM users 
WHERE company_name IN ('New Company', 'Your Company')
ORDER BY created_at DESC;

-- Update users with "New Company" to use their email domain as company name
UPDATE users 
SET 
  company_name = CASE 
    WHEN email LIKE '%@%' THEN 
      CONCAT(
        UPPER(LEFT(SPLIT_PART(email, '@', 1), 1)),
        LOWER(SUBSTRING(SPLIT_PART(email, '@', 1), 2)),
        ' ',
        UPPER(LEFT(SPLIT_PART(email, '@', 2), 1)),
        LOWER(SUBSTRING(SPLIT_PART(email, '@', 2), 2))
      )
    ELSE 'Professional Services'
  END,
  updated_at = NOW()
WHERE company_name = 'New Company';

-- Update users with "Your Company" to use their email domain as company name
UPDATE users 
SET 
  company_name = CASE 
    WHEN email LIKE '%@%' THEN 
      CONCAT(
        UPPER(LEFT(SPLIT_PART(email, '@', 1), 1)),
        LOWER(SUBSTRING(SPLIT_PART(email, '@', 1), 2)),
        ' ',
        UPPER(LEFT(SPLIT_PART(email, '@', 2), 1)),
        LOWER(SUBSTRING(SPLIT_PART(email, '@', 2), 2))
      )
    ELSE 'Professional Services'
  END,
  updated_at = NOW()
WHERE company_name = 'Your Company';

-- Verify the changes
SELECT id, email, company_name, updated_at 
FROM users 
ORDER BY updated_at DESC 
LIMIT 10;

-- Show summary of company names
SELECT company_name, COUNT(*) as user_count
FROM users 
GROUP BY company_name 
ORDER BY user_count DESC;

