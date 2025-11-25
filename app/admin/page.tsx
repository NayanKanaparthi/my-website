import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

export default async function AdminDashboard() {
  const posts = await getAllPosts(true)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-navy mb-2">Admin Dashboard</h1>
        <p className="text-navy/70">Manage your blog posts and website content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/content"
          className="block bg-violet text-white p-6 rounded-lg hover:bg-violet/90 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">Content Management</h2>
          <p className="text-violet-100 text-sm">Edit work, ventures, about page, and homepage content</p>
        </Link>
        
        <Link
          href="/admin/posts"
          className="block bg-navy text-white p-6 rounded-lg hover:bg-navy/90 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">Blog Posts</h2>
          <p className="text-navy-100 text-sm">Manage all your blog posts and articles</p>
        </Link>
        
        <Link
          href="/admin/new"
          className="block border-2 border-violet text-violet p-6 rounded-lg hover:bg-violet/5 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">New Post</h2>
          <p className="text-navy/70 text-sm">Create a new blog post</p>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-navy/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-navy/10">
          <h2 className="text-xl font-semibold text-navy">Recent Posts</h2>
        </div>
        <div className="divide-y divide-navy/10">
          {posts.length === 0 ? (
            <div className="px-6 py-8 text-center text-navy/60">
              No posts yet. <Link href="/admin/new" className="text-violet hover:underline">Create your first post!</Link>
            </div>
          ) : (
            posts.map((post) => (
              <Link
                key={post.slug}
                href={`/admin/posts/${post.slug}`}
                className="block px-6 py-4 hover:bg-offwhite transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-navy mb-1">{post.title}</h3>
                    <p className="text-sm text-navy/60">{formatDate(post.date)}</p>
                  </div>
                  <div className="text-sm text-navy/50">
                    {post.published ? (
                      <span className="text-green-600">Published</span>
                    ) : (
                      <span className="text-yellow-600">Draft</span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
