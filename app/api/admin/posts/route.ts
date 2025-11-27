import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { isAuthenticated } from '@/lib/auth'
import { getAllPosts } from '@/lib/posts'
import { put } from '@vercel/blob'

const postsDirectory = path.join(process.cwd(), 'content/posts')
const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

export async function GET(request: NextRequest) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const posts = await getAllPosts(true) // Include drafts
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const frontmatter: any = {
      title: data.title,
      date: data.date || new Date().toISOString(),
      summary: data.summary,
      tags: data.tags || [],
      coverImage: data.coverImage,
      seoDescription: data.seoDescription,
      published: data.published || false,
    }
    
    if (data.pdfFile) {
      frontmatter.pdfFile = data.pdfFile
    }

    const content = `---\n${Object.entries(frontmatter)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}:\n${value.map((v) => `  - ${v}`).join('\n')}`
        }
        return `${key}: ${typeof value === 'string' ? `"${value}"` : value}`
      })
      .join('\n')}\n---\n\n${data.content || ''}`

    if (isProduction) {
      // Use Vercel Blob Storage in production
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return NextResponse.json(
          { 
            error: 'Vercel Blob Storage is not configured. Please add Blob storage in your Vercel project. ' +
                   'Go to your Vercel project → Storage → Create Database → Blob. ' +
                   'After adding Blob storage, redeploy your project.'
          },
          { status: 500 }
        )
      }

      try {
        const blob = await put(`posts/${slug}.md`, content, {
          access: 'public',
          contentType: 'text/markdown',
        })
        return NextResponse.json({ slug, success: true, url: blob.url })
      } catch (blobError) {
        console.error('Blob upload error:', blobError)
        const errorMessage = blobError instanceof Error ? blobError.message : 'Unknown error'
        return NextResponse.json(
          { 
            error: `Failed to save post to Blob storage: ${errorMessage}. ` +
                   'Please verify that Blob storage is properly configured in your Vercel project.'
          },
          { status: 500 }
        )
      }
    } else {
      // Development: Save to local file system
      if (!fs.existsSync(postsDirectory)) {
        fs.mkdirSync(postsDirectory, { recursive: true })
      }

      const filePath = path.join(postsDirectory, `${slug}.md`)
      fs.writeFileSync(filePath, content, 'utf8')

      return NextResponse.json({ slug, success: true })
    }
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}


