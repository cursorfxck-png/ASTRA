const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'astra-bucket';

/**
 * Upload a file to Supabase
 */
async function uploadFile(filePath, supabasePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    
    console.log(`Uploading ${fileName} to ${supabasePath}...`);
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(supabasePath, fileBuffer, {
        contentType: getContentType(fileName),
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error(`Error uploading ${fileName}:`, error.message);
      return false;
    }

    console.log(`✓ Successfully uploaded ${fileName}`);
    return true;
  } catch (error) {
    console.error(`Error reading/uploading ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Get content type based on file extension
 */
function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const contentTypes = {
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime'
  };
  return contentTypes[ext] || 'application/octet-stream';
}

/**
 * Upload all files from a directory
 */
async function uploadDirectory(localDir, supabaseDir = '') {
  if (!fs.existsSync(localDir)) {
    console.log(`Directory ${localDir} does not exist, skipping...`);
    return;
  }

  const files = fs.readdirSync(localDir);
  
  for (const file of files) {
    const localPath = path.join(localDir, file);
    const stat = fs.statSync(localPath);
    
    if (stat.isDirectory()) {
      // Recursively upload subdirectories
      await uploadDirectory(localPath, path.join(supabaseDir, file));
    } else {
      // Upload file
      const supabasePath = path.join(supabaseDir, file).replace(/\\/g, '/');
      await uploadFile(localPath, supabasePath);
    }
  }
}

/**
 * Main upload function
 */
async function main() {
  console.log('Starting upload to Supabase...\n');

  // Upload site-content.json
  const contentJsonPath = path.join(__dirname, '../src/data/site-content.json');
  if (fs.existsSync(contentJsonPath)) {
    await uploadFile(contentJsonPath, 'site-content.json');
  }

  // Upload public/uploads directory
  console.log('\nUploading files from public/uploads...');
  await uploadDirectory(path.join(__dirname, '../public/uploads'), 'uploads');

  console.log('\n✅ Upload complete!');
  console.log('\nNext steps:');
  console.log('1. Go to your Supabase dashboard');
  console.log('2. Navigate to Storage > Policies');
  console.log('3. Run the SQL script from scripts/setup-supabase.sql');
  console.log('4. Verify the bucket is public and files are accessible');
}

main().catch(console.error);
