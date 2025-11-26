# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Generate Admin Password Hash**
   ```bash
   npm run generate-hash your-secure-password
   ```
   Copy the generated hash.

3. **Create Environment File**
   Create `.env.local` in the root directory:
   ```env
   ADMIN_PASSWORD_HASH=your_generated_hash_here
   JWT_SECRET=your_random_secret_string_here
   NODE_ENV=development
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Site**
   - Main site: http://localhost:3000
   - Admin portal: http://localhost:3000/admin

## First Steps

1. Log in to the admin portal with your password
2. Create your first blog post
3. Customize the content in the various pages (work, ventures, about, etc.)
4. Add your CV file to the `public` directory and link it in the About page

## Security Notes

- **Never commit** `.env.local` to version control
- Use a strong, unique password for the admin portal
- Generate a random, long string for `JWT_SECRET` in production
- The admin portal includes brute-force protection (5 attempts, 15-minute lockout)

## Customization

### Update Content
- Homepage: Edit `app/page.tsx` and components in `components/home/`
- Work case studies: Edit `app/work/[slug]/page.tsx`
- Ventures: Edit `app/ventures/page.tsx`
- About page: Edit `app/about/page.tsx`
- Talks: Edit `app/talks/page.tsx`
- Experiments: Edit `app/experiments/page.tsx`

### Add Your Photo
Replace the placeholder in `app/about/page.tsx` with your actual photo:
```tsx
<img src="/your-photo.jpg" alt="Nayan Kanaparthi" className="w-48 h-48 rounded-full" />
```

### Add Your CV
1. Place your CV PDF in the `public` directory
2. Update the link in `app/about/page.tsx`:
```tsx
<a href="/cv.pdf" download>Download CV</a>
```

## Production Deployment

### For Vercel Deployment

1. **Set up Upstash KV (Required for Content Management)**
   - Go to your Vercel project dashboard
   - Click on the **Marketplace** tab (or go to your project → Integrations)
   - Search for **"Upstash"** or **"Upstash KV"**
   - Click on **Upstash** (you'll see it in the Native Storage Integrations)
   - Click **Add Integration** or **Create Database**
   - Follow the prompts to create your Upstash KV database
   - Vercel will automatically add the required environment variables:
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`
   - These are automatically available to your application

2. **Set Environment Variables**
   In your Vercel project settings, add:
   ```
   ADMIN_PASSWORD_HASH=your_generated_hash_here
   JWT_SECRET=your_random_secret_string_here
   NODE_ENV=production
   ```

3. **Deploy**
   - Push your code to GitHub
   - Vercel will automatically deploy
   - Or use: `vercel --prod`

### For Other Platforms (Netlify, etc.)

**Important:** The content management system requires write access to storage. On serverless platforms with read-only filesystems, you'll need to:

1. **Option A: Use a Database**
   - Set up a database (PostgreSQL, MongoDB, etc.)
   - Update `lib/content.ts` to use your database instead of file system

2. **Option B: Use GitHub API**
   - Implement GitHub API integration to commit changes back to your repository
   - This requires GitHub token setup

3. **Option C: Use External Storage**
   - Use services like Supabase, Firebase, or AWS S3
   - Update `lib/content.ts` accordingly

**Note:** The current implementation uses Upstash Redis (KV) for production on Vercel, and file system for local development. Upstash is available in the Vercel Marketplace under "Native Storage Integrations".

The site is fully production-ready with:
- Server-side rendering
- Optimized images
- SEO-friendly structure
- Secure admin authentication
- RSS feed generation
- Content management system (requires KV on Vercel)


