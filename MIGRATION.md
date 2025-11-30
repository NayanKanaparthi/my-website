# Migration from Vercel Blob to Supabase Storage

This guide will help you migrate from Vercel Blob Storage to Supabase Storage, which offers a generous free tier for personal projects.

## Why Migrate?

Vercel Blob Storage has lost its free capacity. Supabase Storage provides:
- **Free tier**: 1 GB storage, 2 GB bandwidth/month
- Support for images, PDFs, and other file types
- Simple API similar to what you had with Vercel Blob
- Public URLs for easy access

## Step 1: Set Up Supabase

1. **Create a Supabase Account**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up for a free account (or log in if you already have one)

2. **Create a New Project**
   - Click "New Project"
   - Choose an organization (or create one)
   - Fill in:
     - **Name**: Your project name (e.g., "portfolio-storage")
     - **Database Password**: Create a strong password (save it!)
     - **Region**: Choose the closest region to your users
   - Click "Create new project"
   - Wait 2-3 minutes for the project to be set up

3. **Create a Storage Bucket**
   - In your Supabase project dashboard, go to **Storage** (left sidebar)
   - Click **"New bucket"**
   - Name it: `portfolio-assets` (or any name you prefer)
   - Make it **Public** (so images can be accessed via URL)
   - Click **"Create bucket"**

4. **Get Your API Keys**
   - Go to **Settings** → **API** (left sidebar)
   - You'll need:
     - **Project URL** (under "Project URL")
     - **Service Role Key** (under "Project API keys" → "service_role" key)
     - ⚠️ **Important**: Use the `service_role` key (not the `anon` key) - it has admin privileges needed for uploads

## Step 2: Configure Environment Variables

Add these environment variables to your Vercel project:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_STORAGE_BUCKET=portfolio-assets
```

**Where to find these values:**
- `NEXT_PUBLIC_SUPABASE_URL`: Your Project URL from Supabase Settings → API
- `SUPABASE_SERVICE_ROLE_KEY`: The `service_role` key from Supabase Settings → API
- `SUPABASE_STORAGE_BUCKET`: The bucket name you created (default: `portfolio-assets`)

## Step 3: Install Dependencies

The code has already been updated, but you need to install the Supabase client:

```bash
npm install @supabase/supabase-js
```

Or if you're using yarn:

```bash
yarn add @supabase/supabase-js
```

## Step 4: Deploy

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Migrate from Vercel Blob to Supabase Storage"
   git push
   ```

2. Vercel will automatically deploy with the new environment variables

## Step 5: Recover Your Images (If Possible)

Unfortunately, if Vercel Blob has deleted your images, they cannot be recovered. However, you can check:

1. **Check Redis/Content Storage**: Image URLs might still be stored in your Redis database or content files. Check your admin panel to see if image URLs are still there (even if the images themselves are gone).

2. **Check Your Git Repository**: If you committed any image URLs to your repository, you can find them there.

3. **Re-upload Images**: You'll need to manually re-upload any missing images through your admin panel.

## What Changed?

### File Uploads
- **Before**: Images/PDFs uploaded to Vercel Blob Storage
- **After**: Images/PDFs uploaded to Supabase Storage

### Posts Storage
- **Before**: Posts stored in Vercel Blob Storage (in production)
- **After**: Posts stored in Upstash Redis (in production) - same as your content

### Code Changes
- ✅ Removed `@vercel/blob` dependency
- ✅ Added `@supabase/supabase-js` dependency
- ✅ Updated upload route to use Supabase Storage
- ✅ Updated posts to use Redis instead of Blob Storage

## Testing

After deployment:

1. **Test Image Upload**
   - Go to your admin panel
   - Try uploading an image
   - Verify it appears correctly

2. **Test Post Creation**
   - Create a new post with an image
   - Verify the image displays correctly

3. **Check URLs**
   - Uploaded files should have URLs like: `https://[your-project].supabase.co/storage/v1/object/public/portfolio-assets/uploads/...`

## Troubleshooting

### "Supabase Storage is not configured"
- Make sure you've added all three environment variables to Vercel
- Redeploy after adding environment variables

### "Failed to upload to Supabase Storage"
- Check that your bucket name matches `SUPABASE_STORAGE_BUCKET`
- Verify the bucket is set to **Public**
- Check that you're using the `service_role` key (not `anon` key)

### Images not displaying
- Check that the bucket is public
- Verify the URLs are correct
- Check browser console for CORS errors (shouldn't happen with public buckets)

## Need Help?

If you encounter issues:
1. Check Supabase dashboard → Storage → Check if files are uploading
2. Check Vercel logs for error messages
3. Verify all environment variables are set correctly

## Future Considerations

- **Storage Limits**: Free tier is 1 GB. Monitor your usage in Supabase dashboard
- **Bandwidth**: Free tier is 2 GB/month. For a personal portfolio, this should be plenty
- **Upgrade**: If you need more, Supabase Pro is $25/month with 100 GB storage

