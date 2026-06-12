# First Run Setup - Complete This BEFORE Starting the App

## ⚠️ IMPORTANT: Complete These Steps First

The app is now configured to use **ONLY Supabase** (no local files). You MUST set up the Supabase bucket before running the app.

---

## Step 1: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

---

## Step 2: Create Bucket in Supabase

### Option A: Via Dashboard (Easiest)

1. **Go to Storage**: https://supabase.com/dashboard/project/bfgynclddehatuwfxehr/storage

2. **Click "New bucket"**

3. **Configure bucket**:
   - **Name**: `astra-bucket` (exactly this name)
   - **Public bucket**: ✅ **MUST CHECK THIS BOX**
   - **File size limit**: 50 MB (or higher)
   - **Allowed MIME types**: Leave empty (allow all)

4. **Click "Create bucket"**

---

## Step 3: Set Up Bucket Policies (REQUIRED)

### Go to SQL Editor:
https://supabase.com/dashboard/project/bfgynclddehatuwfxehr/sql/new

### Copy and paste this SQL:

```sql
-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- Allow public SELECT (read/download)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'astra-bucket');

-- Allow public INSERT (upload)
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'astra-bucket');

-- Allow public UPDATE
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'astra-bucket');

-- Allow public DELETE
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'astra-bucket');
```

### Click "Run" (or press Ctrl+Enter)

You should see: `Success. No rows returned`

---

## Step 4: Start the App

```bash
npm run dev
```

### What Happens on First Run:

1. ✅ App tries to load `site-content.json` from Supabase
2. ❌ File doesn't exist (404)
3. ✅ App automatically uploads the initial content from local file
4. ✅ App loads successfully
5. 🎉 You can now use the CMS!

### You'll see this in console:
```
Content not found in Supabase, uploading initial content...
✅ Initial content uploaded to Supabase successfully
```

---

## Step 5: Upload Existing Media (Optional)

If you have existing images/videos in `public/uploads/`, upload them:

```bash
npm run upload-to-supabase
```

This uploads all files from `public/uploads/` to Supabase.

---

## Verify Setup

### Check if content file exists:
Open this URL in your browser:
```
https://bfgynclddehatuwfxehr.supabase.co/storage/v1/object/public/astra-bucket/site-content.json
```

You should see JSON data (not a 404 error).

### Check bucket in dashboard:
https://supabase.com/dashboard/project/bfgynclddehatuwfxehr/storage/buckets/astra-bucket

You should see:
- ✅ `site-content.json` in root
- ✅ `uploads/` folder (if you uploaded media)

---

## How It Works Now

### ✅ All Content in Supabase:
- **JSON config**: `site-content.json` in bucket root
- **Uploads**: All in `uploads/` folder
- **No local files**: Everything is cloud-based

### 🔄 Automatic Initialization:
- First run: Uploads initial content automatically
- CMS changes: Saved directly to Supabase
- New uploads: Go directly to Supabase

### 🌍 Benefits:
- Access from anywhere
- No local storage needed
- Fast CDN delivery
- Automatic backups
- Scalable storage

---

## Troubleshooting

### Error: "Failed to initialize content"

**Check:**
1. ✅ Bucket named `astra-bucket` exists
2. ✅ Bucket is marked as **Public**
3. ✅ Policies are created (run SQL script)
4. ✅ Environment variables in `.env.local` are correct

### Error: "Failed to upload"

**Check:**
1. ✅ Bucket policies allow INSERT
2. ✅ File size under limit (50MB)
3. ✅ Internet connection is stable

### Can't see uploaded files

**Check:**
1. ✅ Bucket is **Public** (not Private)
2. ✅ Policies allow SELECT
3. ✅ File path is correct (case-sensitive)

---

## Quick Checklist

Before running `npm run dev`:

- [ ] Installed `@supabase/supabase-js`
- [ ] Created `astra-bucket` in Supabase
- [ ] Set bucket to **Public**
- [ ] Ran SQL script to create policies
- [ ] Verified `.env.local` has Supabase credentials

If all checked ✅, run:
```bash
npm run dev
```

The app will automatically initialize!

---

## Support

If you encounter issues:
1. Check the Supabase dashboard for errors
2. Check browser console for error messages
3. Verify bucket name is exactly `astra-bucket`
4. Make sure bucket is Public, not Private
5. Confirm policies are created (check SQL editor)
