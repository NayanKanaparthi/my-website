import fs from 'fs'
import path from 'path'

const contentDirectory = path.join(process.cwd(), 'content')

// Check if we're in production (Vercel)
const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

// Lazy initialization of Upstash Redis
let redis: any = null
let redisInitialized = false

function getRedisClient() {
  if (!isProduction) {
    return null
  }

  // Initialize Redis lazily (on first use) to ensure env vars are available
  if (!redisInitialized) {
    try {
      const { Redis } = require('@upstash/redis')
      
      // Try fromEnv() first (recommended by Upstash)
      try {
        redis = Redis.fromEnv()
        if (redis) {
          console.log('Upstash Redis initialized using fromEnv()')
          redisInitialized = true
          return redis
        }
      } catch (fromEnvError) {
        console.log('fromEnv() failed, trying manual initialization:', fromEnvError)
      }
      
      // Fallback to manual initialization if fromEnv() doesn't work
      // Check for various possible environment variable names
      const url = process.env.UPSTASH_REDIS_REST_URL || 
                  process.env.KV_REST_API_URL
      const token = process.env.UPSTASH_REDIS_REST_TOKEN || 
                    process.env.KV_REST_API_TOKEN
      
      if (url && token) {
        redis = new Redis({
          url: url,
          token: token,
        })
        console.log('Upstash Redis initialized using manual config')
        redisInitialized = true
        return redis
      } else {
        console.warn('Upstash Redis environment variables not found. Available env vars:', {
          UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
          UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
          KV_REST_API_URL: !!process.env.KV_REST_API_URL,
          KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
        })
      }
    } catch (error) {
      console.error('Failed to initialize Upstash Redis:', error)
      redisInitialized = true // Mark as initialized to prevent retry loops
    }
  }
  
  return redis
}

export interface WorkItem {
  slug: string
  title: string
  client: string
  year: string
  category: string
  context?: string
  problem?: string
  approach?: string
  frameworks?: string[]
  implementation?: string[]
  outcomes?: string[]
  learnings?: string[]
}

export interface Venture {
  title: string
  description: string
  status: string
  year: string
  link?: string
  image?: string
}

export interface Talk {
  title: string
  type: string
  venue: string
  year: string
  description: string
}

export interface Experiment {
  title: string
  description: string
  status: string
  tags: string[]
}

export interface Education {
  university: string
  major: string
  relevantCoursework: string
  location: string
  year: string
  universityLogo?: string
}

export interface AboutContent {
  bio: string
  image?: string
  professionalExperience: Experience[]
  leadershipExperience: Experience[]
  education: Education[]
  skills: {
    Strategy: string[]
    AI: string[]
    Quantitative: string[]
    Product: string[]
  }
}

export interface HomeContent {
  hero: {
    title: string
    subtitle: string
    image?: string
  }
  featuredWork: string[] // Array of work item slugs (max 3)
  featuredBlogs: string[] // Array of blog post slugs (max 3)
  featuredVentures: number[] // Array of venture indices (max 3)
  featuredProjects: number[] // Array of project indices (max 3)
  institutions: Array<string | { image: string; name?: string }> // Array of institution logos (image URLs or objects with image/name)
  socialLinks?: {
    twitter?: string
    linkedin?: string
  }
}

export interface Project {
  title: string
  description: string
  image?: string
  githubLink?: string
  projectLink?: string
  type?: 'project' | 'paper' | 'website'
  category?: string
  date?: string
  tags?: string[]
}

export interface Message {
  id: string
  name: string
  email: string
  message: string
  date: string
  read?: boolean
}

export interface Experience {
  title: string
  company: string
  location?: string
  startDate: string
  endDate?: string
  description: string
  companyImage?: string
}

// Helper functions to read/write JSON files
function getContentPath(filename: string): string {
  if (!fs.existsSync(contentDirectory)) {
    fs.mkdirSync(contentDirectory, { recursive: true })
  }
  return path.join(contentDirectory, filename)
}

