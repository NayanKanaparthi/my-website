# Nayan Kanaparthi - Personal Portfolio Website

A modern, professional portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Homepage**: Hero section, featured work, writing preview, playbooks, and institution logos
- **Work**: Consulting-style case studies with detailed analysis
- **Ventures**: Clean descriptive blocks for projects and initiatives
- **Writing**: Medium-like reading experience with Markdown support, LaTeX, code highlighting
- **Experiments**: Dark-mode card grid for prototypes and tools
- **Talks & Teaching**: Clean cards for workshops, panels, and educational sessions
- **About**: Bio, timeline, skills, and CV download
- **Contact**: Simple contact form
- **Admin Portal**: Secure password-protected blog publishing system with rich text editor
- **Now Page**: Current activities and focus areas
- **RSS Feed**: Automatic RSS feed generation

## Design System

- **Colors**: Deep navy (#0A0F2C), electric violet (#6A5AE0), soft off-white (#F9F9FB)
- **Typography**: Inter/Manrope for headings, Source Serif Pro for body text, JetBrains Mono for code
- **Aesthetic**: Minimal, elegant, spacious (inspired by Notion, Medium, McKinsey, NYU Stern)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env.local
ADMIN_PASSWORD_HASH=<bcrypt hash of your password>
JWT_SECRET=<random secret string>
```

To generate a password hash:
```bash
npm run generate-hash your-password
```

Or manually:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(console.log)"
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Admin Portal

Access the admin portal at `/admin` (password-protected). Features include:

- Rich text editor with Markdown support
- H1-H3 headings, bold/italic, lists, blockquotes
- Code blocks with syntax highlighting
- LaTeX support for mathematical expressions
- Image uploads with captions
- Metadata fields (tags, summary, cover image, SEO description)
- Autosave drafts every 30 seconds
- Preview mode
- Publish/draft toggle

## Blog Posts

Blog posts are stored as Markdown files in `content/posts/`. Each post includes frontmatter with metadata:

```markdown
---
title: "Post Title"
date: "2024-01-01"
summary: "Post summary"
tags:
  - tag1
  - tag2
coverImage: "/path/to/image.jpg"
seoDescription: "SEO description"
published: true
---

Post content in Markdown...
```

## Deployment

The site is ready to deploy on Vercel, Netlify, or any platform that supports Next.js.

## License

MIT License
