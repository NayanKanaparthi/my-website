import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { isAuthenticated } from '@/lib/auth'
import { getAllPosts } from '@/lib/posts'

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
        console.error('Redis save error:', redisError)
        const errorMessage = redisError instanceof Error ? redisError.message : 'Unknown error'
        return NextResponse.json(
          { 
            error: `Failed to save post to Redis: ${errorMessage}. ` +
                   'Please verify that Upstash Redis is properly configured in your Vercel project.'
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


