# Content Management System Guide

Your website now has a **complete Content Management System (CMS)** that allows you to edit all content without touching code!

## How to Access

1. Go to `/admin` (password-protected)
2. Log in with your admin password
3. Click on **"Content"** in the navigation

## What You Can Edit

### 1. **Work/Projects** (`/admin/content` → Work tab)
- Add/edit/delete work items and case studies
- Edit: title, client, year, category, context, problem, approach
- Add frameworks, implementation steps, outcomes, and learnings
- Each work item appears on `/work` and has its own detail page

### 2. **Ventures** (`/admin/content` → Ventures tab)
- Add/edit/delete ventures
- Edit: title, description, status (Active/Research/Completed), year
- Appears on `/ventures` page

### 3. **Talks & Teaching** (`/admin/content` → Talks tab)
- Add/edit/delete talks, workshops, panels, podcasts
- Edit: title, type, venue, year, description
- Appears on `/talks` page

### 4. **Experiments** (`/admin/content` → Experiments tab)
- Add/edit/delete experiments and prototypes
- Edit: title, description, status, tags
- Appears on `/experiments` page

### 5. **About Page** (`/admin/content` → About tab)
- Edit your bio text
- Add/edit/delete timeline items (year, title, description)
- Manage skills by category (Strategy, AI, Quantitative, Product)
- Appears on `/about` page

### 6. **Homepage** (`/admin/content` → Home tab)
- Edit hero section (title and subtitle)
- Add/edit/delete featured work items
- Add/edit/delete playbooks
- Edit institution logos (one per line)
- Appears on the homepage (`/`)

## Blog Posts

Blog posts are managed separately at `/admin/posts`:
- Create new posts with the rich text editor
- Edit existing posts
- Publish or save as drafts
- Posts appear on `/writing` page

## How It Works

- All content is stored in JSON files in the `content/` directory
- Changes are saved immediately when you click "Save Changes"
- No code changes needed - everything is managed through the web interface
- Only you have access (password-protected)

## Tips

1. **Slug Format**: For work items, use lowercase with hyphens (e.g., `my-project-name`)
2. **Arrays**: For lists (like implementation steps), enter one item per line
3. **Tags**: Separate tags with commas
4. **Preview**: Always check your changes on the actual website after saving

## Need Help?

If you need to add new fields or sections, you can:
1. Edit the content management interface in `app/admin/content/page.tsx`
2. Update the content types in `lib/content.ts`
3. Update the pages to display the new fields

The system is designed to be easily extensible!


