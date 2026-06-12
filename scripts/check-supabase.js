// Quick script to check Supabase bucket setup
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

console.log('\n🔍 Checking Supabase Setup...\n');

// Check environment variables
console.log('1. Environment Variables:');
if (supabaseUrl) {
  console.log('   ✅ NEXT_PUBLIC_SUPABASE_URL is set');
  console.log(`      ${supabaseUrl}`);
} else {
  console.log('   ❌ NEXT_PUBLIC_SUPABASE_URL is missing');
}

if (supabaseKey) {
  console.log('   ✅ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is set');
} else {
  console.log('   ❌ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing');
}

// Check if content file exists
console.log('\n2. Checking bucket content:');
const contentUrl = `${supabaseUrl}/storage/v1/object/public/astra-bucket/site-content.json`;

fetch(contentUrl)
  .then(response => {
    if (response.ok) {
      console.log('   ✅ site-content.json exists and is accessible');
      console.log(`      ${contentUrl}`);
      return response.json();
    } else if (response.status === 404) {
      console.log('   ⚠️  site-content.json not found (will be created on first run)');
    } else {
      console.log(`   ❌ Error accessing content: ${response.status} ${response.statusText}`);
    }
  })
  .catch(error => {
    console.log('   ❌ Failed to check content:', error.message);
    console.log('   ℹ️  This might mean the bucket or policies are not set up correctly');
  })
  .finally(() => {
    console.log('\n📋 Next Steps:');
    console.log('   1. Make sure bucket "astra-bucket" exists in Supabase');
    console.log('   2. Set bucket to Public');
    console.log('   3. Run SQL policies (see FIRST_RUN_SETUP.md)');
    console.log('   4. Run: npm run dev');
    console.log('\n');
  });