export async function readContent<T>(filename: string, defaultValue: T): Promise<T> {
  // Use Upstash Redis in production if available
  const redisClient = getRedisClient()
  if (isProduction && redisClient) {
    try {
      const key = `content:${filename}`
      const content = await redisClient.get(key)
      if (content !== null) {
        // Parse JSON string back to object
        return typeof content === 'string' ? JSON.parse(content) : content
      }
      // If not found in Redis, fall through to read from committed files
    } catch (error) {
      console.error(`Error reading from Redis for ${filename}:`, error)
      // Fall through to read from committed files
    }
  }
  
  // Use file system (works for reading in both dev and production from committed files)
  const filePath = getContentPath(filename)
  if (!fs.existsSync(filePath)) {
    // In production, if file doesn't exist and Redis is available, try to write default to Redis
    if (isProduction && redisClient) {
      try {
        await writeContent(filename, defaultValue)
        return defaultValue
      } catch {
        // If write fails, just return default
        return defaultValue
      }
    }
    // In development, write to file system
    if (!isProduction) {
      await writeContent(filename, defaultValue)
    }
    return defaultValue
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch {
    return defaultValue
  }
}

export async function writeContent<T>(filename: string, data: T): Promise<void> {
  // Use Upstash Redis in production
  if (isProduction) {
    const redisClient = getRedisClient()
    if (!redisClient) {
      // Provide helpful error message with debugging info
      const envInfo = {
        UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
        KV_REST_API_URL: !!process.env.KV_REST_API_URL,
        KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
        VERCEL: !!process.env.VERCEL,
        NODE_ENV: process.env.NODE_ENV,
      }
      throw new Error(
        'Upstash Redis is not configured. Please set up Upstash Redis in your Vercel project. ' +
        'Go to your Vercel project → Marketplace → Search for "Upstash" → Add "Upstash for Redis" integration. ' +
        'After adding, redeploy your project. ' +
        `Debug info: ${JSON.stringify(envInfo)}`
      )
    }
    try {
      const key = `content:${filename}`
      // Store as JSON string
      await redisClient.set(key, JSON.stringify(data))
      console.log(`Successfully saved ${filename} to Redis`)
      return
    } catch (error) {
      console.error(`Error writing to Redis for ${filename}:`, error)
      throw new Error(`Failed to save content to Redis: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  // Use file system in development
  const filePath = getContentPath(filename)
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
  } catch (error) {
    console.error(`Error writing file ${filename}:`, error)
    throw error
  }
}

// Content getters
export async function getWorkItems(): Promise<WorkItem[]> {
  return readContent<WorkItem[]>('work.json', [])
}

export async function getVentures(): Promise<Venture[]> {
  return readContent<Venture[]>('ventures.json', [])
}

export async function getTalks(): Promise<Talk[]> {
  return readContent<Talk[]>('talks.json', [])
}

export async function getExperiments(): Promise<Experiment[]> {
  return readContent<Experiment[]>('experiments.json', [])
}

export async function getAboutContent(): Promise<AboutContent> {
  return readContent<AboutContent>('about.json', {
    bio: '',
    professionalExperience: [],
    leadershipExperience: [],
    education: [],
    skills: {
      Strategy: [],
      AI: [],
      Quantitative: [],
      Product: [],
    },
  })
}

export async function getHomeContent(): Promise<HomeContent> {
  return readContent<HomeContent>('home.json', {
    hero: {
      title: 'Building at the intersection of strategy, AI, and quantitative thinking',
      subtitle: 'Founder, strategist, and AI builder exploring the frontiers of technology and business.',
    },
    featuredWork: [], // Array of work item slugs (max 3)
    featuredBlogs: [], // Array of blog post slugs (max 3)
    featuredVentures: [], // Array of venture indices (max 3)
    featuredProjects: [], // Array of project indices (max 3)
    institutions: [],
  })
}

export async function getProjects(): Promise<Project[]> {
  return readContent<Project[]>('projects.json', [])
}

export async function saveProjects(projects: Project[]): Promise<void> {
  await writeContent('projects.json', projects)
}

export async function getMessages(): Promise<Message[]> {
  return readContent<Message[]>('messages.json', [])
}

export async function saveMessage(message: Message): Promise<void> {
  const messages = await getMessages()
  messages.unshift(message) // Add to beginning
  await writeContent('messages.json', messages)
}

export async function saveMessages(messages: Message[]): Promise<void> {
  await writeContent('messages.json', messages)
}

// Content setters
export async function saveWorkItems(items: WorkItem[]): Promise<void> {
  await writeContent('work.json', items)
}

export async function saveVentures(items: Venture[]): Promise<void> {
  await writeContent('ventures.json', items)
}

export async function saveTalks(items: Talk[]): Promise<void> {
  await writeContent('talks.json', items)
}

export async function saveExperiments(items: Experiment[]): Promise<void> {
  await writeContent('experiments.json', items)
}

export async function saveAboutContent(content: AboutContent): Promise<void> {
  await writeContent('about.json', content)
}

export async function saveHomeContent(content: HomeContent): Promise<void> {
  await writeContent('home.json', content)
}


