import fs from 'fs'
import path from 'path'

const contentDirectory = path.join(process.cwd(), 'content')

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
  playbooks?: Array<{ title: string; description: string }> // Array of playbooks
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

export function readContent<T>(filename: string, defaultValue: T): T {
  const filePath = getContentPath(filename)
  if (!fs.existsSync(filePath)) {
    writeContent(filename, defaultValue)
    return defaultValue
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch {
    return defaultValue
  }
}

export function writeContent<T>(filename: string, data: T): void {
  const filePath = getContentPath(filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
}

// Content getters
export function getWorkItems(): WorkItem[] {
  return readContent<WorkItem[]>('work.json', [])
}

export function getVentures(): Venture[] {
  return readContent<Venture[]>('ventures.json', [])
}

export function getTalks(): Talk[] {
  return readContent<Talk[]>('talks.json', [])
}

export function getExperiments(): Experiment[] {
  return readContent<Experiment[]>('experiments.json', [])
}

export function getAboutContent(): AboutContent {
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

export function getHomeContent(): HomeContent {
  return readContent<HomeContent>('home.json', {
    hero: {
      title: 'Building at the intersection of strategy, AI, and quantitative thinking',
      subtitle: 'Founder, strategist, and AI builder exploring the frontiers of technology and business.',
    },
    featuredWork: [], // Array of work item slugs (max 3)
    institutions: [],
  })
}

export function getProjects(): Project[] {
  return readContent<Project[]>('projects.json', [])
}

export function saveProjects(projects: Project[]): void {
  writeContent('projects.json', projects)
}

export function getMessages(): Message[] {
  return readContent<Message[]>('messages.json', [])
}

export function saveMessage(message: Message): void {
  const messages = getMessages()
  messages.unshift(message) // Add to beginning
  writeContent('messages.json', messages)
}

export function saveMessages(messages: Message[]): void {
  writeContent('messages.json', messages)
}

// Content setters
export function saveWorkItems(items: WorkItem[]): void {
  writeContent('work.json', items)
}

export function saveVentures(items: Venture[]): void {
  writeContent('ventures.json', items)
}

export function saveTalks(items: Talk[]): void {
  writeContent('talks.json', items)
}

export function saveExperiments(items: Experiment[]): void {
  writeContent('experiments.json', items)
}

export function saveAboutContent(content: AboutContent): void {
  writeContent('about.json', content)
}

export function saveHomeContent(content: HomeContent): void {
  writeContent('home.json', content)
}


