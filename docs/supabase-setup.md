# Supabase Setup Guide for TCA

This guide will walk you through setting up Supabase for the Trusted Cleaners Association (TCA) application.

## Prerequisites

- A Supabase account (free tier available)
- Basic knowledge of SQL and database management

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `tca-website`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (usually 2-3 minutes)

## Step 2: Get Project Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in your project root
2. Add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `supabase/schema.sql`
4. Click "Run" to execute the schema
5. **Important**: The schema will create tables but won't insert sample awards (to avoid foreign key errors)

## Step 5: Configure Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket called `tca-assets`
3. Set the bucket to **Public** (for logo access)
4. Configure CORS policies if needed

### Storage Bucket Settings

```sql
-- Create storage bucket for TCA assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tca-assets', 'tca-assets', true);

-- Set up storage policies
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'tca-assets');

CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'tca-assets' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'tca-assets' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Step 6: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure email templates:
   - **Confirm signup**: Customize the email template
   - **Reset password**: Customize the email template
3. Set redirect URLs:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add your production domain when ready

## Step 7: Test the Setup

1. Start your development server: `npm run dev`
2. Go to `/login` and try to create an account
3. Check the Supabase dashboard to see if the user was created
4. Verify the user profile was created in the `users` table

## Step 7.5: Add Sample Data (Optional)

1. After creating at least one user account, you can add sample data
2. In your Supabase dashboard, go to **SQL Editor**
3. Create a new query and copy the contents of `supabase/sample-data.sql`
4. Click "Run" to insert sample awards and other data
5. **Note**: This script automatically finds existing users and creates sample data for them

## Step 8: Production Configuration

When deploying to production:

1. Update environment variables with production values
2. Update Supabase redirect URLs to include your production domain
3. Configure custom domain (optional)
4. Set up monitoring and alerts

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Verify your environment variables are correct
   - Check that the `.env.local` file is in the project root
   - Restart your development server after changing environment variables

2. **"Table doesn't exist" error**
   - Ensure you've run the schema.sql file
   - Check that all tables were created successfully
   - Verify table names match exactly

3. **"Permission denied" error**
   - Check Row Level Security (RLS) policies
   - Verify user authentication status
   - Check table permissions

4. **File upload errors**
   - Verify storage bucket exists and is public
   - Check storage policies
   - Ensure file size is within limits

### Debugging

1. **Check Supabase logs**:
   - Go to **Logs** in your dashboard
   - Look for error messages
   - Check authentication logs

2. **Verify database state**:
   - Use the **Table Editor** to inspect data
   - Check RLS policies are enabled
   - Verify triggers are working

3. **Test API calls**:
   - Use the **API Explorer** in Supabase dashboard
   - Test queries with different user contexts

## Security Considerations

1. **Row Level Security (RLS)** is enabled on all tables
2. **API keys** should never be committed to version control
3. **User permissions** are restricted to their own data
4. **File uploads** are restricted to authenticated users
5. **Public access** is limited to approved content only

## Next Steps

After Supabase is configured:

1. **Test authentication flow** thoroughly
2. **Verify file uploads** work correctly
3. **Test database queries** with real data
4. **Set up Stripe integration** for payments
5. **Configure Google Places API** for reviews
6. **Set up email service** for contact forms

## Support

- **Supabase Documentation**: [docs.supabase.com](https://docs.supabase.com)
- **Supabase Community**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- **TCA Project Issues**: Create an issue in the project repository
