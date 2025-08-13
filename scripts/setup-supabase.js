#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 TCA Supabase Setup Helper\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('Please create it with your Supabase credentials.\n');
  process.exit(1);
}

// Read and check .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=');
const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=');

if (!hasSupabaseUrl || !hasSupabaseKey) {
  console.log('❌ Missing Supabase credentials in .env.local');
  console.log('Please add your Supabase URL and anon key.\n');
  process.exit(1);
}

// Check if credentials are still placeholder values
if (envContent.includes('your-project-id.supabase.co') || envContent.includes('your-supabase-anon-key-here')) {
  console.log('⚠️  You still have placeholder values in .env.local');
  console.log('Please replace them with your actual Supabase credentials.\n');
  console.log('To get your credentials:');
  console.log('1. Go to your Supabase project dashboard');
  console.log('2. Navigate to Settings → API');
  console.log('3. Copy the Project URL and anon public key\n');
  process.exit(1);
}

console.log('✅ .env.local file looks good!');
console.log('✅ Supabase credentials are configured\n');

console.log('📋 Next steps:');
console.log('1. Make sure your Supabase project is running');
console.log('2. Run the database schema: supabase/schema.sql');
console.log('3. Start your dev server: npm run dev');
console.log('4. Go to http://localhost:3000/login');
console.log('5. Click "Join TCA Now" to create a test account\n');

console.log('🔧 To run the database schema:');
console.log('1. Go to your Supabase dashboard → SQL Editor');
console.log('2. Copy the contents of supabase/schema.sql');
console.log('3. Paste and run the SQL\n');

console.log('🧪 To test the signup:');
console.log('1. Fill out the signup form with test data:');
console.log('   - Company Name: Test Cleaning Co');
console.log('   - Email: test@example.com');
console.log('   - Password: testpassword123');
console.log('2. Submit the form');
console.log('3. Check your Supabase dashboard → Authentication → Users');
console.log('4. Check your Supabase dashboard → Table Editor → users\n');

console.log('📚 For detailed setup instructions, see: docs/supabase-setup.md\n');
