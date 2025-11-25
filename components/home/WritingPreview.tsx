import Link from 'next/link'
import { getRecentPosts } from '@/lib/posts'

export default async function WritingPreview() {
  const posts = await getRecentPosts(3)

  if (posts.length === 0) {
    return (
      <div className="text-navy/60">
        <p>No posts yet. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blogs/${post.slug}`}
          className="group bg-white rounded-xl p-6 border border-navy/10 hover:border-violet/30 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet/5 rounded-full -mr-12 -mt-12 group-hover:bg-violet/10 transition-colors"></div>
          <div className="relative">
            <h3 className="text-xl font-semibold text-navy mb-3 group-hover:text-violet transition-colors leading-tight">
              {post.title}
            </h3>
            <p className="text-navy/70 text-sm leading-relaxed mb-4 line-clamp-3">
              {post.summary || post.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-navy/50 pt-4 border-t border-navy/5">
              {post.pdfFile ? (
                <span className="text-violet font-medium">PDF Document</span>
              ) : (
                <span>{post.readingTime} min read</span>
              )}
              <span className="group-hover:text-violet transition-colors font-medium inline-flex items-center gap-1">
                Read more
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}


