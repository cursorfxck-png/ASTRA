# ASTRA - Supabase Cloud Storage Setup

## 🎯 Overview

ASTRA is now configured to use **Supabase ONLY** for all storage:
- ✅ No local file uploads
- ✅ All CMS content stored in Supabase
- ✅ All media files in Supabase
- ✅ Accessible from anywhere

---

## 🚀 Quick Start (3 Steps)

### 1️⃣ Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 2️⃣ Create Bucket
Go to: https://supabase.com/dashboard/project/bfgynclddehatuwfxehr/storage
- Click "New bucket"
- Name: `astra-bucket`
- ✅ Check "Public bucket"
- Create

### 3️⃣ Run SQL Script
Go to: https://supabase.com/dashboard/project/bfgynclddehatuwfxehr/sql/new

Paste content from `scripts/create-bucket.sql` and run it.

**Done!** Now run: `npm run dev`

---

## 📖 Detailed Setup

See **FIRST_RUN_SETUP.md** for complete step-by-step instructions.

---

## 🔍 Verify Setup

### Check configuration:
```bash
npm run check-supabase
```

### Check content file manually:
Open: https://bfgynclddehatuwfxehr.supabase.co/storage/v1/object/public/astra-bucket/site-content.json

Should show JSON data (not 404).

---

## 🎬 How It Works

### First Run:
1. App tries to load content from Supabase
2. Content doesn't exist (404)
3. **App automatically uploads initial content**
4. App loads successfully ✅

### CMS Usage:
1. Admin edits content in CMS
2. **Changes saved directly to Supabase**
3. Changes visible immediately

### File Uploads:
1. Upload image/video in CMS
2. **File goes directly to Supabase**
3. Returns Supabase CDN URL
4. No local storage used

---

## 📁 Bucket Structure

```
astra-bucket/
├── site-content.json          # CMS configuration (auto-created)
└── uploads/                   # Media files
    ├── 1781154018278-image.png
    ├── 1781158616258-video.mp4
    └── ...
```

---

## 🛠️ Useful Commands

```bash
# Check if Supabase is configured correctly
npm run check-supabase

# Upload existing media files to Supabase
npm run upload-to-supabase

# Start development server
npm run dev

# Build for production
npm run build
```

---

## ✨ Features

### Automatic Initialization
- First run automatically uploads initial content
- No manual file uploads needed
- Works out of the box after bucket setup

### Cloud-First Storage
- All files in Supabase bucket
- No local storage used
- Accessible from any device

### CMS Integration
- Edit content directly in CMS
- Changes saved to Supabase instantly
- Upload images/videos through CMS

### CDN Delivery
- Fast global content delivery
- Supabase CDN
- Optimized performance

---

## 🔧 Configuration

### Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://bfgynclddehatuwfxehr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_w0MOh_ROJPEEdHTy4KSFxw_jv5H2Ex9
```

Already configured ✅

### Bucket Settings

- **Name**: `astra-bucket` (required)
- **Public**: Yes (required)
- **File Size Limit**: 50 MB (adjustable)
- **Policies**: Public read/write (required)

---

## 🐛 Troubleshooting

### "Failed to initialize content"

**Solution**: 
1. Check bucket exists and is named `astra-bucket`
2. Set bucket to Public
3. Run SQL policies script
4. Restart dev server

### "Failed to upload"

**Solution**:
1. Verify bucket policies allow INSERT
2. Check file size (under 50MB)
3. Ensure internet connection is stable

### Can't see uploaded files

**Solution**:
1. Confirm bucket is Public (not Private)
2. Check policies allow SELECT
3. Verify file path is correct

### Run diagnostic:
```bash
npm run check-supabase
```

---

## 📚 File Reference

- `FIRST_RUN_SETUP.md` - Complete setup guide
- `scripts/create-bucket.sql` - SQL to create bucket & policies
- `scripts/upload-to-supabase.js` - Upload existing files
- `scripts/check-supabase.js` - Verify configuration
- `src/lib/supabase.ts` - Supabase client & functions
- `src/lib/content.ts` - Content management (Supabase only)
- `src/app/api/upload/route.ts` - File upload API (Supabase only)

---

## 🎯 Benefits

✅ **No Local Storage** - Everything in cloud
✅ **Auto Initialize** - First run sets up automatically
✅ **Fast CDN** - Global content delivery
✅ **Scalable** - No storage limits
✅ **Accessible** - Work from anywhere
✅ **Automatic Backups** - Supabase handles it
✅ **Version Control** - Track all changes
✅ **Cost Effective** - Generous free tier

---

## 📞 Support

**Before asking for help:**
1. ✅ Run `npm run check-supabase`
2. ✅ Check bucket exists and is Public
3. ✅ Verify policies are created
4. ✅ Check browser console for errors

**Supabase Dashboard:**
https://supabase.com/dashboard/project/bfgynclddehatuwfxehr

---

## 🚦 Status Indicators

Run `npm run check-supabase` to see:

✅ **Green** - Everything configured correctly
⚠️ **Yellow** - Setup needed (will auto-initialize)
❌ **Red** - Configuration error (needs fixing)

---

## 📖 Quick Links

- [Supabase Dashboard](https://supabase.com/dashboard/project/bfgynclddehatuwfxehr)
- [Storage Buckets](https://supabase.com/dashboard/project/bfgynclddehatuwfxehr/storage)
- [SQL Editor](https://supabase.com/dashboard/project/bfgynclddehatuwfxehr/sql/new)
- [Storage Policies](https://supabase.com/dashboard/project/bfgynclddehatuwfxehr/storage/policies)

---

**Ready to start?** Follow **FIRST_RUN_SETUP.md** now! 🚀
