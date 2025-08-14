const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupBusinesses() {
  console.log('Setting up businesses table...');
  
  try {
    // Read the business schema SQL
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, '../supabase/create-business-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`Executing statement ${i + 1}/${statements.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            console.log(`Statement ${i + 1} result:`, error.message);
            // Continue with other statements even if some fail
          } else {
            console.log(`Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.log(`Statement ${i + 1} error:`, err.message);
        }
      }
    }
    
    console.log('Businesses table setup completed!');
    
    // Verify the table exists
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('Verification failed:', error.message);
    } else {
      console.log('✅ Businesses table verified successfully!');
    }
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupBusinesses();
