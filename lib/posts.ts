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

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  return fs.readdirSync(postsDirectory)
    .filter((file: string) => file.endsWith('.md'))
    .map((file: string) => file.replace(/\.md$/, ''))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    if (!fs.existsSync(fullPath)) {
      return null
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8')
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
  const slugs = getPostSlugs()
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

