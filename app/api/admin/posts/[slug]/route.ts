import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { isAuthenticated } from '@/lib/auth'

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
      // Use Redis in production
      try {
        const { Redis } = require('@upstash/redis')
        let redis
        
        try {
          redis = Redis.fromEnv()
        } catch {
          const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
          const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
          if (!url || !token) {
            throw new Error('Redis environment variables not found')
          }
          redis = new Redis({ url, token })
        }

        const key = `post:${slug}`
        await redis.set(key, content)
        return NextResponse.json({ slug, success: true })
      } catch (redisError) {
        console.error('Redis update error:', redisError)
        const errorMessage = redisError instanceof Error ? redisError.message : 'Unknown error'
        return NextResponse.json(
          { 
            error: `Failed to update post in Redis: ${errorMessage}`
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
      // Use Redis in production
      try {
        const { Redis } = require('@upstash/redis')
        let redis
        
        try {
          redis = Redis.fromEnv()
        } catch {
          const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
          const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
          if (!url || !token) {
            throw new Error('Redis environment variables not found')
          }
          redis = new Redis({ url, token })
        }

        const key = `post:${slug}`
        await redis.del(key)
        return NextResponse.json({ success: true })
      } catch (redisError) {
        console.error('Redis delete error:', redisError)
        // If post doesn't exist, that's okay - return success
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


