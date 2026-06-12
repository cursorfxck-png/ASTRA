# Supabase Setup Guide for ASTRA

This guide will help you set up Supabase storage for your ASTRA application.

## Prerequisites

- Supabase account and project
- Node.js installed
- Project dependencies installed

## Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js dotenv
```

## Step 2: Environment Variables

Your `.env.local` already contains the Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bfgynclddehatuwfxehr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_w0MOh_ROJPEEdHTy4KSFxw_jv5H2Ex9
```

## Step 3: Create the Bucket in Supabase Dashboard

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/bfgynclddehatuwfxehr
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Set the following:
   - **Name**: `astra-bucket`
   - **Public bucket**: ✅ **Enabled** (Check this box)
   - **File size limit**: 50 MB
   - **Allowed MIME types**: Leave empty or add: `image/*`, `video/*`, `application/json`
5. Click **Create bucket**

## Step 4: Set Up Storage Policies

1. In Supabase Dashboard, go to **Storage** > **Policies**
2. Click on **astra-bucket**
3. Click **New Policy** and run the following SQL in the **SQL Editor**:

```sql
-- Enable public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'astra-bucket');

-- Allow public uploads
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'astra-bucket');

-- Allow public updates
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'astra-bucket');

-- Allow public deletes
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'astra-bucket');
```

**OR** use the complete SQL script:

Go to **SQL Editor** and paste the entire content from `scripts/setup-supabase.sql`

## Step 5: Upload Existing Files to Supabase

Run the upload script to migrate all existing files:

```bash
node scripts/upload-to-supabase.js
```

This will:
- Upload `site-content.json` to the root of the bucket
- Upload all files from `public/uploads/` to `uploads/` folder in the bucket

## Step 6: Verify the Setup

1. Go to **Storage** > **astra-bucket** in Supabase Dashboard
2. You should see:
   - `site-content.json` in the root
   - `uploads/` folder with all your media files

3. Test public access by opening a file URL:
   ```
   https://bfgynclddehatuwfxehr.supabase.co/storage/v1/object/public/astra-bucket/site-content.json
   ```

## How It Works

### Automatic Integration

The app now automatically uses Supabase when the environment variables are set:

1. **Content Management**: 
   - `getSiteContent()` fetches from Supabase
   - `saveSiteContent()` uploads to Supabase
   - Falls back to local files if Supabase fails

2. **File Uploads**:
   - New uploads go directly to Supabase
   - Returns public Supabase URLs
   - Falls back to local storage if Supabase fails

3. **Public Access**:
   - All files are publicly accessible via Supabase CDN
   - No authentication required for reads
   - Fast global CDN delivery

### File URLs

Files uploaded to Supabase will have URLs like:
```
https://bfgynclddehatuwfxehr.supabase.co/storage/v1/object/public/astra-bucket/uploads/filename.jpg
```

### Functions Available

```typescript
import { 
  supabase, 
  getPublicUrl, 
  uploadFile, 
  deleteFile, 
  listFiles,
  getSiteContentFromSupabase,
  updateSiteContentInSupabase
} from '@/lib/supabase';

// Get public URL
const url = getPublicUrl('uploads/image.jpg');

// Upload file
const publicUrl = await uploadFile(file, 'uploads/newfile.jpg');

// Delete file
await deleteFile('uploads/oldfile.jpg');

// List files
const files = await listFiles('uploads');
```

## Bucket Structure

```
astra-bucket/
├── site-content.json          # Main site configuration
└── uploads/                   # Media uploads folder
    ├── 1781154018278-macbook-pro-16-2.png
    ├── 1781154420557-gcfu6wyphw1waroijpngnmolyk.avif
    └── ... (other uploaded files)
```

## Benefits

✅ **CDN Delivery**: Fast global content delivery
✅ **Scalable**: No server storage limits
✅ **Automatic Backups**: Supabase handles backups
✅ **Public Access**: Easy sharing and embedding
✅ **Version Control**: Keep track of file changes
✅ **Cost Effective**: Generous free tier

## Troubleshooting

### Files not uploading?
- Check if the bucket exists
- Verify policies are set correctly
- Check browser console for errors

### Cannot access files?
- Ensure bucket is set to **Public**
- Verify the URL format is correct
- Check if policies allow public SELECT

### Upload script fails?
- Run `npm install @supabase/supabase-js dotenv`
- Verify environment variables in `.env.local`
- Check Supabase project is active

## Security Notes

- The bucket is **public** for easy access
- Anyone can read files (intentional for public site)
- Upload/delete policies can be restricted to authenticated users only
- For production, consider adding rate limiting

## Next Steps

After setup, your app will:
1. Load content from Supabase
2. Upload new files to Supabase
3. Serve all media from Supabase CDN
4. Work from anywhere with internet access

No local file storage needed! 🚀
