import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { isAuthenticated } from '@/lib/auth'
import { put, del as deleteBlob } from '@vercel/blob'

const postsDirectory = path.join(process.cwd(), 'content/posts')
const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const slug = params.slug

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
            error: 'Vercel Blob Storage is not configured. Please add Blob storage in your Vercel project.'
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
            error: `Failed to update post in Blob storage: ${errorMessage}`
          },
          { status: 500 }
        )
      }
    } else {
      // Development: Save to local file system
      const filePath = path.join(postsDirectory, `${slug}.md`)
      fs.writeFileSync(filePath, content, 'utf8')

      return NextResponse.json({ slug, success: true })
    }
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const slug = params.slug

    if (isProduction) {
      // Use Vercel Blob Storage in production
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return NextResponse.json(
          { 
            error: 'Vercel Blob Storage is not configured.'
          },
          { status: 500 }
        )
      }

      try {
        await deleteBlob(`posts/${slug}.md`)
        return NextResponse.json({ success: true })
      } catch (blobError) {
        console.error('Blob delete error:', blobError)
        // If blob doesn't exist, that's okay - return success
        return NextResponse.json({ success: true })
      }
    } else {
      // Development: Delete from local file system
      const filePath = path.join(postsDirectory, `${slug}.md`)

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        return NextResponse.json({ success: true })
      }

      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}


