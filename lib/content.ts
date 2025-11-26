import fs from 'fs'
import path from 'path'

const contentDirectory = path.join(process.cwd(), 'content')

// Check if we're in production (Vercel)
const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

// Initialize Vercel KV only in production
let kv: any = null
if (isProduction) {
  try {
    // Check if KV environment variables are set
    if (process.env.KV_URL || process.env.KV_REST_API_URL) {
      // Import Vercel KV - it will use KV_URL, KV_REST_API_URL, KV_REST_API_TOKEN from environment
      const { kv: vercelKv } = require('@vercel/kv')
      kv = vercelKv
    } else {
      console.warn('Vercel KV environment variables not set. Content saving will not work in production.')
    }
  } catch (error) {
    console.warn('Vercel KV not available, falling back to file system:', error)
  }
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

export interface AboutContent {
  bio: string
  image?: string
  professionalExperience: Experience[]
  leadershipExperience: Experience[]
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
  // Use Vercel KV in production if available
  if (isProduction && kv) {
    try {
      const key = `content:${filename}`
      const content = await kv.get(key)
      if (content !== null) {
        return content as T
      }
      // If not found in KV, fall through to read from committed files
    } catch (error) {
      console.error(`Error reading from KV for ${filename}:`, error)
      // Fall through to read from committed files
    }
  }
  
  // Use file system (works for reading in both dev and production from committed files)
  const filePath = getContentPath(filename)
  if (!fs.existsSync(filePath)) {
    // In production, if file doesn't exist and KV is available, try to write default to KV
    if (isProduction && kv) {
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
  // Use Vercel KV in production
  if (isProduction) {
    if (!kv) {
      throw new Error(
        'Vercel KV is not configured. Please set up a KV database in your Vercel project. ' +
        'Go to Storage → Create Database → KV in your Vercel dashboard.'
      )
    }
    try {
      const key = `content:${filename}`
      await kv.set(key, data)
      return
    } catch (error) {
      console.error(`Error writing to KV for ${filename}:`, error)
      throw new Error(`Failed to save content to KV: ${error instanceof Error ? error.message : 'Unknown error'}`)
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


