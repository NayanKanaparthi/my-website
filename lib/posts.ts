import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { readTime } from './utils'

export interface Post {
  slug: string
  title: string
  date: string
  summary?: string
  excerpt: string
  content: string
  tags?: string[]
  coverImage?: string
  pdfFile?: string
  seoDescription?: string
  published: boolean
  readingTime: number
}

const postsDirectory = path.join(process.cwd(), 'content/posts')
const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

// Lazy initialization of Upstash Redis (same pattern as content.ts)
let redis: any = null
let redisInitialized = false

function getRedisClient() {
  if (!isProduction) {
    return null
  }

  if (!redisInitialized) {
    try {
      const { Redis } = require('@upstash/redis')
      
      try {
        redis = Redis.fromEnv()
        if (redis) {
          redisInitialized = true
          return redis
        }
      } catch (fromEnvError) {
        // Fall through to manual initialization
      }
      
      const url = process.env.UPSTASH_REDIS_REST_URL || 
                  process.env.KV_REST_API_URL
      const token = process.env.UPSTASH_REDIS_REST_TOKEN || 
                    process.env.KV_REST_API_TOKEN
      
      if (url && token) {
        redis = new Redis({
          url: url,
          token: token,
        })
        redisInitialized = true
        return redis
      }
    } catch (error) {
      console.error('Failed to initialize Upstash Redis for posts:', error)
      redisInitialized = true
    }
  }
  
  return redis
}

export async function getPostSlugs(): Promise<string[]> {
  const slugs = new Set<string>()

  // Get slugs from filesystem (posts committed to repo)
  if (fs.existsSync(postsDirectory)) {
    try {
      const filesystemSlugs = fs.readdirSync(postsDirectory)
        .filter((file: string) => file.endsWith('.md'))
        .map((file: string) => file.replace(/\.md$/, ''))
      filesystemSlugs.forEach(slug => slugs.add(slug))
    } catch (error) {
      console.error('Error reading posts from filesystem:', error)
    }
  }

  // In production, also get slugs from Redis (posts created after deployment)
  if (isProduction) {
    const redisClient = getRedisClient()
    if (redisClient) {
      try {
        // Get all post keys from Redis
        const keys = await redisClient.keys('post:*')
        const redisSlugs = keys
          .map((key: string) => key.replace('post:', ''))
        redisSlugs.forEach(slug => slugs.add(slug))
      } catch (error) {
        console.error('Error listing posts from Redis:', error)
      }
    }
  }

  return Array.from(slugs)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    let fileContents: string | null = null

    // Try filesystem first (for posts committed to repo)
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    if (fs.existsSync(fullPath)) {
      try {
        fileContents = fs.readFileSync(fullPath, 'utf8')
      } catch (error) {
        // Filesystem read failed, try Redis
        console.log(`Filesystem read failed for ${slug}, trying Redis`)
      }
    }

    // If not found in filesystem and in production, try Redis
    if (!fileContents && isProduction) {
      const redisClient = getRedisClient()
      if (redisClient) {
        try {
          const key = `post:${slug}`
          const content = await redisClient.get(key)
          if (content) {
            fileContents = typeof content === 'string' ? content : JSON.stringify(content)
          }
        } catch (error) {
          console.error(`Error fetching post ${slug} from Redis:`, error)
        }
      }
    }

    if (!fileContents) {
      return null
    }

    const { data, content } = matter(fileContents)

    const excerpt = content.substring(0, 200).replace(/[#*`]/g, '').trim() + '...'

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      summary: data.summary,
      excerpt,
      content,
      tags: data.tags || [],
      coverImage: data.coverImage,
      pdfFile: data.pdfFile,
      seoDescription: data.seoDescription,
      published: data.published !== false,
      readingTime: data.pdfFile ? 0 : readTime(content),
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

export async function getAllPosts(includeDrafts: boolean = false): Promise<Post[]> {
  const slugs = await getPostSlugs()
  const posts = await Promise.all(
    slugs.map((slug) => getPostBySlug(slug))
  )
  return posts
    .filter((post): post is Post => post !== null && (includeDrafts || post.published))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getRecentPosts(count: number = 5): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.slice(0, count)
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter((post) => post.tags?.includes(tag))
}

