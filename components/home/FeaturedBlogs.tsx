import Link from 'next/link'
import { getHomeContent } from '@/lib/content'
import { getAllPosts } from '@/lib/posts'

export default async function FeaturedBlogs() {
  const homeContent = await getHomeContent()
  const featuredBlogSlugs = homeContent.featuredBlogs || []
  const allPosts = await getAllPosts()
  
  // Get the actual blog posts based on slugs
  const featuredBlogs = featuredBlogSlugs
    .map((slug: string) => allPosts.find((post) => post.slug === slug))
    .filter((post): post is NonNullable<typeof post> => post !== undefined)
    .slice(0, 3) // Ensure max 3 items

  if (featuredBlogs.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featuredBlogs.map((post) => (
        <Link
          key={post.slug}
          href={`/blogs/${post.slug}`}
          className="group bg-white rounded-xl p-8 border border-navy/10 hover:border-violet/30 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet/5 rounded-full -mr-16 -mt-16 group-hover:bg-violet/10 transition-colors"></div>
          <div className="relative">
            <span className="text-xs font-semibold text-violet uppercase tracking-wider mb-3 block">Blog</span>
            <h3 className="text-xl font-semibold text-navy mb-4 group-hover:text-violet transition-colors leading-tight">
              {post.title}
            </h3>
            <p className="text-navy/70 text-sm leading-relaxed mb-4 line-clamp-3">
              {post.summary || post.excerpt}
            </p>
            <span className="text-xs font-medium text-violet/70 group-hover:text-violet transition-colors inline-flex items-center gap-1">
              Read more
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

