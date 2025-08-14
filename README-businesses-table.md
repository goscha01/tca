# Fix Business Profile System

## The Issue
The dashboard is showing a "local storage" message because the `businesses` table doesn't exist in your Supabase database yet.

## The Solution
Run the SQL script to create the missing table.

## Steps to Fix

1. **Go to your Supabase Dashboard**
   - Navigate to [supabase.com](https://supabase.com)
   - Sign in and open your TCA project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the SQL Script**
   - Copy the contents of `supabase/create-businesses-table.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

4. **Verify the Table was Created**
   - Go to "Table Editor" in the left sidebar
   - You should see a new `businesses` table

5. **Test the Dashboard**
   - Refresh your TCA application
   - The local storage message should disappear
   - Business profiles should now save to the database
   - Logo uploads should work properly

## What This Script Does
- Creates the `businesses` table with all necessary fields
- Sets up proper Row Level Security (RLS) policies
- Migrates existing user data to the businesses table
- Enables full database integration for business profiles

## After Running the Script
Your business profile system will work completely with:
- ✅ Database storage for all profile data
- ✅ Logo uploads to Supabase storage
- ✅ Proper data persistence across sessions
- ✅ No more 404 errors or local storage fallbacks

The dashboard will automatically detect the new table and start using it immediately.

