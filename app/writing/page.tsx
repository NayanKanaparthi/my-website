import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

export default async function WritingPage() {
  const posts = await getAllPosts()

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold text-navy mb-4">Writing</h1>
        <p className="text-xl text-navy/70 max-w-2xl">
          Thoughts on strategy, AI, quantitative thinking, and building at the intersection of technology and business.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-navy/60">No posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="block group"
            >
              <article className="bg-white rounded-lg p-8 border border-navy/10 hover:border-violet/30 hover:shadow-lg transition-all duration-300">
                <h2 className="text-2xl font-semibold text-navy mb-3 group-hover:text-violet transition-colors">
                  {post.title}
                </h2>
                <p className="text-navy/70 leading-relaxed mb-4 serif">
                  {post.summary || post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-navy/50">
                  <div className="flex items-center space-x-4">
                    <span>{formatDate(post.date)}</span>
                    <span>•</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex items-center space-x-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium text-violet bg-violet/10 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}


