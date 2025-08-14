// Test Database Connection and Current State
// Run this to verify your Supabase connection and see current data

const { createClient } = require('@supabase/supabase-js');

// Replace with your actual Supabase credentials
const supabaseUrl = 'https://rynxevsdruxautbigfbx.supabase.co';
const supabaseKey = 'YOUR_ANON_KEY_HERE'; // Replace with your actual anon key

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection and current state...\n');
  
  try {
    // Test 1: Check if we can connect
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return;
    }
    
    console.log('✅ Connection successful!\n');
    
    // Test 2: Check current users table state
    console.log('2. Checking current users table state...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message);
    } else {
      console.log(`✅ Found ${users.length} users in the table`);
      if (users.length > 0) {
        console.log('\n📋 Sample users:');
        users.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.email} - Company: "${user.company_name}" - Tier: ${user.membership_tier || 'N/A'}`);
        });
      }
    }
    
    // Test 3: Check for problematic company names
    console.log('\n3. Checking for problematic company names...');
    const { data: problematicUsers, error: probError } = await supabase
      .from('users')
      .select('*')
      .or('company_name.eq.New Company,company_name.eq.Your Company,company_name.eq.new company,company_name.eq.your company');
    
    if (probError) {
      console.error('❌ Error checking problematic names:', probError.message);
    } else {
      if (problematicUsers.length > 0) {
        console.log(`⚠️  Found ${problematicUsers.length} users with problematic company names:`);
        problematicUsers.forEach(user => {
          console.log(`     - ${user.email}: "${user.company_name}"`);
        });
      } else {
        console.log('✅ No users with problematic company names found!');
      }
    }
    
    console.log('\n🎯 Database connection test completed!');
    console.log('If you see connection successful, your Supabase setup is working.');
    console.log('If you see problematic company names, run the fix script.');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

// Run the test
testConnection();

