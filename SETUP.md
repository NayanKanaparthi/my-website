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

1. Set environment variables in your hosting platform
2. Build the project: `npm run build`
3. Deploy to Vercel, Netlify, or your preferred platform

The site is fully production-ready with:
- Server-side rendering
- Optimized images
- SEO-friendly structure
- Secure admin authentication
- RSS feed generation


